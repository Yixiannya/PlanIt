import { useEffect, useState } from 'react';
import { Image, Alert, TouchableOpacity, Text, View, TextInput, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import DateSelector from '../REUSABLES/DateSelector'
import TimeSelector from '../REUSABLES/TimeSelector'
import EditEventButton from '../REUSABLES/EditEventButton';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { getUser } from '../Data/getUser';
import { getEvent } from '../Data/getEvent';
import { getGroup } from '../Data/getGroup';
import moment from "moment";
import { useUserStore } from '../Data/userStore';
import Timetable from "react-native-calendar-timetable";

export default function EditEventPage( { route } ) {
    const navigation = useNavigation();
    const {event, location, allEvents} = route.params;

    const [datePart, timePart] = event.dueDate.split('T');
    const [hour, minute, second] = timePart.split(':');

    const [datePart2, timePart2] = event.endDate.split('T');
    const [hour2, minute2, second2] = timePart2.split(':');

    const [actualDate, setActualDate] = useState([]);
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchDesc, setSearchDesc] = useState('');
    const [actualendDate, setActualendDate] = useState([]);
    const [endsearchHour, setendSearchHour] = useState('');
    const [endsearchMinute, setendSearchMinute] = useState('');
    const [venue, setVenue] = useState('');
    const [notifyTime, setNotifyTime] = useState();

    const [openTable, setopenTable] = useState(false);
    const [tempDate, settempDate] = useState([]);
    const [userEvents, setuserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const from = moment(tempDate).startOf('day').toDate();
    const till = moment(tempDate).endOf('day').toDate();
    const range = { from, till };
    const [thegroup, setGroup] = useState();
    const [filteredEvents, setFilteredEvents] =
    useState(allEvents.filter(events => events._id !== event._id).map(
                            event => [event.dueDate, event.endDate]));

    useEffect(() => {
        async function fetchUsers(id_array) {
            const user = await Promise.all(id_array.map((id) => getUser(id)));
            return user;
        }
        async function fetchEvents(id_array) {
                const user = await Promise.all(id_array.map((id) => getEvent(id)));
                return user;
        }
        async function loadUsers() {
            try {
                setLoading(true);
                const Group = await getGroup(event.group);
                setGroup(Group);
                const events = await fetchEvents((Group.members).concat(Group.admins));
                const users = await fetchUsers((Group.members).concat(Group.admins));
                const uniqueEvents = events.flat().filter(
                    (event, index, arr) => arr.findIndex(e => e._id === event._id) === index)
                    .filter(events => events._id !== event._id)
                    .map(z => [users
                        .filter(a => a.events
                            .some(thing => thing === z._id))
                        .map(user => user.name), z]);
                setuserEvents(uniqueEvents);
                setFilteredEvents(uniqueEvents.map(pair => [pair[1].dueDate, pair[1].endDate]));
                setLoading(false);
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }}
        if (event?.group !== undefined) {
            loadUsers();
        } else {
            setLoading(false);
        }
      }, []);

    useEffect(() => {
            if (event) {
              setSearchName(event.name);
              setSearchDesc(event.description);
              setActualDate(datePart);
              setSearchHour(hour);
              setSearchMinute(minute);
              setActualendDate(datePart2);
              setendSearchHour(hour2);
              setendSearchMinute(minute2);
              settempDate(datePart);
              setVenue(event.venue)
              setNotifyTime(event.offsetMs)
            }
    }, [event]);

    const YourComponent = ({ style, item, dayIndex, daysTotal }) => {
            return (
             <View style={{
                      ...style,
                      backgroundColor: 'orange',
                      borderRadius: 10,
                      elevation: 5,
                  }}>
                <View className = "bg-orange-400 rounded-xl flex-1 flex-col justify-center items-center">
                    <Text className = "text-center font-bold text-2xl">Name: {item.title}</Text>
                    <Text className = "font-bold text-xl text-center"> Users: </Text>
                    <Text className = "text-xl text-center"> {item.users}</Text>
                    <Text className = "text-sm text-center">
                      Start date: {item.startDate.toLocaleDateString()}, {item.startDate.toLocaleTimeString()}
                    </Text>
                    <Text className = "text-sm text-center">
                      End date: {item.endDate.toLocaleDateString()}, {item.endDate.toLocaleTimeString()}
                    </Text>
                </View>
             </View>
            );
          };

      const items = userEvents.map((event) => ({
          title: `${event[1].name}`,
          startDate: new Date(event[1].dueDate.replace("Z", "")),
          endDate: new Date(event[1].endDate.replace("Z", "")),
          users: `${event[0]}`
          }));

    const onChangeHour = (text: string) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 23) {
            setSearchHour(text);
        }
    };

    const onChangeMinute = (text: string) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 59) {
            setSearchMinute(text);
        }
    };

    const onChangeEndHour = (text) => {
                const number = parseInt(text, 10)
                if (text === '' || !isNaN(number) && number >= 0 && number <= 23) {
                    setendSearchHour(text);
                    console.log(searchHour);
                }
            };

    const onChangeEndMinute = (text) => {
                const number = parseInt(text, 10)
                if (text === '' || !isNaN(number) && number >= 0 && number <= 59) {
                    setendSearchMinute(text);
                    console.log(searchMinute);
                }
    };

    const onBlurPad = (func, text) => {
      if (text.length === 1) {
        func(text.padStart(2, '0'));
      }
    };

    const expandedDates = (events) => {
        const temp = {}
        for (const event of events) {
            let start = new Date(event[0].split('T')[0]);
            const end = new Date(event[1].split('T')[0]);

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

    return (
    <View className = "flex-1 flex-col bg-orange-500">
         <Header word = "Edit an event" image = {require('../assets/Close.png')}
                onPress = {() => navigation.pop()} />

    <View>
        {event?.group !== undefined && <View className = "border-2 border-orange-600">
            <TouchableOpacity onPress = {() => setopenTable(!openTable)}>
                <View className = "border-4 border-orange-600 flex-row bg-orange-400 items-center justify-center">
                    <Text className = "w-4/5 font-bold text-3xl" > Check team schedule </Text>
                    {!openTable ?
                    <Image source= { require('../assets/arrowdown.png' ) } />
                    :
                    <Image source= { require('../assets/arrowup.png' ) } />}
                </View>
            </TouchableOpacity>
         {openTable && !loading && (
                <ScrollView className = "h-[300px]">
                  {loading ? (
                    <View className="flex-1 justify-center items-center">
                      <Text className="text-2xl">Loading events...</Text>
                    </View>
                  ) : (
                      <View>
                      <View className ="border-4 border-orange-500">
                       <Calendar
                       onDayPress={(day) => {
                         settempDate(day.dateString);
                       }}
                       markedDates={{
                           ...expandedDates(filteredEvents),
                         [tempDate]: {
                              ...(expandedDates(filteredEvents)[tempDate]),
                           selected: true,
                           disableTouchEvent: true,
                           selectedDotColor: 'orange',
                         },
                       }}
                     />
                      </View>
                    <Timetable
                    items={items}
                    renderItem={(props) => <YourComponent {...props} />}
                    range={range} />
                    </View>
                  )}
                </ScrollView>
            )}
        </View>
        }
        </View>

        <ScrollView>
        <View className = "bg-orange-400 flex-col py-3">
                <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Name: </Text>
                <TextInput
                     placeholder = "Enter name"
                     value = {searchName}
                     onChangeText={text => setSearchName(text)}
                     className = "px-4 text-[30px]"
                />
            </View>

            <View className = "bg-orange-300 flex-col py-3">
                <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Description: </Text>
                <TextInput
                      placeholder = "Enter description (optional)"
                      value = {searchDesc}
                      onChangeText={text => setSearchDesc(text)}
                      className = "px-4 text-[30px]"
                />
            </View>

            <View className = "bg-orange-400 flex-col py-3">
                <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Venue: </Text>
                <TextInput
                      placeholder = "Enter a venue (optional)"
                      value = {venue}
                      onChangeText={text => setVenue(text)}
                      className = "px-4 text-[30px]"
                />
            </View>

        <View className = "bg-orange-500 py-5 items-center justify-center">
            <Text className = "font-bold text-[36px]" > Start Date </Text>
        </View>

        <DateSelector actualDate={actualDate} setActualDate={setActualDate} />

        <TimeSelector
          searchHour ={ searchHour}
          searchMinute = { searchMinute }
          setSearchHour = {setSearchHour}
          setSearchMinute = {setSearchMinute}
          onChangeHour = { onChangeHour }
          onChangeMinute = { onChangeMinute }
          onBlurPad = { onBlurPad }
        />

        <View className = "bg-orange-500 py-5 items-center justify-center">
            <Text className = "font-bold text-[36px]" > End Date </Text>
        </View>

        <DateSelector actualDate={actualendDate} setActualDate={setActualendDate} />

        <TimeSelector
              searchHour ={ endsearchHour}
              searchMinute = { endsearchMinute }
              setSearchHour = {setendSearchHour}
              setSearchMinute = {setendSearchMinute}
              onChangeHour = { onChangeEndHour }
              onChangeMinute = { onChangeEndMinute }
              onBlurPad = { onBlurPad }
        />
    { useUserStore.getState().user.notificationsEnabled !== false &&
            <View>
            <View className = "bg-orange-500 pr-1 py-5 items-center justify-center">
                <Text className = "px-6 text-center font-bold text-3xl" >When will you like to be notified of the event? </Text>
            </View>
            <ScrollView horizontal className = "py-2 flex-row bg-orange-400">
             <TouchableOpacity
               className={`m-1 px-3 py-3 ${notifyTime == 0 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
               onPress = {() => setNotifyTime(0)}
               >
                <Text className = "font-bold text-xl" > When event starts </Text>
            </TouchableOpacity>
            <TouchableOpacity
            className={`m-1 px-3 py-3 ${notifyTime == 300000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
            onPress = {() => setNotifyTime(300000)}
            >
                <Text className = "font-bold text-xl"> 5 minutes before </Text>
            </TouchableOpacity>
            <TouchableOpacity
            className={`m-1 px-3 py-3 ${notifyTime == 900000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
            onPress = {() => setNotifyTime(900000)}
            >
                <Text className = "font-bold text-xl" > 15 minutes before </Text>
            </TouchableOpacity>
            <TouchableOpacity
            className={`m-1 px-3 py-3 ${notifyTime == 1800000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
            onPress = {() => setNotifyTime(1800000)}
            >
                <Text className = "font-bold text-xl" > 30 minutes before </Text>
            </TouchableOpacity>
            <TouchableOpacity
             className={`m-1 px-3 py-3 ${notifyTime == 3600000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
             onPress = {() => setNotifyTime(3600000)}
             >
                <Text className = "font-bold text-xl" > 1 hour before </Text>
            </TouchableOpacity>
            <TouchableOpacity
             className={`m-1 px-3 py-3 ${notifyTime == 10800000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
             onPress = {() => setNotifyTime(10800000)}
             >
                <Text className = "font-bold text-xl" > 3 hours before </Text>
            </TouchableOpacity>
            <TouchableOpacity
             className={`m-1 px-3 py-3 ${notifyTime == 21600000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
             onPress = {() => setNotifyTime(21600000)}
             >
                <Text className = "font-bold text-xl" > 6 hours before </Text>
            </TouchableOpacity>
            <TouchableOpacity
             className={`m-1 px-3 py-3 ${notifyTime == 43200000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
             onPress = {() => setNotifyTime(43200000)}
             >
                <Text className = "font-bold text-xl" > 12 hours before </Text>
            </TouchableOpacity>
            <TouchableOpacity
             className={`m-1 px-3 py-3 ${notifyTime == 86400000 ? 'bg-orange-600' : 'bg-orange-500'} rounded-2xl`}
             onPress = {() => setNotifyTime(86400000)}
             >
                <Text className = "font-bold text-xl" > 24 hours before </Text>
            </TouchableOpacity>
        </ScrollView>
        </View>}
    <EditEventButton ID = {event._id} Name = {searchName}
    Date = {actualDate} Hour = {searchHour} Minute = {searchMinute}
    endDate = {actualendDate} endHour = {endsearchHour} endMinute = {endsearchMinute}
    allEvents = {filteredEvents}
    Description = {searchDesc}
    Location = { location }
    venue = {venue}
    offsetMs = {notifyTime}
    group = {thegroup}
    />

    </ScrollView>
    </View>
    )
    }