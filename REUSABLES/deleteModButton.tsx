import { useUserStore } from '../Data/userStore';
import {deleteUserMod} from '../Data/deleteUserMod';
import { TouchableOpacity, Alert, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const DeleteModButton = ({event}) => {
    const navigation = useNavigation();
    const user = useUserStore((state) => state.user);
    const handleDelete = async () => {
        try {
            console.log(event._id)
          await deleteUserMod(event._id, user._id);
          Alert.alert("Success", "Mod deleted!");
          navigation.pop();
        } catch (error) {
          console.log(error);
          Alert.alert("Error", "Something went wrong");
        }
      };

  return (
      <TouchableOpacity onPress={() => {
                Alert.alert(
                  'Delete Mod',
                  'Are you sure you want to delete this mod?',
                  [{ text: 'No'},
                    {text: 'Yes',
                      onPress: () => handleDelete()},
                  ],
                );
              }}>
              <View className = "py-16 rounded-2xl border-2 border-orange-700 flex-1 items-center justify-center bg-orange-500">
                  <Text className = "mb-8 font-bold text-4xl text-red-700"> Delete Mod </Text>
              </View>
              </TouchableOpacity>
      );
  }