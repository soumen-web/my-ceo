import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { DashboardNote } from '@/modules/home';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardInsightListProps {
  notes: DashboardNote[];
}

export const DashboardInsightList = ({ notes }: DashboardInsightListProps) => (
  <View style={styles.list}>
    {notes.map((note) => (
      <View key={note.id} style={styles.card}>
        <View style={styles.iconFrame}>
          <Feather color={reactNativeColorScheme.ultiHuman.accent} name="check-circle" size={18} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.body}>{note.body}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  body: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(19),
  },
  card: {
    alignItems: 'flex-start',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing(14),
    minHeight: spacing(82),
    padding: spacing(16),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(5), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(12),
  },
  copy: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 46, 70, 0.12)',
    borderColor: 'rgba(18, 46, 70, 0.28)',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  list: {
    gap: spacing(12),
  },
  title: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
  },
});
