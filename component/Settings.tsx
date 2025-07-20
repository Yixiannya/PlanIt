import { Alert, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {usePushNotifications} from  '../Data/usePushNotifications'
import { useNavigation } from '@react-navigation/native';
import {useEffect, useState} from 'react'
import { useUserStore } from '../Data/userStore';
import {editUser} from '../Data/editUser';
import {syncCalendar} from '../Data/syncCalendar';

export default function Settings() {
    const navigation = useNavigation();
    const user = useUserStore((state) => state.user);
    const [setUp, setSetUp] = useState();
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [toggleChange, setToggleChange] = useState(false)
    const [toggleSync, setToggleSync] = useState(false)

    useEffect(() => {
        setSetUp(user.notificationsEnabled);
        setName(user.name);
        setId(user._id)
    }, []);

    const toggleNotifications = async () => {
        try {
          const newSetUp = !setUp;
          setSetUp(newSetUp);
          await usePushNotifications(newSetUp);
          Alert.alert('Notification setting updated');
        } catch (e) {
          Alert.alert('Failed to update notification setting');
          console.log(e)
        }
      };

    const changeUsername = async () => {
        try {
            await editUser({name: name}, id);
            Alert.alert("Success!", "Your name was changed")
        } catch (error) {
            Alert.alert("Error", "Something went wrong while changing your name")
        }
    };

    const sync = async () => {
        try {
            await syncCalendar({userId: id})
            Alert.alert("Success!", "Your google calendar was synced")
        } catch (error) {
            Alert.alert("Error", "Something went wrong while syncing. Try again")
        }
    };

    return (
        <View className = "flex-1 bg-orange-300">
            <Header word="Settings"
                 image={null}
            onPress={null}
            />
            <View className = "flex-row mx-2 my-2 bg-orange-400 py-6 rounded-2xl items-start">
            <Text className = "pt-4 w-3/4 pl-2 font-bold text-[28px] "> Allow notifications </Text>
            <TouchableOpacity onPress = {() => {
                toggleNotifications();
                }}>
            {setUp ? (
                <Image source = {require('../assets/toggle_on.png')}
                             className="w-20 h-20 ml-3"/>
                ) : (
                <Image source = {require('../assets/toggle_off.png')}
                                             className="w-20 h-20 ml-3"/>
            )
                }
            </TouchableOpacity>
            </View>
            <View className = "flex-row mx-2 my-2 bg-orange-400 py-8 rounded-2xl items-start">
            <Text className = "pl-4 w-3/4 font-bold text-[28px] ">Sync events to Google Calendar </Text>
            <TouchableOpacity onPress = {() =>  Alert.alert("Note:",
               "Due to limitations, this will only sync the 100 most recent events from your Google Calendar, including events from this app. Continue?",
               [{text: "No", onPress: () => Alert.alert("Request cancelled"),},
                { text: "Yes", onPress: () => {
                    sync();
                },}])}>
            <Text className = "ml-3 text-2xl py-6 text-center font-bold rounded-3xl bg-orange-600
            w-20 h-20 "> Sync </Text>
            </TouchableOpacity>
            </View>
            <View className = "mx-2 my-2 bg-orange-400 py-6 rounded-2xl items-start">
            <View className = "flex-row">
            <Text className = "pt-4 w-3/4 pl-2 font-bold text-[28px] "> Change username </Text>
            <TouchableOpacity onPress = {() => {
                setToggleChange(!toggleChange);
            }}>
            {toggleChange ? (
                <Image source = {require('../assets/arrowup.png')}
                             className="w-20 h-20 ml-3"/>
                ) : (
                <Image source = {require('../assets/arrowdown.png')}
                                             className="w-20 h-20 ml-3"/>
            )}
            </TouchableOpacity>
            </View>
            {toggleChange &&
            <View className = "flex-row py-1">
            <TextInput
                 placeholder = "Enter name"
                 value = {name}
                 onChangeText={text => setName(text)}
                 className = "w-80 ml-3 px-4 bg-white rounded-2xl text-[30px]"
            />
            <TouchableOpacity onPress = {() => changeUsername()}>
            <Text className = "font-bold text-xl ml-3 text-center py-5 px-2 rounded-2xl bg-orange-500"> Enter </Text>
            </TouchableOpacity>
            </View>}
            </View>
    </View>
    )
}