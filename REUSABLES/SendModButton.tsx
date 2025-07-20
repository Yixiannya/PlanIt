import { TouchableOpacity, Image, Alert, Text, View, } from 'react-native';
import { useEffect, useState } from 'react';
import {sendUserMod} from "../Data/sendUserMod"
import { useUserStore } from '../Data/userStore';
import { useNavigation } from '@react-navigation/native';

export const prepare = (startDate, input, year, semester, user) => {
   if (startDate.length === 0) {
       Alert.alert("Please choose the first day of school for your academic year",
           "Make sure this date is accurate as it will affect the schedule produced");
       throw new Error("Missing start date");
   } else if (input.length === 0) {
       Alert.alert("Please choose a mod to add");
       throw new Error("No mods");
   } else {
       return input.map(mod => ({
           moduleCode: mod.moduleCode,
           description: mod.title,
           year: year,
           semester: semester,
           startDate: startDate,
           isComplete: false,
           userId: user._id,
       }));
   }
};

export const SendModButton = ({mods, year, semester, startDate}) => {
    const [sendingMods, setSendingMods] = useState([]);
     const user = useUserStore((state) => state.user);
     const navigation = useNavigation();

     const sendAllMods = async (mods) => {
         let mymods;
         try {
         mymods = prepare(startDate, mods, year, semester, user)
         } catch (e) {
             return;
             console.log(e);
         }
        try {
            Alert.alert('Mod adding in process...')
            await Promise.all(
                mymods.map(mod => sendUserMod(mod))
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
        sendAllMods(mods);
        }}>
       <View className="py-8 bg-orange-500 justify-center items-center">
           <Text className="pb-14 text-2xl font-bold text-white">Add mods</Text>
       </View>
    </TouchableOpacity>
    );
}