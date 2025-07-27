import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { useUserStore } from '../Data/userStore';
import {useGroupStore } from '../Data/groupStore';
import { navigationRef } from './navigation';
import {getEvent} from './getEvent'
import {getGroup} from './getGroup'

export const useNotificationStore = create((set) => ({
    listener: null,
    setListener: () => {
      if (!useNotificationStore.getState().listener) {
            set({
               listener: Notifications.addNotificationReceivedListener(async (notification) => {
                 console.log("RECEIVED");
                 if (useUserStore.getState().user) {
                     if (notification.request.content.data.screen == "Group" && notification.request.content.data.group.members.some(x => x === useUserStore.getState().user._id)) {
                         Toast.show({
                           type: 'success',
                           text1: notification.request.content.title,
                           text2: notification.request.content.body,
                           onPress: () => {
                               if (navigationRef.isReady()) {
                                     useGroupStore.getState().setGroup(notification.request.content.data.group);
                                     navigationRef.navigate('GroupTabs', { screen: 'Group Info',});
                               }
                               Toast.hide();
                             },
                         });
                      } else if (notification.request.content.data.screen == "Group Event") {
                      console.log(notification.request.content.data.event.group);
                      const thegroup = await getGroup(notification.request.content.data.event.group);
                     console.log(thegroup)
                      if (thegroup.members.some(x => x == useUserStore.getState().user._id)
                      || thegroup.admins.some(x => x == useUserStore.getState().user._id)) {
                        Toast.show({
                           type: 'success',
                           text1: notification.request.content.title,
                           text2: notification.request.content.body,
                           onPress: async () => {
                                 if (navigationRef.isReady()) {
                                 navigationRef.navigate('EditDeletePage', {
                                   event: {...notification.request.content.data.event,
                                            groupName: thegroup},
                                   location: "AUTO",
                                   allEvents: [],
                                 });
                                 }
                               Toast.hide();
                             },
                         })};
                     } else if (notification.request.content.data.screen == "Indiv Event" && useUserStore.getState().user._id === notification.request.content.data.userId) {
                       user = useUserStore.getState().user._id;
                       Toast.show({
                          type: 'success',
                          text1: notification.request.content.title,
                          text2: notification.request.content.body,
                          onPress: async () => {
                              const allEvents = await getEvent(user);
                              if (navigationRef.isReady()) {
                                    navigationRef.navigate('EditDeletePage', {
                                      event: notification.request.content.data.event,
                                      location: "AUTO",
                                      allEvents: allEvents,
                                    });
                              }
                              Toast.hide();
                            },
                        });
                    }
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