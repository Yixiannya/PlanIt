import { Linking, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorwithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { useUserStore } from '../Data/userStore';
import {editUser} from '../Data/editUser'
import {usePushNotifications} from  '../Data/usePushNotifications'
import {useNotificationStore} from  '../Data/notificationStore'
import {syncCalendar} from '../Data/syncCalendar'

export default function LoginPage() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser =  useUserStore((state) => state.setUser);
  const clearToken = useUserStore.getState().clearUser;

  const sync = async (id, data) => {
      try {
          await syncCalendar({userId: id})
          Alert.alert("Success!", "Your google calendar was synced")
          navigation.replace('BottomTabs', { screen: 'Main-page' });
          await toggleNotif(data);
      } catch (error) {
          Alert.alert("Error", "Something went wrong while syncing. Try again")
      }
  };

  const toggleNotifications = async (data) => {
      try {
        await usePushNotifications(true);
        setUser({
           ...data.user,
           notificationsEnabled: true,
         });
        Alert.alert('Notification enabled', "You can now receive notifications");
      } catch (e) {
        Alert.alert('Failed to activate notifications', "Please try again in settings");
        console.log(e)
        setTimeout(() => {
            setUser({
               ...data.user,
               notificationsEnabled: false,
             });
      }, 50);
      }
    };

    const toggleNotif = (data) => {
        if (!data.user.notificationsEnabled) {
        Alert.alert("Do you want to enable notifications?",
            "This will allow you to receive alerts on your phone",
            [{text: "No", onPress: () => Alert.alert("Notifications not enabled", "If you wish to enable notifications, toggle it in settings"),},
             { text: "Yes", onPress: () => {
                 toggleNotifications(data);
             },}]
        );
    } else {
        useNotificationStore.getState().setListener();
    }}
  const handleGoogleSignIn = async () => {
      try {
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          setIsSubmitting(true);
          if (!isSuccessResponse(response)) {
              setIsSubmitting(false);
          }
          if (isSuccessResponse(response)) {
              const photoUrl = response.data.user.photo;
              const { idToken } = response.data;
              const tokens = await GoogleSignin.getTokens();
              const { accessToken }= tokens;
              console.log("WHERE", tokens);
              const passable = { idToken, accessToken, serverAuth: response.data.serverAuthCode};
              console.log(passable);
              const responseBack = await fetch('https://planit-40q0.onrender.com/auth/google', {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(passable),
              })
              if (responseBack.ok) {
                const data = await responseBack.json();
                console.log(data);
                await editUser({ image: photoUrl }, data.user._id)
                setIsSubmitting(false);
                setUser(data.user);
                navigation.replace('BottomTabs', { screen: 'Main-page' });


                if (data.user.events.length === 0) {
                    Alert.alert("Would you like to sync your events from Google Calendar?",
                   "Note that due to server limitations, this will only sync the 100 most recent events from your Google Calendar. Continue?",
                   [{text: "Don't sync", onPress: () =>
                        Alert.alert("Are you sure?",
                    "Due to the nature of our app, some events may not be able to carry over if you have already created events here",
                                          [{text: "Don't sync", onPress: () => {toggleNotif(data)},},
                                           { text: "Sync", onPress: async () => {
                                               await sync(data.user._id, data);
                                           },}]),},
                    { text: "Sync", onPress: async () => {
                        sync(data.user._id, data);
                    },}])
                } else {
                    toggleNotif(data);
                }


              } else {
                const errorData = await responseBack.json();
                console.error('Error:', responseBack.status, errorData);
                Alert.alert('Login failed', errorData.message || 'Unauthorized');
              }
          } else {
              showMessage("Google SignIn cancelled")
              }
            setIsSubmitting(false);
          } catch (error) {
          if (isErrorwithCode(error)) {
              switch (error.code) {
                  case statusCodes.IN_PROGRESS:
                  showMessage("Google Sigin is in progress");
                  break;
                  case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                      showMessage("Play services not available");
                      break;
                  default:
                      showMessage(error.code);
                  }
              } else {
                  showMessage("An error occured");
              }
          setIsSubmitting(false);
      }
  };

  return (
      <View className="flex-1 items-center justify-center bg-orange-500 pb-15">
      <View className = "pr-1">
      <Image className="w-[300px] h-[300px] py-2" source={require('../assets/PlanIt.png')} />
      </View>
    {!isSubmitting ? (
        <View>
      <Text className="text-center text-[100px] text-white font-bold pr-2">Plan It</Text>
      <Text className="text-center text-[30px] text-white pr-1 pt-1 py-1">
        A smart scheduling app made just for students
      </Text>
      <View className="py-5 items-center justify-center">
        <TouchableOpacity onPress={handleGoogleSignIn} className="w-[250px]">
          <Text className="text-center px-4 py-4 text-2xl font-bold border border-black rounded-2xl border-2 bg-orange-400">
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>
      </View>
     ):(
         <View className="px-4 items-center justify-center py-4 text-2xl font-bold">
         <Text className = "pr-2 text-white py-5 text-6xl font-bold text-center"> Loading your info... </Text>
         <Text className = "text-white text-4xl text-center"> Please wait... </Text>
         </View>
        )}
    </View>
  );
}
