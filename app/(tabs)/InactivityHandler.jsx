import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { BackHandler } from "react-native";

export const useInactivityHandler = () => {
  const router = useRouter();
  const timeoutRef = useRef(null);

  const startInactivityTimer = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      console.log("User inactive for 3 minutes, logging out...");
      await AsyncStorage.removeItem("token");
      router.push("/Login");
    }, 180000); // 3 minutes
  };

  const resetInactivityTimer = () => {
    clearTimeout(timeoutRef.current);
    startInactivityTimer();
  };

  useEffect(() => {
    startInactivityTimer();

    const touchListener = () => resetInactivityTimer();
    document.addEventListener("touchstart", touchListener);
    document.addEventListener("mousemove", touchListener);

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      resetInactivityTimer();
      return false;
    });

    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener("touchstart", touchListener);
      document.removeEventListener("mousemove", touchListener);
      backHandler.remove();
    };
  }, []);

  return { resetInactivityTimer };
};
