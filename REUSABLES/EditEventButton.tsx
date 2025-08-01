import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { editEvent } from '../Data/editEvent';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const EditEventButton = ({ ID, Name, Date, Hour, Minute, endDate, endHour, endMinute, allEvents, Group,
    Description, Location, venue, offsetMs }) => {
    const [checked, setChecked] = useState(false);
    const navigation = useNavigation();
   console.log({ Name, Date, Hour, Minute, endDate, endHour, endMinute });
    const iconPressed = async () => {
        if (!Name?.trim() || Date == undefined || !Hour?.trim() || !Minute?.trim()
         || endDate == undefined || !endHour?.trim() || !endMinute?.trim()
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
                           `Note: This time clashes with one of your ${Group ? "group member's " : ""}events`,
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
                venue: venue,
                offsetMs: offsetMs
            };
            try {
                Alert.alert('Event editing in process...')
                await editEvent(ID, Event);
                Alert.alert('Success', 'Event edited!',
                [ { text: 'OK',
                    onPress: () => {
                          if (Location === "AUTO") {
                            navigation.pop(2);
                          } else {
                            Location();
                          }},} ],
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
        <View className = "h-64 bg-orange-500 flex-col justify-center items-center">
            <Text className = "pb-5 text-4xl text-gray-800 font-bold"> Edit event </Text>
        </View>
         </TouchableOpacity>
    );
};

export default EditEventButton;