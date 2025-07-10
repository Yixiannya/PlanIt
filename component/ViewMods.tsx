import { useUserStore } from '../Data/userStore';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {getUserMod} from "../Data/getUserMod"

export default function ViewMods() {
const [loading, setLoading] = useState(true);
const [yourMods, setYourMods] = useState([]);
const navigation = useNavigation();
const isFocused = useIsFocused();
const user = useUserStore((state) => state.user);

  useEffect(() => {
      async function fetchEvents() {
          setLoading(true);
          const mods = await getUserMod(user._id);
          setYourMods(mods)
          setLoading(false);
      }
        if (isFocused) {
          fetchEvents();
      }
  }, [isFocused]);

    return (
        <View className = "flex-1 bg-orange-300">
         <Header word = "Your current mods" image= {require('../assets/ADD.png')}
            onPress = {() =>
            navigation.navigate("SelectModAY")}/>
          { loading ? (
            <View className = "flex-1 items-center justify-center">
            <Text className = "text-2xl font-bold"> Loading mods </Text>
            </View>
        ):(
            <View className = "flex-1" >
            <ScrollView className = "pb-50">
            {yourMods.map(event => (
                <TouchableOpacity onPress={() => {
                    if (event.isComplete) {
                        navigation.navigate("ModClasses", { event });
                    } else {
                        navigation.navigate("ConfigureMods", { event, myevents: [] });
                    }
                }}>
                <View className = "border-2 border-orange-600 m-1 bg-orange-400 rounded-3xl flex-1 flex-row py-4 px-2">
                <View className = "flex-col">
                        <Text className = "text-2xl font-bold"> {event.moduleCode} </Text>
                        <Text className = "text-xl"> {event.description} </Text>
                        <Text className = "text-2xl font-bold "> Configured? </Text>
                        {event.isComplete ? (
                        <Text className = "font-bold text-green-700 text-2xl"> Yes, press to view </Text>
                        ) : (
                        <Text className = "font-bold text-red-500 text-2xl"> No, press to configure </Text>
                            )}
                        </View>
                </View>
                </TouchableOpacity>
                ))}
     </ScrollView>
     </View>
     )}
  </View>
  );
  }


