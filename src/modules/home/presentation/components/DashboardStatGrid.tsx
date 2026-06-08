import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { DashboardStat } from '@/modules/home';
import { spacing } from '@/utils/scale';

import { DashboardStatCard } from './DashboardStatCard';

interface DashboardStatGridProps {
  stats: DashboardStat[];
}

export const DashboardStatGrid = ({ stats }: DashboardStatGridProps) => {
  const { width } = useWindowDimensions();
  const itemWidth = Math.min(spacing(184), Math.max(spacing(156), width * 0.42));

  if (!stats.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      bounces
      contentContainerStyle={styles.grid}
      showsHorizontalScrollIndicator={false}
    >
      {stats.map((card) => (
        <View key={card.id} style={[styles.item, { width: itemWidth }]}>
          <DashboardStatCard icon={card.icon} label={card.label} value={card.value} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing(10),
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(2),
  },
  item: {
    maxWidth: spacing(184),
    minWidth: spacing(156),
  },
});
