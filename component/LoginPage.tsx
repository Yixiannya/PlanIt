import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { editEvent } from '../Data/editEvent';
import { useNavigation } from '@react-navigation/native';

export default function LoginPage() {
    const iconPressed = async () => {
            try {
                Alert.alert('Success', 'Logged in!',
                [ { text: 'OK', onPress: () => navigation.replace('BottomTabs', { screen: 'Main-page' }) }, ],
                { cancelable: false },
                );
            } catch (error) {
                Alert.alert('Error', 'Failed to create event');
                console.error('Error:', error);
            }
        }
    const navigation = useNavigation();
    return (
            <View className = "flex-col flex-1 items-center justify-center bg-orange-500">
                <Image className = "w-[300px] h-[300px]" source={require('../assets/PlanIt.png')}/>
                <Text className = "text-center text-[100px] text-white font-bold pr-10"> Plan It</Text>
                <Text className = "text-center text-[30px]
                text-white pr-5 pt-1 py-1"> A smart scheduling app made just for students
                </Text>
                <View className = "py-5">
                <TouchableOpacity onPress = {iconPressed}>
                <Text className = "pl-1 px-3 py-3 text-3xl font-bold
                border border-black rounded border-2 bg-orange-400"> Login with Google</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
}