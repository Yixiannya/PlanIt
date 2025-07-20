import { useRef, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import {getUser} from '../Data/getUser';
import {sendUser} from '../Data/sendUser';
import {sendGroup} from '../Data/sendGroup';
import { useGroupStore } from '../Data/groupStore';
import { useUserStore } from '../Data/userStore';

export const handleAdding = async (groupName, myuser, selectedUsers, groupDesc, navigation) => {
    const id_array = {
        name: groupName,
        admins: [myuser._id],
        members: selectedUsers.map(user => user._id),
        description: groupDesc,
        }
    try {
        const newGroup = await sendGroup(id_array);
        Alert.alert('Group', 'Group added successfully',
            [{ text: 'OK',
              onPress: () => {
                  navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabs', params: { screen: 'Main-page' } }],
            });
            }}] );
        } catch (error) {
            Alert.alert('Failed to add users', 'Something went wrong' );
            console.error('Error:', error);
        }
    }
export default function NewGroup() {
    const navigation = useNavigation();
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const access = useRef(null);
    const [allUsers, setAllUsers] = useState([]);
    const [searchDisplay, setSearchDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchUsers, setSearchUsers] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const myuser = useUserStore((state) => state.user);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        async function loadUsers() {
            setLoading(true);
            const users = await getUser("");
            const filtered = users.filter(user => !(user._id == myuser._id))
            setAllUsers(filtered);
            setSearchDisplay(filtered);
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
             Alert.alert('Error', 'No such user');
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

     const select = (user) => {
         setSelectedUsers (
            selectedUsers.concat(user)
         );
        setSearchDisplay (
            searchDisplay.filter(users => users !== user)
        );
        setAllUsers (
            allUsers.filter(users => users !== user)
        );
     };

    return (
    <View className="flex-1 bg-orange-300">
          <Header word="Create a new Group"
                image={require('../assets/Close.png')}
                onPress={() => navigation.pop()}
          />
          <ScrollView>
          <View className = "items-center bg-orange-400 flex-col">
              <Text className = "pt-4 text-4xl text-gray-800 font-bold"> Group Name: </Text>
                <TextInput
                    placeholder = "Enter group name"
                    value = {groupName}
                    onChangeText={text => setGroupName(text)}
                    className = "text-[28px] py-4"
                />
          </View>
          <View className = "items-center bg-orange-300 flex-col">
          <Text className = "pt-4 text-4xl text-gray-800 font-bold"> Description: </Text>
            <TextInput
                placeholder = "Enter group description"
                value = {groupDesc}
                onChangeText={text => setGroupDesc(text)}
                className = "text-[28px] py-4"
            />
          </View>

          <View className = "bg-orange-500 items-center">
          <Text className = "py-4 text-4xl text-gray-800 font-bold"> Members: </Text>
          </View>
           <View className = "bg-orange-400 items-center flex-row">
                <View className = "flex-1 w-5/6 flex-row">
                  <Text className = "pt-5 text-3xl text-gray-800 font-bold"> Name: </Text>
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
                     <Text className = "text-2xl font-bold"> Loading users </Text>
                     </View>
                 ) : !started ? (
                   <View className = "py-10 px-10 mr-3 flex-1 items-center justify-center">
                    <Text className = "text-center text-2xl font-bold"> Try typing a username and pressing the search button! </Text>
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
             </ScrollView>
             <View className = "justify-center bg-orange-500 flex-row">
                <Text className = "px-2 py-2 text-2xl font-bold"> Added Users </Text>
             </View>
             <View className="items-center bg-orange-400 flex-row h-20">
                <ScrollView horizontal className=" bg-orange-400">
                    {selectedUsers.map((event) => (
                    <TouchableOpacity
                              onPress = { () =>
                                  {
                               setSelectedUsers(selectedUsers.filter(user => user !== event));
                               setSearchDisplay(searchDisplay.concat([event]));
                               setAllUsers(searchDisplay.concat([event]));
                               setAllUsers(searchDisplay.concat([event]));
                               }
                              }>
                    <View key={event._id} className="rounded-xl flex-col px-3 py-3">
                        <Text className="rounded-xl px-3 py-3 bg-orange-300 font-bold text-2xl">{event.name}</Text>
                    </View>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
           </View>
           <TouchableOpacity
               onPress={() => {
                 if (groupName.trim() === "") {
                     Alert.alert("Missing Group Name", "Please enter a group name");
                 } else if (groupDesc.trim() === "") {
                     Alert.alert("Missing Group Description", "Please enter a group description");
                 } else {
                   handleAdding(groupName, myuser, selectedUsers, groupDesc, navigation);
                 }
               }
           }>
           <View className="py-8 bg-orange-500 justify-center items-center">
               <Text className="pb-14 text-2xl font-bold text-white">Create Group</Text>
           </View>
           </TouchableOpacity>
    </View>
    )
}