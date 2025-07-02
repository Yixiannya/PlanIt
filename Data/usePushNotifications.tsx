import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Alert, Platform } from "react-native";
import { useUserStore } from '../Data/userStore';

export const usePushNotifications = (setUp) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    });
    const myuser = useUserStore((state) => state.user);
    const [expoPushToken, setExpoPushToken] = useState();
    const [responseListener, setResponseListener] = useRef();

    const setUpNotifications = async () => {
        const token = null;

        if (Device.isDevice) {
            const existingStatus = await Notifications.getPermissionsAsync();

            const finalStatus = existingStatus.status;

            if (existingStatus.status !== "granted") {
                const request = await Notifications.requestPermissionsAsync();
                finalStatus = request.status;
            }
            if (finalStatus !== "granted") {
                Alert.alert("Failed to activate notifications, try again")
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: "6ac8d5db-e62d-4daf-98e1-85516c76e31a",
            })

            if (Platform.OS === "android") {
                Notifications.setNotificationsChannelAsync("notifications", {
                    name: "Notifications",
                    importance: Notifications.AndroidImportance.MAX,
                })
            }

            return token;

        } else {
            console.log("Error: Use a physical device")
        }
    }
        useEffect(() => {
            if (!setUp) {
                setUpNotifications().then((token) => {
                setExpoPushToken(token);})
            } else {
                 responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                    console.log("User interacted with notification:", response);
                  });
            }
        return () => {
            if (responseListener.current) {
              responseListener.current.remove()
            }
          };
        }, []);

        return !setUp
          ? { expoPushToken }
          : {};
};





