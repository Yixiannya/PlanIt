import { useState, useEffect } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import appConfig from '../app.json';

import { Alert, Platform } from "react-native";
import { useUserStore } from '../Data/userStore';
import {editUser} from '../Data/editUser'
import {useNotificationStore} from  '../Data/notificationStore'

export const setUpNotifications = async () => {
   if (Device.isDevice) {

       const existingStatus = await Notifications.getPermissionsAsync();

       const finalStatus = existingStatus.status;
       console.log(existingStatus);
       if (existingStatus.status !== "granted") {
           const request = await Notifications.requestPermissionsAsync();
           finalStatus = request.status;
       }
       if (finalStatus !== "granted") {
           Alert.alert("Failed to activate notifications, try again")
       }

       const projectId =
         appConfig.expo.extra.eas.projectId;

       try {
         const pushTokenString = (
           await Notifications.getExpoPushTokenAsync({
             projectId,
           })
         ).data;
         return pushTokenString;
       } catch (error) {
         console.log(error);
       }

       if (Platform.OS === "android") {
           Notifications.setNotificationsChannelAsync("notifications", {
               name: "Notifications",
               importance: Notifications.AndroidImportance.MAX,
           })
       }
   } else {
       console.log("Error: Use a physical device")
   }
}

export const usePushNotifications = async (setUp) => {
    const userID = useUserStore.getState().user._id;
        if (setUp === true) {
             const token = await setUpNotifications();
             console.log(token);
             await editUser({notificationsEnabled: true, notificationToken: token}
                                  , userID);
             useNotificationStore.getState().setListener();
       } else {
           await editUser({notificationsEnabled: false}
                                , userID);
       }
};





