import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Text, View, TextInput, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import CreateEventButton from '../REUSABLES/CreateEventButton';
import DateSelector from '../REUSABLES/DateSelector'
import TimeSelector from '../REUSABLES/TimeSelector'
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../Data/getUser';
import { getEvent } from '../Data/getEvent';
import moment from "moment";
import Timetable from "react-native-calendar-timetable";

export default function AddEvent({route}) {
    const navigation = useNavigation();
    const [actualDate, setActualDate] = useState([]);
    const [actualendDate, setActualendDate] = useState([]);
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [endsearchHour, setendSearchHour] = useState('');
    const [endsearchMinute, setendSearchMinute] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchDesc, setSearchDesc] = useState('');
    const [openTable, setopenTable] = useState(false);

    const [tempDate, settempDate] = useState([]);
    const [userEvents, setuserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const from = moment(tempDate).startOf('day').toDate();
    const till = moment(tempDate).endOf('day').toDate();
    const range = { from, till };
    const {Group, allEvents} = route.params;

    const [filteredEvents, setFilteredEvents] = useState(allEvents.map(
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
                console.log(Group)
                const events = await fetchEvents((Group.members).concat(Group.admins));
                const users = await fetchUsers((Group.members).concat(Group.admins));
                const uniqueEvents = events.flat().filter(
                    (event, index, arr) => arr.findIndex(e => e._id === event._id) === index)
                    .map(z => [users
                        .filter(a => a.events
                            .some(thing => thing === z._id))
                        .map(user => user.name), z]);
                setuserEvents(uniqueEvents);
                setFilteredEvents(uniqueEvents.map(pair => [pair[1].dueDate, pair[1].endDate]));
                console.log(uniqueEvents.map(pair => [pair[1].dueDate, pair[1].endDate]));
                setLoading(false);
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }}
        if (Group !== "") {
            loadUsers();
        } else {
            setLoading(false);
        }
      }, []);

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
                    <Text className = "font-bold text-xl text-center"> Users: {item.users}</Text>
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

    const onChangeHour = (text) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 23) {
            setSearchHour(text);
            console.log(searchHour);
        }
    };

    const onChangeMinute = (text) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 59) {
            setSearchMinute(text);
            console.log(searchMinute);
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

    return (
    <View className = "flex-1 flex-col">
     <Header word = "Add an event" image = {require('../assets/Close.png')}
            onPress = {() => navigation.pop()} />

    <View>
    {Group !== "" && <View className = "border-2 border-orange-600">
        <TouchableOpacity onPress = {() => setopenTable(!openTable)}>
            <View className = "border-4 border-orange-600 flex-row bg-orange-400 items-center justify-center">
                <Text className = "w-4/5 font-bold text-3xl" > Check team schedule </Text>
                {!openTable ?
                <Image source= { require('../assets/arrowdown.png' ) } />
                :
                <Image source= { require('../assets/arrowup.png' ) } />}
            </View>
        </TouchableOpacity>
     {openTable && (
            <ScrollView className = "h-[300px]">
              {loading ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-2xl">Loading events...</Text>
                </View>
              ) : (
                  <View>
                  <View className ="border-4 border-orange-500">
                    <DateSelector actualDate={tempDate} setActualDate={settempDate} />
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

    <View className = "bg-orange-500 py-5 items-center justify-center">
        <Text className = "font-bold text-[36px]" > Start date </Text>
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
        <Text className = "font-bold text-[36px]" > End date </Text>
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
    {!loading && <CreateEventButton Name = {searchName}
    Date = {actualDate} Hour = {searchHour} Minute = {searchMinute}
    endDate = {actualendDate} endHour = {endsearchHour} endMinute = {endsearchMinute}
    Description = {searchDesc}
    allEvents = {filteredEvents}
    Group = {Group}
    Location = { () =>
        navigation.pop()} />}
    </ScrollView>
    </View>
    )
    }