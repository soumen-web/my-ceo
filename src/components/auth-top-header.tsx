import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { splashImages } from '@/assets/images/splash';
import { BrandColors } from '@/constants/theme';
import { fontSize, spacing } from '@/utils/scale';

interface AuthTopHeaderProps {
  title: string;
}

export const AuthTopHeader = ({ title }: AuthTopHeaderProps) => (
  <View style={styles.container}>
    <LinearGradient
      colors={[BrandColors.ultiHuman.pinkPrimary400, BrandColors.ultiHuman.pinkPrimary300]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    />
    <ExpoImage contentFit="contain" source={splashImages.topFlower} style={styles.flower} />
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomLeftRadius: spacing(20),
    borderBottomRightRadius: spacing(20),
    height: spacing(220),
    justifyContent: 'center',
    overflow: 'visible',
    width: '100%',
    zIndex: 4,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    borderBottomLeftRadius: spacing(20),
    borderBottomRightRadius: spacing(20),
    zIndex: 1,
  },
  flower: {
    height: spacing(220),
    opacity: 0.52,
    position: 'absolute',
    right: -spacing(5),
    top: -spacing(50),
    width: spacing(200),
    zIndex: 3,
  },
  title: {
    color: BrandColors.ultiHuman.textPrimary,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(42),
    lineHeight: spacing(66),
    textAlign: 'center',
    zIndex: 2,
  },
});
