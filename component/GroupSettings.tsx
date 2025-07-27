import { Alert, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {usePushNotifications} from  '../Data/usePushNotifications'
import { useNavigation } from '@react-navigation/native';
import {useEffect, useState} from 'react'
import { useUserStore } from '../Data/userStore';
import {useGroupStore} from '../Data/groupStore'
import {editGroup} from '../Data/editGroup';
import {deleteGroup} from '../Data/deleteGroup'
import {sendUser} from '../Data/sendUser'


export default function GroupSettings() {
    const navigation = useNavigation();
    const [name, setName] = useState(useGroupStore.getState().group.name);
    const [description, setDescription] = useState(useGroupStore.getState().group.description);
    const [toggleChange, setToggleChange] = useState(false);
    const [toggleChange2, setToggleChange2] = useState(false);
    const isAdmin = useGroupStore.getState().group.admins.some((admin => admin == useUserStore.getState().user._id));
    const Group = useGroupStore((state) => state.group);

    const changeGroupName = async () => {
        if (isAdmin) {
        try {
            await editGroup({name: name, userId: useUserStore.getState().user._id}, useGroupStore.getState().group._id);
            Alert.alert("Success!", "Your group name was changed!")
        } catch (error) {
            Alert.alert("Error", "Something went wrong while changing your group name")
        }
        } else {
            Alert.alert("You are not an admin", "Get an admin to change the group name")
        }
    };

    const changeGroupDesc = async () => {
        if (isAdmin) {
        try {
            console.log({description: description, userId: useUserStore.getState().user._id}, useGroupStore.getState().group._id);
            await editGroup({description: description, userId: useUserStore.getState().user._id}, useGroupStore.getState().group._id);
            Alert.alert("Success!", "Your group description was changed")
        } catch (error) {
            Alert.alert("Error", "Something went wrong while changing your group description")
        }
        } else {
            Alert.alert("You are not an admin", "Get an admin to change the group description")
        };
    };

    const handleGroupDelete= async (gp, myuser, navigation) => {
      const delete_array = {
          Groupid: gp,
          userId: myuser,
      }
  console.log(delete_array);
      try {
          Alert.alert("Deleting group...")
         await deleteGroup(gp, delete_array);
         Alert.alert('Your group has been deleted!');
         navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTabs', params: { screen: 'Main-page' } }],
         });
      } catch (error) {
          Alert.alert('Error', 'Failed to delete group');
      }
    }

    const handleLeave = async (gp, own, navigation) => {
        const id_array = {
            id: gp._id,
             userId: gp.admins[0],
            deletedMembers: [own],
        }
        const id_array_2 = {
            id: gp._id,
            userId: gp.admins[0],
            deletedAdmins: [own],
        }

        try {
            Alert.alert("Leaving group...")
          if (!gp.admins.some((admin => admin == own))) {
            await sendUser("members", gp._id, id_array, "delete");
          } else {
            await sendUser("admins", gp._id, id_array_2, "delete");
          }
          Alert.alert('Left group successfully');
          navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTabs', params: { screen: 'Main-page' } }],
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to leave group');
          console.error('Error:', error);
        }
      };

    return (
        <View className = "flex-1 bg-orange-300">
            <Header word="Group Settings"
                 image={null}
            onPress={null}
            />
            <View className = "mx-2 my-2 bg-orange-400 py-6 rounded-2xl items-start">
            <View className = "flex-row">
            <Text className = "pt-4 w-3/4 pl-2 font-bold text-[28px] "> Change group name </Text>
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
                 placeholder = "Enter name (max 20.)"
                 value = {name}
                 onChangeText={text => setName(text)}
                 maxLength={20}
                 className = "w-80 ml-3 px-4 bg-white rounded-2xl text-[30px]"
            />
            <TouchableOpacity onPress = {() => changeGroupName()}>
            <Text className = "font-bold text-xl ml-3 text-center py-5 px-2 rounded-2xl bg-orange-500"> Enter </Text>
            </TouchableOpacity>
            </View>}
            </View>

            <View className = "mx-2 my-2 bg-orange-400 py-6 rounded-2xl items-start">
            <View className = "flex-row">
            <Text className = "pt-4 w-3/4 pl-2 font-bold text-[28px] "> Change description </Text>
            <TouchableOpacity onPress = {() => {
                setToggleChange2(!toggleChange2);
            }}>
            {toggleChange2 ? (
                <Image source = {require('../assets/arrowup.png')}
                             className="w-20 h-20 ml-3"/>
                ) : (
                <Image source = {require('../assets/arrowdown.png')}
                                             className="w-20 h-20 ml-3"/>
            )}
            </TouchableOpacity>
            </View>
             {toggleChange2 &&
            <View className = "flex-row py-1">
            <TextInput
                 placeholder = "Enter description"
                 value = {description}
                 onChangeText={text => setDescription(text)}
                 maxLength={ 300 }
                 className = "w-80 ml-3 px-4 bg-white rounded-2xl text-[30px]"
            />
            <TouchableOpacity onPress = {() => changeGroupDesc()}>
            <Text className = "font-bold text-xl ml-3 text-center py-5 px-2 rounded-2xl bg-orange-500"> Enter </Text>
            </TouchableOpacity>
            </View>}
            </View>

            <View className = "px-2 flex-1 justify-end flex-col items-center">
               <TouchableOpacity onPress={() => {
                   if (isAdmin && useGroupStore.getState().group.admins.length === 1) {
                       Alert.alert('Promote someone to admin before leaving');
                   } else {
                       Alert.alert(
                           "Leave group",
                           "Are you sure you want to leave?",
                           [
                               { text: "No" },
                               { text: "Yes", onPress: () =>
                                   handleLeave(useGroupStore.getState().group, useUserStore.getState().user._id,
                                   navigation) }
                           ]
                       );
                   }
               }}  className = "mb-2 bg-orange-500 rounded-xl w-full">
                    <Text className = "text-center text-white py-3 px-2 rounded font-bold text-2xl" > Leave Group </Text>
                </TouchableOpacity>
            {isAdmin &&
              <View className = "pb-2 w-full">
                <TouchableOpacity onPress = {() =>
                    Alert.alert(
                        "Delete Group",
                        "Are you sure you want to delete this group?",
                        [{ text: "No"},
                        { text: "Yes", onPress:
                        () => { handleGroupDelete(useGroupStore.getState().group._id, useUserStore.getState().user._id, navigation) } }
                        ]
                    )}
                className = "bg-orange-500 rounded-xl w-full">
                    <Text className = "text-center text-red-800 py-3 px-2 rounded font-bold text-2xl" > Delete Group </Text>
                </TouchableOpacity>
              </View>
              }
          </View>
          </View>
    )
}