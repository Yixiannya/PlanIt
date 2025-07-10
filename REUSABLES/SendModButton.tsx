import { TouchableOpacity, Image, Alert, Text, View, } from 'react-native';
import { useEffect, useState } from 'react';
import {sendUserMod} from "../Data/sendUserMod"
import { useUserStore } from '../Data/userStore';
import { useNavigation } from '@react-navigation/native';

export const SendModButton = ({mods, year, semester, startDate}) => {
    const [sendingMods, setSendingMods] = useState([]);
     const user = useUserStore((state) => state.user);
     const navigation = useNavigation();

    const prepare = (input) => {
        if (startDate.length === 0) {
            Alert.alert("Please choose a start date");
        } else if (input.length === 0) {
            Alert.alert("Please choose a mod to add");
        } else {
            sendAllMods(input.map(mod => ({
                moduleCode: mod.moduleCode,
                description: mod.title,
                year: year,
                semester: semester,
                startDate: startDate,
                isComplete: false,
                userId: user._id,
            })));
        }
    };

    const sendAllMods = async (mods) => {
        try {
            await Promise.all(
                mods.map(mod => sendUserMod(mod))
            );
            Alert.alert("Mods have been added!")
            navigation.pop();
            navigation.pop();
        } catch (error) {
           Alert.alert("Error", "Something went wrong")
           console.log(error);
        }
    };

    return (
    <TouchableOpacity onPress={() => {
        prepare(mods);
        }}>
       <View className="py-8 bg-orange-500 justify-center items-center">
           <Text className="pb-14 text-2xl font-bold text-white">Add mods</Text>
       </View>
    </TouchableOpacity>
    );
}