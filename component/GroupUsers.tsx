import { Alert, Image, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useGroupStore } from '../Data/groupStore';
import { useUserStore } from '../Data/userStore';
import { sendUser } from '../Data/sendUser';

export const handleDelete = async (navigation, user, gp, id) => {
      const id_array = {
          id: gp,
          userId: user._id,
          deletedMembers:  [id._id],
        }
      try {
          await sendUser("members", gp, id_array, "delete");
          Alert.alert('Deleted successfully');
          navigation.pop();
      } catch (error) {
          Alert.alert('Error', 'Failed to delete event');
          console.error('Error:', error);
      }
  }

  export const handleAdminAdding = async (navigation, user, gp, id) => {
        const id_array_add = {
            id: gp,
            userId: user._id,
            promotedMembers:  [id._id],
        }
        try {
           await sendUser("members", gp, id_array_add, "promote");
           Alert.alert('Promoted successfully');
           navigation.pop();
        } catch (error) {
            Alert.alert('Error', 'Failed to remove admin');
        }
    }

 export const handleAdminDeleting = async (navigation, user, gp, id) => {
        const id_array = {
            id: gp,
            userId: user._id,
            demotedAdmins: [id._id],
        }
        try {
            await sendUser("admins", gp, id_array, "demote")
            Alert.alert('Demoted successfully');
            navigation.pop();
        } catch (error) {
            Alert.alert('Error', 'Failed to remove admin');
        }
  }


export default function GroupUser({route}) {
  const navigation = useNavigation();
  const {admins, members} = route.params;
  const [deleting, setDeleting] = useState(false);
  const [adminDeleting, setAdminDeleting] = useState(false);
  const [adminAdding, setAdminAdding] = useState(false);
  const Group = useGroupStore((state) => state.group);
  const user = useUserStore((state) => state.user);
  const isAdmin = admins.some((admin => admin._id == user._id));

  console.log(admins.length);

  const Item = ({ item }) => (
    <View className="flex-1 flex-col items-center justify-center m-2 p-5 pb-3 bg-orange-400 rounded-2xl">
        <Image source = {{uri: item.image}} className = "rounded-3xl w-20 h-20"/>
        <Text className="text-center pt-3 text-xl font-bold">{item.name}</Text>
        {deleting && (
            <TouchableOpacity onPress = {() => handleDelete(navigation, user, Group._id, item)}>
                <Image source={require('../assets/delete.png')} className="w-12 h-12" />
            </TouchableOpacity>
        )}
        {adminAdding && (
            <TouchableOpacity onPress = {() => handleAdminAdding(navigation, user, Group._id, item)}>
                <Image source={require('../assets/ADD.png')} className="w-12 h-12" />
            </TouchableOpacity>
        )}
    </View>
  );

  const ItemAdmin = ({ item }) => (
      <View className="flex-1 flex-col items-center justify-center m-2 p-5 pb-3 bg-orange-400 rounded-2xl">
              <Image source = {{uri: item.image}} className = "rounded-3xl w-20 h-20"/>
              <Text className="text-center pt-3 text-2xl font-bold">{item.name}</Text>
          {adminDeleting && (
              <TouchableOpacity onPress = {() => handleAdminDeleting(navigation, user, Group._id, item)}>
                  <Image source={require('../assets/delete.png')} className="w-12 h-12" />
              </TouchableOpacity>
          )}
      </View>
    );

  return (
      <View className="flex-1 bg-orange-300">
      <Header word="Group Members"
                  image={require('../assets/Close.png')}
                  onPress={() => navigation.pop()}
            />
    <ScrollView>
      <View className="flex-row rounded-3xl border-8 border-orange-300 bg-orange-500 py-5 px-4 items-center">
         <View className = "w-4/5 flex-1 items-center">
            <Text className="ml-12 text-4xl font-bold">Admins</Text>
         </View>
         {adminDeleting || adminAdding ? (
              <TouchableOpacity onPress= { () => {
                  setAdminDeleting(false);
                  setAdminAdding(false);
              }
              }
              >
                <Image source={require('../assets/Close.png')} className="w-12 h-12" />
              </TouchableOpacity>
         ): (
             <TouchableOpacity onPress={() => {
                 if (!isAdmin) {
                    Alert.alert("Error", "You are not an admin")
                 } else {
             Alert.alert(
               "Admins",
               "What would you like to do?",
               [
                 { text: "Remove admins", onPress:
                    () => {if (isAdmin) {
                         if (admins.length !== 1) {
                           setAdminDeleting(true);
                         } else {
                           Alert.alert("Error", "There must be at least one admin");
                         }
                       } else {
                         Alert.alert("Error", "You are not an admin", [{ text: "Ok" }]);
                   }}},
                 { text: "Add admins", onPress:
                     () => { isAdmin
                      ? setAdminAdding(true)
                      : Alert.alert("Error", "You are not an admin", [{ text: "Ok" }])}},
               ],
                {
                    cancelable: true,
                }
             )}}
           }
         >
         <Image source={require('../assets/edit.png')} className="w-12 h-12" />
         </TouchableOpacity>
         )}
      </View>
      <View className="pt-2 pb-4 px-4">
        <FlatList
            data={admins}
            numColumns={2}
            renderItem={ItemAdmin}
            keyExtractor={(item) => item._id}
        />
      </View>

      <View className="flex-row rounded-3xl border-8 border-orange-300 bg-orange-500 py-5 px-4 items-center">
         <View className = "w-4/5 flex-1 items-center">
            <Text className="ml-12 text-4xl font-bold">Members</Text>
         </View>
         {deleting ? (
            <TouchableOpacity onPress= { () => setDeleting(false)}>
                <Image source={require('../assets/Close.png')} className="w-12 h-12" />
            </TouchableOpacity>
        ) : (
        <TouchableOpacity onPress={ () => {
              if (!isAdmin) {
                Alert.alert("Error", "You are not an admin")
             } else {
            Alert.alert(
                "Users",
                "What would you like to do?",
                [
                { text: "Remove members",
                    onPress: () => { isAdmin
                        ? setDeleting(true)
                        : Alert.alert("Error", "You are not an admin", [{ text: "Ok" }])}},
                { text: "Add members",
                    onPress: () => { isAdmin
                        ? navigation.navigate('AddUsers')
                        : Alert.alert("Error", "You are not an admin", [{ text: "Ok" }])}},
                ],
            {
                cancelable: true,
            }
            )}}
        }>
        <Image source={require('../assets/edit.png')} className="w-12 h-12" />
        </TouchableOpacity>
        )}
      </View>
          <View className="pt-2 px-4 pb-20">
             <FlatList
                data={members}
                numColumns={2}
                renderItem={Item}
                keyExtractor={(item) => item._id}
             />
          </View>
      </ScrollView>
      </View>
    );
    }
