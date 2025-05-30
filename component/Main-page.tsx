import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';

type Group = {
    id: number;
    groupicon: Image;
    name: string;
    deadline: string;
    duedate: string;
}

export default function MainPage() {
    const navigation = useNavigation();
    const [actualEvents, setActualEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
          async function fetchEvents() {
              setLoading(true);
              const events = await getEvent();
              setActualEvents(events || []);
              setLoading(false);
          }
          fetchEvents();
    }, []);

    const sortedEvents = !loading
    ? actualEvents.sort( (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    : [];

    return (
    <View className="flex-1 flex-col items-center">
        <Header word = "Your Upcoming Events" image= {require('../assets/ICON.png')}
         onPress = {() => navigation.navigate('Add Event')} />
        <Carousel loading = {loading} events = {sortedEvents}/>
        <CurrentGroupsHeader />
        <ClassReminder loading = {loading} events = {sortedEvents}/>
    </View>
  );
  }

const Carousel = ({ loading, events}) => {
    const navigation = useNavigation();
  return (
      <View className="h-56 w-full flex-row items-center justify-center bg-orange-500">
        <View className="mr-0.25 absolute w-full h-56 rounded-t-xl rounded-b-xl items-center bg-white z-0" />
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
                           location: () => navigation.replace('BottomTabs', { screen: 'Main-Page' }) } )}>
                   <View key={event._id} className="flex-col px-9">
                   <View className="py-2 justify-center items-center">
                     <Image source = {require('../assets/ICON.png')} />
                   </View>
                     <Text className="py-2 justify-center text-center font-bold text-2xl">{event.name}</Text>
                     <Text className="py-2 justify-center text-center">{event.dueDate}</Text>
                   </View>
                   </TouchableOpacity>
               ))}
                </View>
            </ScrollView>
            )}
      </View>
  );
};

const CurrentGroupsHeader = () => {
      const GroupDirect = () => {
          console.log('Group Direct button pressed');
      };
  return (
      <TouchableOpacity onPress={GroupDirect}>
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
     const GroupIconPressed = () => {
              console.log('Group Icon button pressed');
          };
    return (
        <View className="w-full flex-row items-center justify-between
                         bg-gray-300 border border-gray-500">
            <TouchableOpacity onPress={GroupIconPressed} className="h-20 w-20 items-center mt-2">
                <Image source={require('../assets/ICON.png')}/>
            </TouchableOpacity>

            <View className="w-full flex-col justify-center ml-2 flex-1 py-2" >
                <Text className="font-bold text-xl">{indivEvent.group}</Text>
                <Text>Description: {indivEvent.description}</Text>
                <Text>Due date: {indivEvent.dueDate}</Text>
            </View>

            <TouchableOpacity onPress={GroupIconPressed} className="h-20 w-20 items-center mt-2">
                <Image source={require('../assets/Arrow.png')}/>
            </TouchableOpacity>
        </View>
    );
}

