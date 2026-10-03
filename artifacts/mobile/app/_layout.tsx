import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  Lora_400Regular,
  Lora_700Bold,
  useFonts as useLoraFonts,
} from "@expo-google-fonts/lora";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BibleProvider } from "@/context/BibleContext";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 250, fade: true });

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="reader/[bookId]/[chapter]"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [loraLoaded, loraError] = useLoraFonts({
    Lora_400Regular,
    Lora_700Bold,
  });

  const fontsLoaded = interLoaded && loraLoaded;
  const fontError = interError ?? loraError;

  useEffect(() => {
    // Hide splash immediately — don't block on fonts. They'll swap in when ready.
    SplashScreen.hideAsync();
  }, []);

  // Render the app right away so the splash can vanish without waiting for fonts.
  void fontsLoaded;
  void fontError;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <BibleProvider>
                <WebFrame>
                  <RootLayoutNav />
                </WebFrame>
              </BibleProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

// On web, center the mobile-first layout in a fixed-width column
// so the experience matches the mobile app on big screens.
function WebFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#E8E2D2",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 480,
          backgroundColor: "#F9F6EE",
          overflow: "hidden",
          ...(Platform.OS === "web"
            ? ({ boxShadow: "0 0 24px rgba(0,0,0,0.08)" } as object)
            : null),
        }}
      >
        {children}
      </View>
    </View>
  );
}
