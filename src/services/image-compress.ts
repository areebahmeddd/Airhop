// Fit a photo inside the mesh's 512 KiB image budget before it is sent.
//
// A phone camera produces several megabytes. The wire limit is 512 KiB
// (bitchat's FileTransferLimits, mirrored in bitchat-file-packet), and at
// Bluetooth's ~22 KB/s even a file that fits takes half a minute, so sending
// the original is not something anyone wants even where it would be allowed.
// Every messenger resizes before sending for exactly this reason; this is that
// step, and nothing more.
//
// It changes nothing on the wire. The result is an ordinary JPEG in an ordinary
// FILE_TRANSFER packet, so a bitchat peer sees a photo it already knew how to
// read. The only difference is that it now arrives.
//
// Deliberately never throws: a photo that cannot be resized is still worth
// trying to send at its original size, where the size check in
// FileTransferService gives the sender a reason about their photo rather than a
// failure from inside an image library.

import * as FileSystem from "expo-file-system";
import {
  ImageManipulator,
  SaveFormat,
  type SaveOptions,
} from "expo-image-manipulator";
import {
  MAX_SENT_IMAGE_BYTES,
  resolveMimeType,
} from "../core/mesh/bitchat-file-packet";
import { CACHE_FILE_PREFIX } from "./file-transfer-service";

// Longest edge of a sent photo. 1600 is still worth looking at full screen on a
// phone, and is where WhatsApp and Signal settle; past it the extra pixels cost
// transfer minutes nobody sees.
const MAX_EDGE = 1600;

// Below this, JPEG artefacts are visible on a phone screen, so no rung goes
// under it however low the starting quality is. The edge shrinks instead.
const MIN_QUALITY = 0.3;

// Quality ladder, starting from the user's Upload quality setting. The first
// pass under budget wins, so an ordinary photo pays for one encode and only a
// stubborn one walks down the list. The lower rungs shrink the edge as well:
// past a point it is resolution costing the bytes, not the quality.
//
// Starting from the setting is what makes it mean something. It used to only
// reach the picker, which this step then re-encoded over the top of, so "High"
// and "Medium" produced the same file for exactly the photos big enough to
// care. Now Low starts lower and lands in one pass; High starts high, keeps
// more detail, and may take a pass or two to fit.
function attemptsFor(quality: number): { maxEdge: number; compress: number }[] {
  const step = (factor: number): number =>
    Math.max(MIN_QUALITY, Math.round(quality * factor * 100) / 100);
  return [
    { maxEdge: MAX_EDGE, compress: step(1) },
    { maxEdge: MAX_EDGE, compress: step(0.7) },
    { maxEdge: 1200, compress: step(0.6) },
    { maxEdge: 800, compress: step(0.6) },
  ];
}

export interface PreparedImage {
  uri: string;
  mimeType: string;
  name: string;
  sizeBytes: number;
}

function fileSize(uri: string): number {
  try {
    const file = new FileSystem.File(uri);
    return file.exists ? file.size : 0;
  } catch {
    return 0;
  }
}

// Replace the extension, so a resized photo is not still called "IMG_1234.heic"
// once it is a JPEG. The receiver reads the type off the MIME, but the name is
// what a person sees in a document row and in a share sheet.
function jpegName(name: string | undefined): string {
  const base = (name ?? "photo").replace(/\.[^.]+$/, "");
  return `${base || "photo"}.jpg`;
}

// Distinguishes two photos resized in the same millisecond.
let resizeSeq = 0;

// Move the resized file under Airhop's cache prefix, so Settings → Storage
// counts it and its Clear button can free it, the same as every received
// attachment. Best-effort: if the move fails the file is still perfectly
// usable where the manipulator left it.
async function adoptIntoAttachmentCache(
  uri: string,
  name: string,
): Promise<string> {
  try {
    resizeSeq += 1;
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64);
    const destination = new FileSystem.File(
      FileSystem.Paths.cache,
      `${CACHE_FILE_PREFIX}${String(Date.now())}_${String(resizeSeq)}_${safeName}`,
    );
    await new FileSystem.File(uri).move(destination);
    return destination.uri;
  } catch {
    return uri;
  }
}

// Resize and re-encode until the file fits the image budget. Returns the
// original untouched when it already fits and is a format the mesh carries, or
// when the image cannot be read.
export async function prepareImageForSend(
  uri: string,
  name?: string,
  mimeType?: string,
  // The user's Upload quality setting, 0-1. Sets where the ladder starts.
  quality = 0.7,
): Promise<PreparedImage> {
  const original: PreparedImage = {
    uri,
    // Resolved, never assumed. Defaulting an unlabelled file to image/jpeg
    // would put that on the wire for a PNG, and the receiver checks the
    // declared type against the file's magic bytes: it would have thrown the
    // photo away for lying about itself.
    mimeType: resolveMimeType(mimeType, name),
    name: name ?? "photo.jpg",
    sizeBytes: fileSize(uri),
  };
  // Small enough, and in a format the far side renders as a picture: sending it
  // as it is beats re-encoding, which only costs quality.
  //
  // The format half matters for HEIC, which is what an iPhone camera produces
  // and what neither Airhop nor bitchat carries. resolveMimeType turns it into
  // octet-stream, so it fails this test and goes through the JPEG pass below
  // and arrives as a photo, rather than landing as an unopenable document.
  const carriedAsImage = original.mimeType.startsWith("image/");
  if (
    carriedAsImage &&
    original.sizeBytes > 0 &&
    original.sizeBytes <= MAX_SENT_IMAGE_BYTES
  ) {
    return original;
  }

  // Source dimensions, read once, so each attempt below is a single render.
  let sourceWidth: number;
  let sourceHeight: number;
  try {
    const probe = await ImageManipulator.manipulate(uri).renderAsync();
    sourceWidth = probe.width;
    sourceHeight = probe.height;
  } catch {
    return original;
  }
  const longestEdge = Math.max(sourceWidth, sourceHeight);
  if (longestEdge <= 0) return original;

  let best: PreparedImage | null = null;
  for (const attempt of attemptsFor(quality)) {
    try {
      const context = ImageManipulator.manipulate(uri);
      // Only ever scale down. Enlarging a small photo to the cap would add
      // bytes to something that was already fine. Width alone: the library
      // keeps the ratio, which avoids rounding the two edges apart.
      if (longestEdge > attempt.maxEdge) {
        const scale = attempt.maxEdge / longestEdge;
        context.resize({ width: Math.round(sourceWidth * scale) });
      }
      const options: SaveOptions = {
        compress: attempt.compress,
        format: SaveFormat.JPEG,
      };
      const rendered = await context.renderAsync();
      const saved = await rendered.saveAsync(options);
      const sizeBytes = fileSize(saved.uri);
      if (sizeBytes <= 0) continue;

      const outputName = jpegName(name);
      const candidate: PreparedImage = {
        uri: await adoptIntoAttachmentCache(saved.uri, outputName),
        mimeType: "image/jpeg",
        name: outputName,
        sizeBytes,
      };
      if (sizeBytes <= MAX_SENT_IMAGE_BYTES) return candidate;
      // Keep the smallest seen, so if a harsher rung fails outright we still
      // have something better than the original to fall back on.
      if (best === null || sizeBytes < best.sizeBytes) best = candidate;
    } catch {
      // Unreadable, unsupported, or out of memory. A harsher rung would fail
      // the same way, so stop here.
      break;
    }
  }

  // Nothing fit. Send the smallest version we managed and let the size check in
  // FileTransferService be the one to refuse it.
  return best ?? original;
}
