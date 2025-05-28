import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, View, Dimensions, ScrollView, TouchableOpacity, Image} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { getEvent } from '../Data/getEvent';
import { useNavigation } from '@react-navigation/native';


type event = {
    date: Date;
    description: string;
}

export default function CalendarFunc() {
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);
  const screenHeight = Dimensions.get('window').height;
  const [actualEvents, setActualEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
      async function fetchEvents() {
          setLoading(true);
          const events = await getEvent();
          setActualEvents(events || []);
          setLoading(false);
      }
      fetchEvents();
  }, []);


  const filteredEvents = !loading && selected
  ? actualEvents.filter(event => event.dueDate.split('T')[0] === selected)
          .sort( (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  : [];

  return (
    <View className="flex-col flex-1">
      <Header word = "Timetable" image = {require('../assets/ADD.png')}
      onPress = {() => navigation.navigate('Add Event')} />
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
     <Text className="font-bold text-2xl px-3 py-3 bg-orange-500">Events on {selected}:</Text>
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
                           location: () => navigation.replace('BottomTabs', { screen: 'Calendar' })} )}>
                   <View key={event._id} className="flex-col">
                   <View className = "flex-row border border-black">
                     <View className = "flex-col flex-1 px-2 py-5 w-4/5">
                     <Text className="text-3xl font-bold ml-1 mb-1">Name: {event.name}</Text>
                     <Text className="text-xl"> Due Date: {event.dueDate}</Text>
                     <Text className="text-xl"> Description: {event.description}</Text>
                     </View>
                     <View className = "px-3 justify-center items-center">
                    <Image source={require('../assets/Arrow.png')}/>
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
