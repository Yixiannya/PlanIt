import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, View, Dimensions, ScrollView, TouchableOpacity, Image} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { getEvent } from '../Data/getEvent';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useUserStore } from '../Data/userStore';

export function sorter(loading, selected, actualEvents) {
    return !loading && selected
     ? actualEvents.filter(event => event.dueDate.split('T')[0] <= selected && event.endDate.split('T')[0] >= selected)
             .sort( (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
     : [];
    }

export default function CalendarFunc() {
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);
  const screenHeight = Dimensions.get('window').height;
  const [actualEvents, setActualEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const isFocused = useIsFocused();

  useEffect(() => {
      async function fetchEvents() {
          setLoading(true);
          const events = await getEvent(user._id);
          setActualEvents(Array.isArray(events) ? events : []);
          setLoading(false);
      }
        if (isFocused) {
          fetchEvents();
      }
  }, [isFocused]);


  const filteredEvents = sorter(loading, selected, actualEvents);

  return (
    <View className="flex-col flex-1 bg-orange-300">
      <Header word = "Timetable" image = {require('../assets/ADD.png')}
      onPress={() => {
        if (loading) {
          Alert.alert("Too fast", "Wait for loading to finish");
        } else {
          navigation.navigate('Add Event', {
            Group: "",
            allEvents: actualEvents
          });
        }
      }}/>
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
          },
        }}
      />
     <Text className="font-bold text-2xl px-3 py-3 bg-orange-500">{"Events on "}
     {selected.split('-')[2]}/
     {selected.split('-')[1]}/
     {selected.split('-')[0]}
     :</Text>
               {loading ? (
                    <View className="flex-1 justify-center items-center">
                   <Text className="text-2xl"> Loading events...</Text>
                   </View>
               ) : filteredEvents.length === 0 ? (
                   <View className="flex-1 justify-center items-center">
                 <Text className="text-2xl">No events for this day.</Text>
                 </View>
               ) : (
                   <ScrollView>
               {filteredEvents.map(event => (
                   <TouchableOpacity onPress = {() => navigation.navigate('EditDeletePage',
                       {event,
                           location: () => navigation.replace('BottomTabs', { screen: 'Calendar' }),
                           allEvents: actualEvents,
                           } )}>
                   <View className="flex-col">
                   <View className = "bg-orange-400 flex-row rounded-2xl border-4 border-orange-300">
                     <View className = "flex-col flex-1 px-2 py-5">
                     <Text className="px-1 text-3xl font-bold ml-1 mb-1">Name: {event.name}</Text>
                     <Text className="text-xl px-5">
                     <Text className = "font-bold">
                     {"Start Time: "}
                     </Text>
                     {event.dueDate.split('T')[0].split('-')[2]}/
                     {event.dueDate.split('T')[0].split('-')[1]}/
                     {event.dueDate.split('T')[0].split('-')[0]},{" "}
                     {event.dueDate.split('T')[1].split('.')[0]}
                     </Text>
                     <Text className="text-xl px-5">
                     <Text className = "font-bold">
                     {"End Time: "}
                     </Text>
                     {event.endDate.split('T')[0].split('-')[2]}/
                     {event.endDate.split('T')[0].split('-')[1]}/
                     {event.endDate.split('T')[0].split('-')[0]},{" "}
                     {event.endDate.split('T')[1].split('.')[0]}
                     </Text>
                     <Text className="text-xl px-5">
                     <Text className="font-bold">
                     Description:
                     </Text>
                     {event.description}</Text>
                     </View>
                    </View>
                   </View>
                   </TouchableOpacity>
                 ))}
                   </ScrollView>
               )}
    </View>
  );
}
