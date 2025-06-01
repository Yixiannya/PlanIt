import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { sendEvent } from '../Data/sendEvent';
import { useUserStore } from '../Data/userStore';

const CreateEventButton = ({ Name, Date, Hour, Minute, Description, Group, Location }) => {
    const user = useUserStore((state) => state.user);
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
            owner: user._id,
            dueDate: `${Date}T${Hour}:${Minute}:00.000Z`,
            description: Description,
            group: Group,
        };
        try {
            await sendEvent(Event);
            Alert.alert('Success', 'Event created!',
            [ { text: 'OK', onPress: () => Location() }, ],
            { cancelable: false },
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create event');
            console.error('Error:', error);
        }
    }

    return (
        <TouchableOpacity onPress = {iconPressed}>
        <View className = "h-64 bg-orange-50 flex-col justify-center items-center">
            <Text className = "pb-5 text-4xl text-gray-800 font-bold"> Add new event </Text>
        </View>
         </TouchableOpacity>
    );
};

export default CreateEventButton;