import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { getEvent } from '../Data/getEvent';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useUserStore } from '../Data/userStore';
import {getGroup} from '../Data/getGroup';

export function sorter(loading, selected, actualEvents) {
    return !loading && selected
     ? actualEvents.filter(event => event.dueDate.split('T')[0] <= selected && event.endDate.split('T')[0] >= selected)
             .sort( (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
     : [];
    }

export default function CalendarFunc() {
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);
  const [actualEvents, setActualEvents] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const isFocused = useIsFocused();

  const expandedDates = (events) => {
    const temp = {}
    for (const event of events) {
        let start = new Date(event.dueDate.split('T')[0]);
        const end = new Date(event.endDate.split('T')[0]);

        while (start <= end) {
          temp[start.toISOString().split('T')[0]] = {
            marked: true,
            dotColor: 'orange',
          };
          start.setDate(start.getDate() + 1);
        };
    };
    return temp;
  }

  useEffect(() => {
      async function fetchEvents() {
          setLoading(true);
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
          setActualEvents(Array.isArray(events) ? updatedEvents : []);
          console.log("Its me", updatedEvents);
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
            ...expandedDates(actualEvents),
          [selected]: {
              ...(expandedDates(actualEvents)[selected]),
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
                          location: () => navigation.pop(2),
                           allEvents: actualEvents,
                           } )}>
                   <View className="flex-col">
                   <View className = "bg-orange-400 flex-row rounded-2xl border-4 border-orange-300">
                     <View className = "flex-col flex-1 px-2 py-5">
                     <Text className="px-1 text-3xl font-bold ml-1 mb-1">Name: {event.name}</Text>
                     {event.group != null ? (
                          <View className = "flex-row">
                          <Text className="ml-5 text-center font-bold text-2xl">Group: </Text>
                          <Text className="text-center text-2xl">{event.groupName.name}</Text>
                          </View>
                      ) : (
                          <View className = "flex-row">
                          <Text className="ml-5 font-bold text-center text-2xl">Personal event</Text>
                          </View>
                          )
                      }
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
                     {(event.description !== undefined && event.description !== "") &&
                          <Text className="text-xl px-5">
                         <Text className="font-bold">
                     Description:{" "}
                     </Text>
                     {event.description}
                     </Text>
                     }
                     {(event.venue!== undefined && event.venue !== "") &&
                     <Text className="text-xl px-5">
                      <Text className="font-bold">
                      Venue:{" "}
                      </Text>
                      {event.venue}</Text>}
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
