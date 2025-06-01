import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { editEvent } from '../Data/editEvent';

const EditEventButton = ({ ID, Name, Date, Hour, Minute, Description, Group, Location }) => {
    const iconPressed = async () => {
        if (!Name?.trim() || !Date?.trim() || !Hour?.trim() || !Minute?.trim()) {
        Alert.alert(
           'Insufficient information',
           'Please fill up the required info',
        );
        return;
        }
        const Event = {
            name: Name,
            dueDate: `${Date}T${Hour}:${Minute}:00.000Z`,
            description: Description,
            groups: Group,
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

    return (
        <TouchableOpacity onPress = {iconPressed}>
        <View className = "h-64 bg-orange-50 flex-col justify-center items-center">
            <Text className = "pb-5 text-4xl text-gray-800 font-bold"> Edit event </Text>
        </View>
         </TouchableOpacity>
    );
};

export default EditEventButton;