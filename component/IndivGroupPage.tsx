import { ScrollView, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getUser } from '../Data/getUser';
import Header from '../REUSABLES/HeaderBanner';
import { useEffect, useState } from 'react';
import { useGroupStore } from '../Data/groupStore';
import { getGroupEvents } from '../Data/getGroupEvents';
import { useUserStore } from '../Data/userStore';
import { sendUser } from '../Data/sendUser';
import { deleteGroup } from '../Data/deleteGroup';

export const handleGroupDelete= async (gp, myuser, navigation) => {
  const delete_array = {
      Groupid: gp._id,
      userId: myuser._id,
  }
  try {
      Alert.alert("Deleting group...")
     await deleteGroup(gp._id, delete_array);
     Alert.alert('Your group has been deleted!');
     navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs', params: { screen: 'Main-page' } }],
     });
  } catch (error) {
      Alert.alert('Error', 'Failed to delete group');
  }
}

export const handleLeave = async (gp, own, Admins, navigation) => {
    const id_array = {
        id: gp._id,
        userId: Admins[0]._id,
        deletedMembers: [own._id],
    }
    const id_array_2 = {
        id: gp._id,
        userId: Admins[0]._id,
        deletedAdmins:  [own._id],
    }

    try {
        Alert.alert("Leaving group...")
      if (!Admins.some((admin => admin._id == own._id))) {
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

export default function IndivGroupPage() {
  const navigation = useNavigation();
  const [GroupMembers, setGroupMembers] = useState([]);
  const [Admins, setAdmins] = useState([]);
  const [actualEvents, setActualEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const setGroup = useGroupStore((state) => state.setGroup);
  const Group = useGroupStore((state) => state.group);
  const clearGroup = useGroupStore.getState().clearGroup;
  const myuser = useUserStore((state) => state.user);
  const isAdmin = Admins.some((admin => admin._id == myuser._id));
  const isFocused = useIsFocused();


  useEffect(() => {
    async function fetchUser(id_array) {
        const user = await Promise.all(id_array.map((id) => getUser(id)));
        return user;
    }
    async function loadUsers() {
        setLoading(true);
        const replace = await getGroupEvents(Group._id, "");
        setGroup(replace);
        const users = await fetchUser(replace.members);
        const admins = await fetchUser(replace.admins);
        console.log(admins[0].image)
        setGroupMembers(users);
        setAdmins(admins);
        setLoading(false);
    }
    if (isFocused) {
        loadUsers();
    }
  }, [isFocused]);

  useEffect(() => {
        async function fetchEvents() {
            setLoadingEvents(true);
            const events = await getEvent(Group._id);
            setActualEvents(Array.isArray(events) ? events : []);
            console.log(events);
            setLoadingEvents(false);
        }
        fetchEvents();
  }, []);

  return (
      <View className="flex-1 bg-orange-300">
        <Header word= "Group Info"
                    image={require('../assets/Close.png')}
                    onPress={() => {
                      navigation.pop(3);
                    }}
        />
        <ScrollView>

        <View className = "bg-orange-300 justify-center items-center">
        {!loading &&
            <View className = "py-3 flex-row">
            <Image source = {{uri: Admins[0].image}} className = "rounded-2xl w-36 h-36"/>
            </View>}
            <View className = "pr-2 pb-1 ml-14 flex-row">
            <View className = "justify-center">
            <Text className="font-bold text-4xl px-1">
                {Group.name}
            </Text>
            </View>
                <View className = "pr-2 pl-2 py-1">
                <TouchableOpacity onPress = {() => navigation.navigate("Group Settings")}>
                <Image source={require('../assets/edit.png')}  className = "w-10 h-10"/>
                </TouchableOpacity>
                </View>
            </View>
            <Text className="font-bold text-2xl pb-3 py-1 px-3">
                {Admins.length} Admins, {GroupMembers.length} Members
            </Text>
        </View>

        <View className="mt-2 mb-2 rounded-xl border-orange-300 border-2 overflow-hidden">
            <View className="bg-orange-500 py-4 px-4 justify-center items-center">
                <Text className="text-3xl font-bold">Description</Text>
            </View>

            <View className="bg-orange-300 justify-center items-center">
                <Text className="text-2xl px-3 py-3">{Group.description}</Text>
            </View>
        </View>


      <View className="bg-orange-300 rounded-xl border-4 border-orange-300 overflow-hidden">
        <View className="bg-orange-500 py-6 px-4 justify-center items-center">
            <Text className="text-3xl font-bold">Group Members</Text>
        </View>
      {loading ? (
          <View className="flex-1 justify-center items-center">
              <Text className="text-2xl">Loading events...</Text>
          </View>
      ) : (
          <View className = "py-5">
             <ScrollView horizontal>
                {Admins.map((member) => (
                    <View key={member._id} className="flex-col px-4 py-2">
                        <View className="py-2 justify-center items-center flex-col">
                        <Image source = {{uri: member.image}} className = "rounded-3xl w-20 h-20"/>
                        </View>
                        <Text className="pt-2 justify-center text-center font-bold text-2xl">
                            {member.name}
                        </Text>
                        <Text className = "text-orange-800 text-xl justify-center text-center font-bold">
                            (Admin)
                        </Text>
                    </View>
                )).concat(
                GroupMembers.map((member) => (
                    <View key={member._id} className="flex-col px-4 py-2">
                         <View className="py-2 justify-center items-center">
                          <Image source = {{uri: member.image}} className = "rounded-3xl w-20 h-20"/>
                         </View>
                         <Text className="py-2 justify-center text-center font-bold text-2xl">
                         {member.name}
                         </Text>
                    </View>
                )))}
             </ScrollView>
          <View className = "flex-col items-end pr-5">
            <TouchableOpacity onPress = {() => navigation.navigate('GroupUsers', { admins: Admins, members: GroupMembers })}>
                <Text className = "py-3 px-2 bg-orange-500 rounded font-bold text-xl" >View all</Text>
            </TouchableOpacity>
          </View>
          <View className = "flex-1 justify-end bg-orange-500 rounded-xl flex-col items-center mt-20">
               <TouchableOpacity onPress={() => {
                   if (isAdmin && Admins.length === 1) {
                       Alert.alert('Promote someone to admin before leaving');
                   } else {
                       Alert.alert(
                           "Leave group",
                           "Are you sure you want to leave?",
                           [
                               { text: "No" },
                               { text: "Yes", onPress: () => handleLeave(Group, myuser, Admins, navigation) }
                           ]
                       );
                   }
               }}>
                    <Text className = "text-white py-3 px-2 rounded font-bold text-2xl" > Leave Group </Text>
                </TouchableOpacity>
          </View>
          {isAdmin &&
          <View className = "flex-1 justify-end bg-orange-500 rounded-xl flex-col items-center mt-2">
            <TouchableOpacity onPress = {() =>
                Alert.alert(
                    "Delete Group",
                    "Are you sure you want to delete this group?",
                    [{ text: "No"},
                    { text: "Yes", onPress:
                    () => { handleGroupDelete(Group, myuser, navigation) } }
                    ]
                )}>
                <Text className = "text-red-800 py-3 px-2 rounded font-bold text-2xl" > Delete Group </Text>
            </TouchableOpacity>
          </View>
          }
          </View>
      )}
      </View>
      </ScrollView>
  </View>
  )
}