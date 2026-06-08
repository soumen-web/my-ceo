import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UltiHumanLogo } from "@/components/brand";
import { reactNativeColorScheme, semanticColorTokens } from "@/design-system/tokens/colors";
import { ROUTES, type RootStackParamList } from "@/navigation/route-types";
import { spacing } from "@/utils/scale";

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash">;

export const SplashScreen = ({ navigation }: SplashScreenProps) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.replace(ROUTES.signIn);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <UltiHumanLogo size="xl" style={styles.logo} variant="hero" />
        <ActivityIndicator
          color={reactNativeColorScheme.ultiHuman.accent}
          size="small"
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: semanticColorTokens.dark.background,
    flex: 1,
    padding: spacing(24),
  },
  content: {
    alignItems: "center",
    flex: 1,
    gap: spacing(24),
    justifyContent: "center",
    paddingBottom: spacing(12),
    paddingTop: spacing(12),
    width: "100%",
  },
  loader: {
    marginTop: spacing(2),
  },
  logo: {
    alignSelf: "center",
    height: spacing(230),
    maxWidth: spacing(360),
    width: "100%",
  },
});
