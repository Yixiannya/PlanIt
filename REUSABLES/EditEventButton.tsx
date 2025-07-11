import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { editEvent } from '../Data/editEvent';
import { useEffect, useState } from 'react';

const EditEventButton = ({ ID, Name, Date, Hour, Minute, endDate, endHour, endMinute, allEvents,
    Description, Location }) => {
    const [checked, setChecked] = useState(false);
    const iconPressed = async () => {
        if (!Name?.trim() || !Date?.trim() || !Hour?.trim() || !Minute?.trim()
            || !endDate?.trim() || !endHour?.trim() || !endMinute?.trim()
        ) {
        Alert.alert(
           'Insufficient information',
           'Please fill up the required info',
        );
        } else if (`${Date}T${Hour}:${Minute}:00.000Z` > `${endDate}T${endHour}:${endMinute}:00.000Z`) {
            Alert.alert(
            'End time is before start time',
            'Please pick a valid end and start time',
        );
       } else if ((allEvents.some(([start, end]) =>
                                     start <= `${Date}T${Hour}:${Minute}:00.000Z`
                                      && end >= `${Date}T${Hour}:${Minute}:00.000Z`
                                      ||
                                      start <= `${endDate}T${endHour}:${endMinute}:00.000Z`
                                      && end >= `${endDate}T${endHour}:${endMinute}:00.000Z`
                      )) && !checked) {
                         Alert.alert(
                           "Note: This time clashes with one of your events",
                           "Press edit event again if this is intended",
                           [
                             { text: "Ok", onPress: () => setChecked(true) }
                           ]
                         );
        } else {
            const Event = {
                name: Name,
                dueDate: `${Date}T${Hour}:${Minute}:00.000Z`,
                description: Description,
                endDate: `${endDate}T${endHour}:${endMinute}:00.000Z`,
            };
            try {
                await editEvent(ID, Event);
                Alert.alert('Success', 'Event edited!',
                [ { text: 'OK', onPress: () => Location() }, ],
                { cancelable: false },
                );
            } catch (error) {
                Alert.alert('Error', 'Failed to edit event');
                console.error('Error:', error);
            }
        }
    }

    return (
        <TouchableOpacity onPress = {iconPressed}>
        <View className = "h-64 bg-orange-50 flex-col justify-center items-center">
            <Text className = "pb-5 text-4xl text-gray-800 font-bold"> Edit event </Text>
        </View>
         </TouchableOpacity>
    );
};

export default EditEventButton;