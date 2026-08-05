// The one sheet for paying a person.
//
// Shown from every door that pays somebody: the DM thread's attach menu, the
// contact info sheet, the Mesh tab's peer sheet, and the Wallet tab's Zap. It is
// deliberately the SAME component in all of them, for the same reason
// contact-info-sheet is: four copies of an amount field are four chances to
// disagree about what happens after the user taps Send, and this one is spending
// their money.
//
// The sheet does not choose a rail. `payPerson` does, from who the recipient is
// and what is reachable, and hands back which rail it used and whether the
// payment can still be pulled back. All this does is collect an amount and
// report that answer in the same words every time.

import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useT } from "../../i18n";
import {
  describePayResult,
  payPerson,
  type PayResult,
} from "../../services/ecash-transfer";
import { showAlert } from "../../store/alert-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  // Who is being paid. At least one of these must be set; both is better,
  // because the peer ID names the thread and the Nostr key unlocks NIP-61.
  peerID?: string;
  nostrPubkey?: string;
  displayName: string;
  // The sender's real nickname, for the local echo in the thread. Callers
  // outside a conversation can leave it out and get "You".
  senderNickname?: string;
}

export default function SendEcashSheet({
  visible,
  onClose,
  peerID,
  nostrPubkey,
  displayName,
  senderNickname,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [sending, setSending] = useState(false);

  function reset(): void {
    setAmount("");
    setMemo("");
  }

  async function handleSend(): Promise<void> {
    const sats = parseInt(amount, 10);
    if (!sats || sats <= 0 || sending) return;

    // Quoting and the nutzap lookup both await the network, so without this a
    // double tap starts two payments.
    setSending(true);
    let result: PayResult | null;
    try {
      result = await payPerson({
        ...(peerID !== undefined ? { peerID } : {}),
        ...(nostrPubkey !== undefined ? { nostrPubkey } : {}),
        amount: sats,
        memo: memo.trim() || undefined,
        ...(senderNickname !== undefined ? { senderNickname } : {}),
      });
    } finally {
      setSending(false);
    }
    // Cancelled, or refused with its own alert already on screen.
    if (!result) return;

    reset();
    onClose();
    showAlert(
      T("wallet.pay.sent_title", {
        amount: result.amount.toLocaleString(),
        unit: result.unit,
        name: displayName,
      }),
      describePayResult(result),
    );
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <Text style={styles.title}>{T("wallet.pay.title")}</Text>
      <Text style={styles.subtitle}>
        {T("wallet.pay.to", { name: displayName })}
      </Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder={T("wallet.pay.amount")}
        placeholderTextColor={Colors.textMuted}
        keyboardType="number-pad"
        returnKeyType="next"
        selectionColor={Colors.accent}
      />
      <TextInput
        style={[styles.input, styles.inputCompact]}
        value={memo}
        onChangeText={setMemo}
        placeholder={T("wallet.pay.memo")}
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="sentences"
        selectionColor={Colors.accent}
      />
      <View style={styles.actions}>
        <Pressable
          style={[
            styles.confirm,
            (!amount.trim() || sending) && styles.confirmDisabled,
          ]}
          onPress={() => void handleSend()}
          disabled={!amount.trim() || sending}
          accessibilityRole="button"
          accessibilityLabel={T("wallet.pay.send")}
        >
          <Text style={styles.confirmText}>
            {sending ? T("wallet.pay.sending") : T("wallet.pay.send")}
          </Text>
        </Pressable>
        <Pressable
          style={styles.cancel}
          onPress={() => {
            reset();
            onClose();
          }}
          accessibilityRole="button"
          accessibilityLabel={T("common.cancel")}
        >
          <Text style={styles.cancelText}>{T("common.cancel")}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    input: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
    },
    inputCompact: {
      marginTop: -Spacing.xs,
    },
    actions: {
      width: "100%",
      marginTop: Spacing.xs,
    },
    confirm: {
      width: "100%",
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmDisabled: {
      opacity: 0.4,
    },
    confirmText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    cancel: {
      width: "100%",
      minHeight: 50,
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    // Dismiss actions read at full contrast, matching the wallet sheets, the
    // scanner and the alert buttons: a muted label on a filled pill reads as
    // disabled rather than as the quieter of two choices.
    cancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
  });
}
