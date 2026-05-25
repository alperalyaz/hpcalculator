import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface InfoTooltipProps {
  title: string;
  body: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, body }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.iconBtn}
      >
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Ionicons name="bulb-outline" size={18} color={Colors.accent} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.body}>{body}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>OK</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    marginLeft: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    fontSize: 16,
    flex: 1,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  closeText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 13,
  },
});
