import { useRef, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import {getUser} from '../Data/getUser';
import {sendUser} from '../Data/sendUser';
import { useGroupStore } from '../Data/groupStore';
import { useUserStore } from '../Data/userStore';

export const handleAdding = async (navigation, Group, user, array) => {
    const id_array = {
       id: Group._id,
       userId: user._id,
       addedMembers: array.map((users) => users._id),
       }
   try {
       await sendUser("members", Group._id, id_array, "add");
       Alert.alert('Added successfully');
       navigation.pop();
       navigation.pop();
       } catch (error) {
           Alert.alert('Failed to add users', 'Something went wrong' );
           console.error('Error:', error);
       }
}

export default function AddUsers() {
    const navigation = useNavigation();
    const access = useRef(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchDisplay, setSearchDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchUsers, setSearchUsers] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const Group = useGroupStore((state) => state.group);
    const user = useUserStore((state) => state.user);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        async function loadUsers() {
            setLoading(true);
            const users = await getUser("");
            const filtered = users.filter(user => !Group.members.includes(user._id) && !Group.admins.includes(user._id))
            setAllUsers(filtered);
            setLoading(false);
        }
        loadUsers();
      }, []);


    const Item = ({ item }) => (
          <TouchableOpacity
          onPress = { () =>
              {
           select(item);
           }}
            className="flex-1 items-center justify-center m-1 p-5 bg-orange-400 rounded-2xl"
         >
            <View className = "pt-2 pb-3 items-center">
            <Image source = {{uri: item.image}} className = "rounded-3xl w-20 h-20"/>
            </View>
            <Text className="text-center text-xl font-bold">{item.name}</Text>
          </TouchableOpacity>
      );

    const search = () => {
        if (allUsers.filter(user =>
            user.name.toLowerCase().startsWith(searchUsers.toLowerCase())).length === 0) {
             Alert.alert('Error', 'No such user')
             setStarted(false);
        } else {
            setSearchDisplay(
                    searchUsers === ""
                      ? allUsers
                      : allUsers.filter(user =>
                          user.name.toLowerCase().startsWith(searchUsers.toLowerCase()))
            );
        setStarted(true);
        }
    };

     const select = async (user) => {
         setLoading(true);
         setSelectedUsers (
            selectedUsers.concat(user)
         );
        setSearchDisplay (
            searchDisplay.filter(users => users !== user)
        );
        setAllUsers (
            allUsers.filter(users => users !== user)
        );
        await new Promise(resolve => setTimeout(resolve, 400));
        setLoading(false);
     };

    return (
    <View className="flex-1 bg-orange-300">
          <Header word="Add Members"
                image={require('../assets/Close.png')}
                onPress={() => navigation.pop()}
          />
           <View className = "bg-orange-200 items-center flex-row">
                <View className = "w-5/6 flex-row">
                  <Text className = "pt-4 text-3xl text-gray-800 font-bold"> Name: </Text>
                  <TouchableOpacity onPress={() => access.focus()} className = "flex-1">
                    <TextInput
                        ref = {access}
                        placeholder = "Search a name"
                        value = {searchUsers}
                        onChangeText={text => setSearchUsers(text)}
                        className = "pt-4 text-[28px]"
                  />
                </TouchableOpacity>
                </View>
                 <TouchableOpacity onPress = {() => search()}>
                 <Image source = {require('../assets/search.png')} />
                 </TouchableOpacity>
           </View>
                 { loading ? (
                     <View className = "flex-1 items-center justify-center">
                     <Text className = "text-3xl font-bold">Loading users...</Text>
                     </View>
                 ) : !started ? (
                     <View className = "px-3 mr-3 flex-1 items-center justify-center">
                      <Text className = "text-center text-2xl font-bold"> Try typing a username and pressing the search button! </Text>
                      <Text className = "py-2 text-center text-xl ml-2 px-5">(Alternatively, click the search button with no name to see all users!)</Text>
                      </View>
                     ) : (
                     <View className="flex-1 pt-3 px-4">
                        <FlatList
                        data={searchDisplay}
                        numColumns={3}
                        renderItem={Item}
                        keyExtractor={(item) => item._id}
                        />
                </View>
                 )}
             <View className = "justify-center bg-orange-500 flex-row">
                <Text className = "px-2 py-2 text-2xl font-bold"> Added Users </Text>
             </View>
             <View className="items-center bg-orange-400 flex-row h-20">
                <ScrollView horizontal className=" bg-orange-400">
                    {selectedUsers.map((event) => (
                     <TouchableOpacity
                      onPress = { async () => {
                          setLoading(true);
                       setSelectedUsers(selectedUsers.filter(user => user !== event));
                      if (event.name.toLowerCase().startsWith(searchUsers.toLowerCase())) {
                            setSearchDisplay([...searchDisplay, event]);
                      };
                       setAllUsers([...allUsers, event]);
                       await new Promise(resolve => setTimeout(resolve, 400));
                       setLoading(false);
                       }}>
                    <View key={event._id} className="rounded-xl flex-col px-3 py-3">
                        <Text className="rounded-xl px-3 py-3 bg-orange-300 font-bold text-2xl">{event.name}</Text>
                    </View>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
           </View>

           <TouchableOpacity onPress = { () =>
               handleAdding(navigation, Group, user, selectedUsers)
           }>
           <View className="py-8 bg-orange-500 items-center">
               <Text className="pb-14 text-2xl font-bold text-white">Add users</Text>
           </View>
           </TouchableOpacity>
    </View>
    )
}