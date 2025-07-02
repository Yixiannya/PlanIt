import { Alert, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {usePushNotifications} from  '../Data/usePushNotifications'

export default function SelectModAY() {
    const navigation = useNavigation();
    const today =  new Date().getFullYear();
    const [AY, setAY] = useState('');
    const [sem, setSem] = useState('');

    return (
        <View className = "flex-1 bg-orange-300">
            <Header word="Select AY/Semester"
                 image={require('../assets/Close.png')}
            onPress={() => navigation.pop()}
            />
            <TouchableOpacity onPress = {() => usePushNotifications(true)}>
            <Text> Activate notifs </Text>
            </TouchableOpacity>
    </View>
    )
}