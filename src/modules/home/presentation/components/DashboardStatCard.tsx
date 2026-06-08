import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardStatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}

const detailForLabel = (label: string, value: string): { caption: string; value: string } => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes('shift')) {
    return {
      caption: value === '--' ? 'Shift not assigned' : 'Scheduled shift',
      value: value === '--' ? 'Pending' : value,
    };
  }

  if (normalizedLabel.includes('holiday')) {
    return {
      caption: 'Calendar holidays',
      value: `${value} ${value === '1' ? 'day' : 'days'}`,
    };
  }

  return {
    caption: 'Scheduled days',
    value: `${value} ${value === '1' ? 'day' : 'days'}`,
  };
};

export const DashboardStatCard = ({
  icon,
  label,
  value,
}: DashboardStatCardProps) => {
  const detail = detailForLabel(label, value);

  return (
    <View style={styles.shadowWrap}>
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.46)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(143, 200, 255, 0.16)',
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.iconFrame}>
            <Feather color={reactNativeColorScheme.brand[700]} name={icon} size={17} />
          </View>
          <View style={styles.statusPill}>
            <Text adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={styles.statusValue}>
              {value}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.label}>
            {label}
          </Text>
          <Text numberOfLines={1} style={styles.detailCaption}>
            {detail.caption}
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.76} numberOfLines={1} style={styles.detailValue}>
            {detail.value}
          </Text>
        </View>

        <View pointerEvents="none" style={styles.innerStroke} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    borderColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: radius(18),
    borderWidth: 1,
    gap: spacing(10),
    minHeight: spacing(126),
    overflow: 'hidden',
    padding: spacing(14),
    width: '100%',
  },
  content: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  detailCaption: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  detailValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.26)',
    borderColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: radius(999),
    borderWidth: 1,
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  innerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: radius(18),
    borderWidth: 1,
    margin: 1,
  },
  label: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  shadowWrap: {
    borderRadius: radius(18),
    elevation: 4,
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
    width: '100%',
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    borderColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: radius(999),
    borderWidth: 1,
    minWidth: spacing(48),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(5),
  },
  statusValue: {
    color: reactNativeColorScheme.brand[700],
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
