import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Alert, Text, View, ScrollView} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {ModSelector} from '../REUSABLES/ModSelector';
import { useNavigation } from '@react-navigation/native';
import {getModSchedule} from '../Data/getModSchedule';
import {DeleteModButton} from '../REUSABLES/deleteModButton'
import { useUserStore } from '../Data/userStore';
import {getClasses} from '../Data/getClasses';
import {deleteClass} from '../Data/deleteClass'
export function sorter(array) {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
     return array.sort((a, b) =>
        a.day !== b.day
          ? dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          : a.startTime.localeCompare(b.startTime)
      );
  }

export const prepare = (modclass, id) => {
    return modclass.map(indiv =>({
        userId: id,
        lessonType: indiv.lessonType,
        classNo: indiv.classNo,
        startTime: indiv.startTime,
        endTime: indiv.endTime,
        day: indiv.day
    }));
};

export default function ModClasses({route}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState(["hide"]);
  const navigation = useNavigation();
  const {event} = route.params;

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const modevents = await getClasses(event._id, {
          userId: useUserStore.getState().user._id,
      });
     console.log(modevents);
      setEvents(sorter(modevents));
      const classTypes = [...new Set(modevents.map(event => event.lessonType))];
      setTypes(classTypes);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const select = (item) => {
      if (selected.some(ev => ev.lessonType == item.lessonType && ev.classNo == item.classNo)) {
          setSelected(selected.filter(x => x !== item))
      } else {
         setSelected(selected.concat(
             events.filter(ev => ev.lessonType == item.lessonType && ev.classNo == item.classNo)))
      }
  }

  const handleDelete = async () => {
    try {
        console.log(event._id)
        Alert.alert('Mod deletion in process...', 'Please be patient');
      await deleteUserMod(event._id, useUserStore.getState().user._id);
      Alert.alert("Success", "Mod deleted!");
      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

   const handleClassDelete = async () => {
       const mods = prepare(selected, useUserStore.getState().user._id)
      console.log(event)
       console.log("This is mods", mods);
      try {
          Alert.alert('Class deletion in process...', 'Please be patient');
          setLoading(true);
       for (const mod of mods) {
         await deleteClass(event._id, mod);
       }
        Alert.alert("Success", "Classes deleted");
        setLoading(false);
        navigation.pop();
      } catch (error) {
        console.log(error);
        setLoading(false);
        Alert.alert("Error", "Something went wrong");
      }
    };

  return (
    <View className="flex-1 bg-orange-600">
      <Header word="Your classes" image={require("../assets/Close.png")}
        onPress={() => navigation.pop()} />
      {loading ? (
        <View className="flex-1 items-center justify-center py-2 px-5 bg-orange-400">
          <Text className="font-bold text-4xl text-center">Loading, please do not leave this page...</Text>
        </View>
      ) : (
          <ScrollView>
        <ModSelector selected = {selected} select = {select} events = {events} types = {types}/>
        <View className = "flex-row bg-orange-600">
            {selected[0] === "hide"
                ? (
            <TouchableOpacity onPress = {() =>
                navigation.navigate("ConfigureMods", { event: event, myevents: events})}
                className = " rounded-2xl border-2 border-orange-600 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/edit.png')} />
            <Text className = "font-bold text-3xl flex-1"> Edit classes </Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity onPress = {() =>
                setSelected(["hide"])}
                className = "rounded-2xl border-2 border-orange-600 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/Close.png')} />
            <Text className = "font-bold text-3xl flex-1"> Cancel </Text>
            </TouchableOpacity>
                )}
            {selected[0] === "hide"
                ? (
            <TouchableOpacity onPress = {() =>
                setSelected([])}
                className = "rounded-2xl border-2 border-orange-600 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/delete.png')} />
            <Text className = "font-bold text-3xl flex-1"> Delete classes </Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity
                className = "rounded-2xl border-2 border-orange-600 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                onPress = {() => handleClassDelete()}
            >
            <Image className="w-32 h-32 " source={require('../assets/delete.png')} />
            <Text className = "font-bold text-3xl flex-1"> Confirm delete </Text>
            </TouchableOpacity>
                )}
        </View>
        <DeleteModButton event = {event} setLoading = {setLoading}/>
        </ScrollView>
      )}
    </View>
  );
}