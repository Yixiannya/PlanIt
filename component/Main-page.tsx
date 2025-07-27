import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getEvent } from '../Data/getEvent';
import {getUser} from '../Data/getUser';
import {getGroups} from '../Data/getGroups';
import { useUserStore } from '../Data/userStore';
import {useGroupStore} from '../Data/groupStore'
import {getGroup} from '../Data/getGroup';
import {useNotificationStore} from  '../Data/notificationStore'
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function sorting (today, loading, actualEvents) {
    return !loading
    ? actualEvents.filter(event => new Date(event.dueDate) >= today || new Date(event.endDate) >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    : [];
}

export default function MainPage() {
    const navigation = useNavigation();
    const [actualEvents, setActualEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.user);
    const setUser =  useUserStore((state) => state.setUser);
    const clearToken = useUserStore.getState().clearUser;
    const isFocused = useIsFocused();
    const [today, setToday] = useState();
    console.log(today);

useEffect(() => {
  async function fetchEvents() {
    setLoading(true);
    const myuser = await getUser(user._id);
    setUser(myuser);
    const mygroups = await getGroups(user._id);
    setGroups(mygroups);
    const events = await getEvent(user._id);
    const updatedEvents = await Promise.all(
      events.map(async (event) => {
        if (event.group != null) {
          const groupName = await getGroup(event.group);
          return {
            ...event,
            groupName: groupName,
          };
        } else {
          return event;
        }
      })
    );
    const nowUtc = new Date();
    setToday(new Date(nowUtc.getTime() + 8 * 60 * 60 * 1000));
    setActualEvents(Array.isArray(events) ? updatedEvents : []);
    setLoading(false);
  }
  if (isFocused) {
      fetchEvents();
  }
}, [isFocused]);

    const sortedEvents = sorting (today, loading, actualEvents);

    return (
    <View className="bg-gray-200 flex-1 flex-col">
        <Header word = "Your Upcoming Events" image= {require('../assets/logout.png')}
         onPress = {() =>
             Alert.alert("Logout", "Are you sure you want to logout?",
                 [
                    { text: "No"},
                    { text: "Yes", onPress:
                        async () => {
                         clearToken();
                         if (useNotificationStore.getState().listener) {
                             useNotificationStore.getState().clearListener();
                         }
                         await GoogleSignin.signOut();
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
            ) : events.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                         <Text className="mr-1 px-12 text-center text-2xl"> No events? Create one by pressing "+" at the Calendar! </Text>
                    </View>
                    ) : (
            <ScrollView horizontal>
                <View className="flex-row">
                 {events.slice(0, 20).map((event) => (
                   <TouchableOpacity onPress = {() => navigation.navigate('EditDeletePage',
                       {event,
                           location: () => navigation.pop(2),
                            allEvents: events,
                       } )}>
                   <View key={event._id} className="py-4 border-4 bg-gray-300 border-gray-300 rounded-2xl flex-col px-5 ml-3 mr-3">
                     <Text className="py-1 justify-center text-center font-bold text-5xl">{event.name}</Text>
                     {event.group != null ? (
                         <View className = "flex-row justify-center ">
                         <Text className="text-center font-bold text-3xl">Group: </Text>
                         <Text className="text-center text-3xl">{event.groupName.name}</Text>
                         </View>
                     ) : (
                         <View className = "flex-row justify-center ">
                         <Text className="font-bold text-center text-3xl">Personal event</Text>
                         </View>
                         )
                     }
                    {(event.venue!== undefined && event.venue !== "") &&
                     <Text className="text-center text-2xl px-5">
                      <Text className="font-bold">
                      Venue:{" "}
                      </Text>
                      {event.venue}</Text>}
                     <Text className="pt-1 justify-center text-center">
                     <Text className = "font-bold">
                       Start Date:{" "}
                     </Text>
                     {event.dueDate.split('T')[0].split('-')[2]}/
                     {event.dueDate.split('T')[0].split('-')[1]}/
                     {event.dueDate.split('T')[0].split('-')[0]},{" "}
                     {event.dueDate.split('T')[1].split('.')[0]}
                     </Text>
                     <Text className="justify-center text-center">
                     <Text className = "font-bold">
                      End Date:{" "}
                     </Text>
                      {event.endDate.split('T')[0].split('-')[2]}/
                      {event.endDate.split('T')[0].split('-')[1]}/
                      {event.endDate.split('T')[0].split('-')[0]},{" "}
                      {event.endDate.split('T')[1].split('.')[0]}
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
            <Text className="text-2xl">Loading groups...</Text>
            </View>
        ) : events.length === 0 ? (
            <View className="flex-1 justify-center items-center">
            <Text className="py-8 mr-1 mb-7 px-8 text-center text-3xl"> No groups? Press "Your Current Groups" to create your first group!
            </Text>
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
            }} className= "w-full bg-gray-300 rounded-2xl border-4 border-gray-200 px-7 py-5" >
                <Text className="px-1 font-bold text-3xl">{indivEvent.name}</Text>
                <Text className="px-3 text-[16px] mr-2">
                {"Description: "}
                {indivEvent.description}
                </Text>
        </TouchableOpacity>
    );
}

