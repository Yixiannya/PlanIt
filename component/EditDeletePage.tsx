import { ScrollView, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteEvent } from '../Data/deleteEvent';
import Header from '../REUSABLES/HeaderBanner';
import { useEffect, useState } from 'react';
import { useUserStore } from '../Data/userStore';

export default function EditDeletePage({ route }) {
  const navigation = useNavigation();
  const {event, location, allEvents} = route.params;
  const [ohmyAdmins, setAdmins] = useState(true);
  const [Group, setGroup] = useState('')
  const [loading, setLoading] = useState(true);
  const myuser = useUserStore((state) => state.user);
  const [wait, setWait] = useState(false);

 useEffect(() => {
   if (event.group !== undefined) {
     async function fetchEvents() {
       setLoading(true);
       const replace = event.groupName;
       setGroup(replace);
       setAdmins(replace.admins.length === 0 || replace.admins.some(admin => admin === myuser._id));
       setLoading(false);
     }
     fetchEvents();
   } else {
       setLoading(false);
       }
 }, []);

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
    <View className="flex-1 justify-center bg-orange-500">
      <Header word={`Event:`} image={require('../assets/Close.png')} onPress={() => navigation.pop()} />
      <ScrollView>
        <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
          <Text className="text-4xl font-bold px-3 py-2">Name: </Text>
          <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
            {event.name}
          </Text>
        </View>
        {event.group !== undefined && (
          <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
            <Text className="text-4xl font-bold px-3 py-2">Group: </Text>
            <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
              {Group.name}
            </Text>
          </View>
        )}
        {(event.description !== undefined && event.description !== "") && (
        <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
          <Text className="text-4xl font-bold px-3 py-2">Description: </Text>
          <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
            {event.description}
          </Text>
        </View>)}
        <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
          <Text className="text-4xl font-bold px-3 py-2">Start Time: </Text>
          <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
            {event.dueDate.split('T')[0].split('-')[2]}/
            {event.dueDate.split('T')[0].split('-')[1]}/
            {event.dueDate.split('T')[0].split('-')[0]},{" "}
            {event.dueDate.split('T')[1].split('.')[0]}
          </Text>
        </View>
        <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
          <Text className="text-4xl font-bold px-3 py-2">End Time: </Text>
          <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
            {event.endDate.split('T')[0].split('-')[2]}/
            {event.endDate.split('T')[0].split('-')[1]}/
            {event.endDate.split('T')[0].split('-')[0]},{" "}
            {event.endDate.split('T')[1].split('.')[0]}
          </Text>
        </View>
        {event.venue !== undefined && event.venue !== "" && (
          <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
            <Text className="text-4xl font-bold px-3 py-2">Venue: </Text>
            <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
              {event.venue}
            </Text>
          </View>
        )}
        {useUserStore.getState().user.notificationsEnabled !== false && (
          <View className="rounded-2xl border-4 border-orange-500 bg-orange-400 py-4 pb-8 w-full">
            <Text className="text-4xl font-bold px-3 py-2">Notification sends: </Text>
            {event.offsetMs == 0 ? (
                <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
                  When event starts
                </Text>) :
             event.offsetMs < 3600000 ? (
                <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
                  {event.offsetMs / 60 / 1000} minutes before event starts
                </Text>
             ) : (
                 <Text className="bg-orange-300 w-full rounded-2xl border-orange-400 border-2 text-4xl font-bold px-3 py-4">
                   {event.offsetMs / 60 / 1000 / 60} hour{event.offsetMs / 1000 / 60 / 60 !== 1 ? 's' : ''} before event starts
                 </Text>
             )}
          </View>
        )}
        <View className="py-20 items-center justify-center w-full px-3 pt-2 flex-row flex-1 h-[30%]">
          <View className="bg-orange-400 rounded-2xl border-orange-500 border-4 py-4 px-10">
            <TouchableOpacity
              onPress={() => {
                if (ohmyAdmins && !loading) {
                    if (!wait) {
                        setWait(true);
                      navigation.replace('EditEventPage', { event, location, allEvents});
                      setTimeout(() => setWait(false), 3000);
                      }
                } else {
                  Alert.alert("Not an admin", "You are not an admin in this group");
                }
              }}
              className="items-center justify-center"
            >
              <Image className="w-32 h-32" source={require('../assets/edit.png')} />
              <Text className="pt-1 text-[27px] font-bold text-3xl">Edit data</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-orange-400 rounded-2xl border-orange-500 border-4 py-4 pt-5 px-7">
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                Alert.alert(
                  'Delete Event',
                  'Are you sure you want to delete this event?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                          if (ohmyAdmins && !loading) {
                              handleDelete(event._id);
                          } else {
                              Alert.alert("Not an admin", "You are not an admin in this group");
                          }
                      }
                    },
                    { text: 'No' },
                  ],
                );
              }}
            >
              <Image className="w-32 h-32" source={require('../assets/delete.png')} />
              <Text className="font-bold text-3xl">Delete data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}