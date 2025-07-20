import { TouchableOpacity, Alert, ScrollView, View, Text } from "react-native";
import { useEffect, useState } from 'react';
import moment from "moment";
import Timetable from "react-native-calendar-timetable";
import { Calendar } from 'react-native-calendars';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getGroupEvents } from '../Data/getGroupEvents'
import Header from '../REUSABLES/HeaderBanner';
import { useGroupStore } from '../Data/groupStore';
import { useUserStore } from '../Data/userStore';

export default function GroupCalendar() {
    const Group = useGroupStore((state) => state.group);
    const [loading, setLoading] = useState(true);
    const [actualEvents, setActualEvents] = useState([]);

    const navigation = useNavigation();
    const today = new Date().toISOString().split('T')[0];
    const [selected, setSelected] = useState(today);
    const [Admins, setAdmins] = useState([]);
    const from = moment(selected).startOf('day').toDate();
    const till = moment(selected).endOf('day').toDate();
    const range = { from, till };
    const myuser = useUserStore((state) => state.user);
    const isAdmin = Admins.some((admin => admin == myuser._id));
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
        const events = await getGroupEvents(Group._id, "/events");
        setActualEvents(events.events.map((event) => ({
           ...event,
           groupName: Group,
        })));
        const replace = await getGroupEvents(Group._id, "");
        console.log(Group);
        setAdmins(replace.admins);
        setLoading(false);
      }
      if (isFocused) {
        fetchEvents();
      }
    }, [isFocused]);
    const YourComponent = ({ style, item, dayIndex, daysTotal }) => {
          return(
              <TouchableOpacity
                onPress={() => navigation.navigate('EditDeletePage', {
                  event: actualEvents.filter(x => x._id === item.id)[0],
                  location: () => {
                      navigation.pop()},
                  allEvents: [],
                })}
                style={{
                    ...style,
                    backgroundColor: 'orange',
                    borderRadius: 10,
                    elevation: 5,
                }}>
              <View className = "bg-orange-400 rounded-xl flex-1 flex-col justify-center items-center">
                  <Text className = "text-center font-bold text-2xl">{item.title}
                  {item.venue !== undefined && item.venue !== '' && ` (Venue: ${item.venue})`}
                  </Text>
                  <Text className = "text-center text-sm">
                    Start date: {item.startDate.toLocaleDateString()}, {item.startDate.toLocaleTimeString()}
                  </Text>
                  <Text className = "text-center text-sm">
                    End date: {item.endDate.toLocaleDateString()}, {item.endDate.toLocaleTimeString()}
                  </Text>
              </View>
            </TouchableOpacity>

          );
        };

    const items = actualEvents.map((event) => ({
        title: `${event.name}`,
        startDate: new Date(event.dueDate.replace("Z", "")),
        endDate: new Date(event.endDate.replace("Z", "")),
        id: event._id,
        venue: event.venue,
        }));

    return (
        <View className = "flex-1">
        <Header word = "Group Events" image = {require('../assets/ADD.png')}
              onPress = {() =>
                  {isAdmin ? (
                      navigation.navigate('Add Event',
                        { Group: Group,
                            allEvents: actualEvents},)
                      ) : (
                          Alert.alert("Not an admin", "You are not an admin")
                          )}} />
              <View className = "h-600">
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

