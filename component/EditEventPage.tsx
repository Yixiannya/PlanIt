import { useEffect, useState } from 'react';
import { Text, View, TextInput, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import DateSelector from '../REUSABLES/DateSelector'
import TimeSelector from '../REUSABLES/TimeSelector'
import EditEventButton from '../REUSABLES/EditEventButton';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

export default function EditEventPage( { route } ) {
    const navigation = useNavigation();
    const {event, location} = route.params;

    const [datePart, timePart] = event.dueDate.split('T');
    const [hour, minute, second] = timePart.split(':');

    const [actualDate, setActualDate] = useState([]);
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchDesc, setSearchDesc] = useState('');

    useEffect(() => {
            if (event) {
              setSearchName(event.name);
              setSearchDesc(event.description);
              setActualDate(datePart);
              setSearchHour(hour);
              setSearchMinute(minute);
            }
    }, [event]);

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

    const onBlurPad = (func, text) => {
      if (text.length === 1) {
        func(text.padStart(2, '0'));
      }
    };

    return (
    <View className = "flex-1 flex-col">
     <Header word = "Edit a personal event" image = {require('../assets/Close.png')}
            onPress = {() => navigation.pop()} />

    <ScrollView>
    <DateSelector actualDate={actualDate} setActualDate={setActualDate} />
    <TimeSelector
        searchHour = { searchHour }
        searchMinute = { searchMinute }
        setSearchHour = {setSearchHour}
        setSearchMinute = {setSearchMinute}
        onChangeHour = { onChangeHour }
        onChangeMinute = { onChangeMinute }
        onBlurPad = { onBlurPad }
    />

    <View className = "bg-orange-200 flex-col py-3">
        <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Name: </Text>
        <TextInput
             placeholder = "Enter name"
             value = {searchName}
             onChangeText={text => setSearchName(text)}
             className = "px-4 text-[30px]"
        />
         </View>

    <View className = "bg-orange-100 flex-col py-3">
        <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Description: </Text>
        <TextInput
              placeholder = "Enter description"
              value = {searchDesc}
              onChangeText={text => setSearchDesc(text)}
              className = "px-4 text-[30px]"
        />
          </View>
    <EditEventButton ID = {event._id} Name = {searchName}
    Date = {actualDate} Hour = {searchHour} Minute = {searchMinute} Description = {searchDesc}
    Group = {"Testing"} Location = { location } />
    </ScrollView>
    </View>
    )
    }