import { useEffect, useState } from 'react';
import { Text, View, TextInput, ScrollView } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import CreateEventButton from '../REUSABLES/CreateEventButton';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

export default function EditEvent() {
    const navigation = useNavigation();
    const [actualDate, setActualDate] = useState([]);
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchDesc, setSearchDesc] = useState('');

    const onChangeHour = (text: string) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 23) {
            setSearchHour(text);
            console.log(searchHour);
        }
    };

    const onChangeMinute = (text: string) => {
        const number = parseInt(text, 10)
        if (text === '' || !isNaN(number) && number >= 0 && number <= 59) {
            setSearchMinute(text);
            console.log(searchMinute);
        }
    };

    const onChangeName = (text: string) => {
        setSearchName(text);
        console.log(searchName);
    };

    const onChangeDesc = (text: string) => {
        setSearchDesc(text);
        console.log(searchDesc);
    };

    const onBlurPad = (func, text) => {
      if (text.length === 1) {
        func(text.padStart(2, '0'));
      }
    };

    return (
    <View className = "flex-1 flex-col">
     <Header word = "Add a personal event" image = {require('../assets/Close.png')}
            onPress = {() => navigation.navigate('BottomTabs', { screen: 'Calendar' })} />

    <ScrollView>
    <View className = "bg-orange-400">
    <Text className = "px-1 py-3 pt-3 text-4xl text-gray-800 font-bold"> Date: </Text>
    <Calendar
        onDayPress={(day) => {
        setActualDate(day.dateString);
        }}
        markedDates={{
        [actualDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
        },
        }}
    />
    </View>

    <View className = "bg-orange-300 py-2">
       <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Time: </Text>
       <View className = "flex-row pb-3">
       <TextInput
           placeholder = "(HH)"
           value = {searchHour}
           onChangeText={onChangeHour}
           onBlur={() => onBlurPad(setSearchHour, searchHour)}
           maxLength={2}
           className = "pl-6 text-[50px] font-bold"
           />
       <Text className = "text-[50px] font-bold py-2"> : </Text>
       <TextInput
           placeholder = "(MM)"
           value = {searchMinute}
           onChangeText={onChangeMinute}
           onBlur={() => onBlurPad(setSearchMinute, searchMinute)}
           maxLength={2}
           className = "text-[50px] font-bold"
       />
       </View>
        </View>

    <View className = "bg-orange-200 flex-col py-3">
        <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Name: </Text>
        <TextInput
             placeholder = "Enter name"
             value = {searchName}
             onChangeText={onChangeName}
             className = "px-4 text-[30px]"
        />
         </View>

    <View className = "bg-orange-100 flex-col py-3">
        <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Description: </Text>
        <TextInput
              placeholder = "Enter description"
              value = {searchDesc}
              onChangeText={onChangeDesc}
              className = "px-4 text-[30px]"
        />
          </View>
    <CreateEventButton Name = {searchName} Owner = {"682d94e2d4a61bd5fda3a5e6"}  Date = {actualDate}
    Hour = {searchHour} Minute = {searchMinute} Description = {searchDesc}
    Group = {[]} Location = { () => navigation.navigate('BottomTabs', { screen: 'Calendar' })} />
    </ScrollView>
    </View>
    )
    }