import { Linking, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorwithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { useUserStore } from '../Data/userStore';

export default function LoginPage() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser =  useUserStore((state) => state.setUser);
  const clearToken = useUserStore.getState().clearUser

  const handleGoogleSignIn = async () => {
      clearToken();
      await GoogleSignin.signOut();
      try {
          setIsSubmitting(true);
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          if (isSuccessResponse(response)) {
              const { idToken } = response.data;
              const passable = { idToken };
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
                console.log("Data" + data);
                setUser(data.user);
                navigation.navigate('BottomTabs', { screen: 'Main-page' });
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
    <View className="flex-col flex-1 items-center justify-center bg-orange-500">
      <Image className="w-[300px] h-[300px]" source={require('../assets/PlanIt.png')} />
      <Text className="text-center text-[100px] text-white font-bold pr-10">Plan It</Text>
      <Text className="text-center text-[30px] text-white pr-5 pt-1 py-1">
        A smart scheduling app made just for students
      </Text>
      <View className="py-5">
        <TouchableOpacity onPress={handleGoogleSignIn}>
          <Text className="pl-1 px-3 py-3 text-3xl font-bold border border-black rounded border-2 bg-orange-400">
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
