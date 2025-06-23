import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import { getEvent } from '../Data/getEvent';
import {getUser} from '../Data/getUser';
import {getGroups} from '../Data/getGroups';
import { useUserStore } from '../Data/userStore';
import {useGroupStore} from '../Data/groupStore'

export default function MainPage() {
    const navigation = useNavigation();
    const [actualEvents, setActualEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.user);
    const setUser =  useUserStore((state) => state.setUser);
    const clearToken = useUserStore.getState().clearUser

useEffect(() => {
  async function fetchEvents() {
    setLoading(true);
    const myuser = await getUser(user._id);
    setUser(myuser);
    const mygroups = await getGroups(user._id);
    setGroups(mygroups);
    const events = await getEvent(user._id);
    setActualEvents(Array.isArray(events) ? events : []);
    setLoading(false);
  }
  fetchEvents();
}, []);

    const sortedEvents = !loading
    ? actualEvents.sort( (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    : [];

    return (
    <View className="bg-gray-200 flex-1 flex-col items-center">
        <Header word = "Your Upcoming Events" image= {require('../assets/logout.png')}
         onPress = {() =>
             Alert.alert("Logout", "Are you sure you want to logout?",
                 [
                    { text: "No"},
                    { text: "Yes", onPress:
                        () => {
                         clearToken();
                         navigation.replace("LoginPage");
                         } },
                 ]
             )} />
        <Carousel loading = {loading} events = {sortedEvents}/>
        <CurrentGroupsHeader loading = { loading } groups = { groups } />
        <ClassReminder loading = {loading} events = {groups}/>
    </View>
  );
  }

const Carousel = ({ loading, events}) => {
    const navigation = useNavigation();
  return (
      <View className="h-56 w-full flex-row items-center justify-center bg-orange-500">
        <View className="mr-0.25 absolute w-full h-56 rounded-t-xl rounded-b-xl items-center bg-gray-100 z-0" />
            {loading ? (
                <View className="flex-1 justify-center items-center">
                     <Text className="text-2xl">Loading events...</Text>
                </View>
            ) : (
            <ScrollView horizontal>
                <View className="flex-row">
                 {events.map((event) => (
                   <TouchableOpacity onPress = {() => navigation.navigate('EditDeletePage',
                       {event,
                           location: () => navigation.replace('BottomTabs', { screen: 'Main-Page' }),
                            allEvents: events,
                       } )}>
                   <View key={event._id} className="py-2 border-4 bg-gray-300 border-gray-300 rounded-2xl flex-col px-5 ml-3 mr-3">
                   <View className="py-3 justify-center items-center">
                     <Image source = {require('../assets/ICON.png')} />
                   </View>
                     <Text className="py-1 justify-center text-center font-bold text-4xl">{event.name}</Text>
                     <Text className="py-2 justify-center text-center">
                     {event.dueDate.split('T')[0].split('-')[2]}/
                     {event.dueDate.split('T')[0].split('-')[1]}/
                     {event.dueDate.split('T')[0].split('-')[0]},{" "}
                     {event.dueDate.split('T')[1].split('.')[0]}
                     </Text>
                   </View>
                   </TouchableOpacity>
               ))}
                </View>
            </ScrollView>
            )}
      </View>
  );
};

const CurrentGroupsHeader = ({loading, groups}) => {
    const navigation = useNavigation();
  return (
      <TouchableOpacity onPress={ () =>
          navigation.navigate('Groups', {
            loading,
            Groups: groups,
            })
          }>
      <View className="w-full h-18 flex-row items-center justify-between bg-orange-500 pb-2 pl-2">
        <Text className="text-black text-[20px] font-bold pl-1">
          Your Current Groups
        </Text>
        <Image className="ml-2 pt-1" source={require('../assets/Arrow.png')}/>
      </View>
      </TouchableOpacity>
  );
};

const ClassReminder = ({ loading, events}) => {
    return (
        loading ? (
            <View className="flex-1 justify-center items-center">
            <Text className="text-2xl">Loading events...</Text>
            </View>
        ) : (
      <ScrollView>
    <View className="w-full flex-col items-center justify-center">
      {events.map((events) => (
        <GroupComponent indivEvent ={events} />
      ))}
    </View>
    </ScrollView>
    )
  );
};

const menu = () => {
    return (
     <View className="w-full flex-row items-center justify-between bg-gray-500 pb-2 pl-2">
            <TouchableOpacity onPress={GroupDirect} className="ml-2 flex-1 pt-1">
                <Image source={require('../assets/Arrow.png')}/>
            </TouchableOpacity>
          </View>
  );
};

const GroupComponent = ({ indivEvent }) => {
    const navigation = useNavigation();
    const setGroup = useGroupStore((state) => state.setGroup);
    return (
        <TouchableOpacity onPress = {() => {
            setGroup(indivEvent);
            navigation.navigate('GroupTabs', {
                      screen: 'Group Info',
                    });
            } }className="w-full flex-row items-center justify-between
                         bg-gray-300 rounded-2xl border-2 border-gray-200">
            <View className="h-20 w-20 items-center mt-2">
                <Image source={require('../assets/ICON.png')}/>
            </View>

            <View className="w-full flex-col justify-center ml-2 flex-1 py-5" >
                <Text className="font-bold text-2xl">{indivEvent.name}</Text>
                <Text className="text-[16px] mr-2">
                {"Description: "}
                {indivEvent.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

