import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useContactsStore } from "../../store/contacts";

type ContactInfoSheetProps = {
  peerID: string;
  contact: {
    source: string;
    nickname?: string;
    generatedUsername: string;
  };
};

export function ContactInfoSheet({ peerID, contact }: ContactInfoSheetProps) {
  const canRename = contact.source === "qr";
  const renameContact = useContactsStore((s) => s.renameContact);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(contact.nickname ?? "");

  const handleSave = useCallback(() => {
    renameContact(peerID, draft || undefined);
    setIsEditing(false);
  }, [draft, peerID, renameContact]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Local Nickname</Text>
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              autoFocus
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Enter nickname"
              onSubmitEditing={handleSave}
            />
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => canRename && setIsEditing(true)}>
            <Text style={styles.value}>{contact.nickname ?? "Set nickname"}</Text>
          </Pressable>
        )}
        {!canRename && (
          <Text style={styles.helper}>Only QR-verified contacts can be renamed locally.</Text>
        )}
      </View>
      <Text style={styles.generated}>{contact.generatedUsername}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, color: "#888", marginBottom: 4 },
  editRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8 },
  saveBtn: { padding: 8 },
  saveText: { color: "#007AFF", fontWeight: "600" },
  value: { fontSize: 16 },
  helper: { fontSize: 11, color: "#666", marginTop: 4 },
  generated: { fontFamily: "monospace", fontSize: 12, color: "#999" },
});
