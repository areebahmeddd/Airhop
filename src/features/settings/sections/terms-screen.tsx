// Terms of Service, rendered in-app. Mirrors the content published at
// airhop.1mindlabs.org/terms-of-service.

import React from "react";
import LegalDocScreen, { type LegalSection } from "./legal-doc-screen";

interface Props {
  onBack: () => void;
}

const SECTIONS: LegalSection[] = [
  {
    heading: "About Airhop",
    paragraphs: [
      "Airhop is a free, open-source mobile application for offline peer-to-peer communication over Bluetooth mesh networks, built on the foundation of [bitchat](https://bitchat.free). It is an independent project, not backed by any company. By using this app, you agree to these terms.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: [
      "You may use Airhop for lawful purposes only. You are responsible for complying with the laws of your jurisdiction, including any regulations governing encrypted communications, radio frequency use, and peer-to-peer networks. Do not use Airhop to facilitate illegal activity or to harm others.",
    ],
  },
  {
    heading: "Content you post",
    paragraphs: [
      "Public channels, location channels, and bulletin-board notices are visible to anyone in range or in the same area, including people using other compatible apps. Treat anything posted there as public. You are responsible for what you post.",
      "**There is no central server, so we cannot moderate, edit, or delete what you or anyone else sends.** Deleting your own notice broadcasts a signed retraction that other devices honour, and notices expire on their own, but a copy that has already reached another device may remain there.",
      "If you turn on the internet gateway, your device relays other people's public location-channel messages. You do not author that content and cannot control it.",
    ],
  },
  {
    heading: "Offline payments",
    paragraphs: [
      "Airhop supports transferring Cashu ecash tokens directly between devices over the mesh. **We do not operate any payment infrastructure. We are not a financial institution, payment processor, or money services business.** Token transfers occur between devices without any involvement from this project. We have no ability to reverse, recover, or mediate any transaction.",
    ],
  },
  {
    heading: "No warranty",
    paragraphs: [
      'Airhop is provided "as is" without any warranty of any kind. We make no guarantees about reliability, availability, or fitness for a particular purpose.',
      "The app has not been formally security-audited by an external firm. An audit is planned but has not been completed. **Do not rely on Airhop as your only means of communication in life-safety situations.**",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by applicable law, we are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Airhop app, including loss of data, failed token transfers, or communication failures.",
    ],
  },
  {
    heading: "Open source license",
    paragraphs: [
      "The source code for Airhop is published under the MIT License on [GitHub](https://github.com/areebahmeddd/Airhop). The MIT License governs use, modification, and distribution of the code. These terms of service apply to use of the Airhop app, not to the source code itself.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "These terms may be updated from time to time. The date at the top of this page reflects the most recent revision. Continued use of the app after changes are posted means you accept the updated terms.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Questions about these terms can be sent to [hi@areeb.dev](mailto:hi@areeb.dev) or raised by opening an issue on [GitHub](https://github.com/areebahmeddd/Airhop/issues).",
    ],
  },
];

export default function TermsScreen({ onBack }: Props): React.JSX.Element {
  return (
    <LegalDocScreen
      title="Terms of Service"
      lastUpdated="September 01, 2026"
      sections={SECTIONS}
      onBack={onBack}
    />
  );
}
