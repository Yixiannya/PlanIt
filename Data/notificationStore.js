import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { useUserStore } from '../Data/userStore';

export const useNotificationStore = create((set) => ({
    listener: null,
    setListener: () => {
      if (!useNotificationStore.getState().listener) {
            set({
               listener: Notifications.addNotificationReceivedListener((notification) => {
                 console.log("RECEIVED");
                 if (useUserStore.getState().user) {
                     Toast.show({
                       type: 'info',
                       text1: notification.request.content.title,
                       text2: notification.request.content.body,
                     });
                 }
               })
             })
        }},
    clearListener: () => {
      const { listener } = useNotificationStore.getState();
      listener.remove();
      set({ listener: null });
    }
}));