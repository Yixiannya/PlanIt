import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {deleteEvent} from '../Data/deleteEvent';
import Header from '../REUSABLES/HeaderBanner';


export default function EditDeletePage ({ route }) {
    const navigation = useNavigation();
    const {event, location} = route.params;
    const handleDelete = async (id) => {
        try {
            await deleteEvent(id);
            Alert.alert('Deleted successfully');;
            location();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete event');
            console.error('Error:', error);
        }
    }

    return (
        <View className= " flex-col flex-1 items-start justify-center bg-orange-300">
        <Header word = {`Event: ${event.name}`} image = {require('../assets/Close.png')}
                            onPress = {() => navigation.pop()} />
        <View className = "px-3 pt-3">
        <Text className = "py-3 text-4xl text-gray-800 font-bold">Name: {event.name}</Text>
        <Text className = "py-3 text-4xl text-gray-800 font-bold">Description: {event.description}</Text>
        <Text className = "py-3 text-4xl text-gray-800 font-bold">Time: {event.dueDate}</Text>
        </View>
        <View className="px-3 pt-3 flex-row flex-1 h-[30%]">
            <TouchableOpacity onPress = {() => navigation.replace('EditEventPage', {event, location} )}
            className="mr-4 items-center">
            <Image className = "w-32 h-32" source={require('../assets/edit.png')} />
            <Text className = "font-bold text-2xl">Edit data</Text>
        </TouchableOpacity>

        <TouchableOpacity
        className = "items-center"
        onPress = {() => {
            Alert.alert(
              'Delete Event',
              'Are you sure you want to delete this event?',
              [{  text: 'Yes',
                  onPress: () =>
                  {handleDelete(event._id);},
               },
               { text: 'No',},
              ],
            );
        }
        }>
             <Image className = "w-32 h-32" source={require('../assets/delete.png')} />
             <Text className = "font-bold text-2xl">Delete data</Text>
        </TouchableOpacity>
        </View>
        </View>
    );
};


