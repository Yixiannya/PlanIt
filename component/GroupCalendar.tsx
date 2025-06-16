import { ScrollView, View, Text } from "react-native";
import { useEffect, useState } from 'react';
import moment from "moment";
import Timetable from "react-native-calendar-timetable";
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { getGroupEvents } from '../Data/getGroupEvents'
import Header from '../REUSABLES/HeaderBanner';
import { useGroupStore } from '../Data/groupStore';

export default function GroupCalendar() {
    const Group = useGroupStore((state) => state.group);
    console.log("hello", Group);

    const [loading, setLoading] = useState(true);
    const [actualEvents, setActualEvents] = useState([]);

    const navigation = useNavigation();
    const today = new Date().toISOString().split('T')[0];
    const [selected, setSelected] = useState(today);
    const from = moment(selected).startOf('day').toDate();
    const till = moment(selected).endOf('day').toDate();
    const range = { from, till };

    useEffect(() => {
      async function fetchEvents() {
          setLoading(true);
        const events = await getGroupEvents(Group._id, "/events");
        setActualEvents(Array.isArray(events) ? events : []);
        setLoading(false);
      }
      fetchEvents();
    }, []);

    const YourComponent = ({ style, item, dayIndex, daysTotal }) => {
          return(
            <View
              style={{
                ...style, // Keep layout positioning
                backgroundColor: 'red',
                borderRadius: 10,
                elevation: 5,
              }}
            >
              <View className = "flex-1 flex-col justify-center items-center">
                  <Text className = "font-bold text-2xl py-2">{item.title}</Text>
                  <Text>
                    Start date: {item.startDate.toLocaleDateString()}, {item.startDate.toLocaleTimeString()}
                  </Text>
                  <Text>
                    End date: {item.endDate.toLocaleDateString()}, {item.endDate.toLocaleTimeString()}
                  </Text>
              </View>

            </View>
          );
        };

    const items = actualEvents.map((event) => ({
        title: `${event.name}`,
        startDate: new Date(event.dueDate.replace('Z', '')),
        endDate: new Date(event.endDate.replace('Z', '')),
        }));
    console.log("Its  norrr me", items);

    return (
        <View className = "flex-1">
        <Header word = "Group Events" image = {require('../assets/ADD.png')}
              onPress = {() => navigation.navigate('Add Event')} />
              <View className = "h-600">
        <Calendar
            onDayPress={(day) => {
            setSelected(day.dateString);
            }}
            markedDates={{
                [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedDotColor: "orange",
                },
            }}
        />
        </View>
        <ScrollView>
        {loading ? (
            <View className="flex-1 justify-center items-center">
                <Text className="text-2xl">Loading events...</Text>
            </View>
        ) : (
            <Timetable
                items={items}
                renderItem={(props) => <YourComponent {...props} />}
                range={range}
            />
        )}
        </ScrollView>
       </View>
    )
}

