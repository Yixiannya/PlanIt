import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { sendEvent } from '../Data/sendEvent';

export default function EditDeletePage = ({ ID, Name, Owner, Time, Description, Group, Location }) => {
        return (
            <View className="flex-col flex-1">
              <Text>Name: {Name}</Text>
              <Text>Description: {Description}</Text>
              <Text>Time: {Time}</Text>

              <View className="flex-row flex-1 h-[50%]">
                <TouchableOpacity onPress={onEdit} className="mr-4">
                  <Image source={require('../assets/edit.png')} />
                  <Text>Edit data</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete}>
                  <Image source={require('../assets/delete.png')} />
                  <Text>Delete data</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        };


