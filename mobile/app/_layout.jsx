import { Stack, useRouter, useSegments,Redirect, SplashScreen  } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen"
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import AppSplashScreen from '../components/AppSplashScreen'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

const router = useRouter();
const segments = useSegments();


const { checkAuth,user,token } = useAuthStore()
  const [isReady, setIsReady] = useState(false);



  useEffect(() => {
    // Wait for segments and user to load
    setIsReady(true);
    checkAuth();
   
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)/");
    }
      SplashScreen.hideAsync(); 
  }, [segments, user, isReady,token]);

 if (!isReady) {
    return <AppSplashScreen />; // 👈 show splash until ready
  }
  return (
    <SafeAreaProvider>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  )
}
