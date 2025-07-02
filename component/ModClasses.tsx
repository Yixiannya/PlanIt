import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Alert, Text, View, ScrollView} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {ModSelector} from '../REUSABLES/ModSelector';
import { useNavigation } from '@react-navigation/native';
import {getModSchedule} from '../Data/getModSchedule';
import {DeleteModButton} from '../REUSABLES/deleteModButton'

export function sorter(array) {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
     return array.sort((a, b) =>
        a.day !== b.day
          ? dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          : a.startTime.localeCompare(b.startTime)
      );
    }
export default function ModClasses({route}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState(["hide"]);
  const navigation = useNavigation();
  const {event} = route.params;

  const temp = [
    { classNo: "01A", covidZone: "C", day: "Wednesday", endTime: "0900", lessonType: "Tutorial", size: 26, startTime: "0800", venue: "COM4SR33", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "E08", covidZone: "C", day: "Thursday", endTime: "1800", lessonType: "Laboratory", size: 15, startTime: "1600", venue: "AS6-0426", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "1", covidZone: "C", day: "Monday", endTime: "1800", lessonType: "Sectional Teaching", size: 380, startTime: "1600", venue: "LT8", weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "A06", covidZone: "C", day: "Thursday", endTime: "1000", lessonType: "Laboratory", size: 31, startTime: "0800", venue: "COM1-0120", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "E05", covidZone: "C", day: "Thursday", endTime: "1800", lessonType: "Laboratory", size: 15, startTime: "1600", venue: "COM1-B110", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "E06", covidZone: "C", day: "Thursday", endTime: "1800", lessonType: "Laboratory", size: 31, startTime: "1600", venue: "COM1-0120", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "03A", covidZone: "C", day: "Wednesday", endTime: "1100", lessonType: "Tutorial", size: 26, startTime: "1000", venue: "COM4SR33", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "C04", covidZone: "C", day: "Thursday", endTime: "1400", lessonType: "Laboratory", size: 15, startTime: "1200", venue: "COM1-B111", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { classNo: "B03", covidZone: "C", day: "Thursday", endTime: "1200", lessonType: "Laboratory", size: 15, startTime: "1000", venue: "COM1-B108", weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }
  ];


  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const modevents = temp;
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
          setSelected(selected.concat(item))
      }
  }

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
    <View className="flex-1 bg-orange-600">
      <Header word="Your classes" image={require("../assets/Close.png")}
        onPress={() => navigation.pop()} />
      {loading ? (
        <View className="flex-1 items-center justify-center py-2 px-2 bg-orange-400">
          <Text className="font-bold text-4xl">Loading</Text>
        </View>
      ) : (
          <ScrollView>
        <ModSelector selected = {selected} select = {select} events = {events} types = {types}/>
        <View className = "flex-row">
            {selected[0] === "hide"
                ? (
            <TouchableOpacity onPress = {() =>
                navigation.navigate("ConfigureMods", { year: event.year, code: event.code, sem: event.sem, myevents: temp})}
                className = " rounded-2xl border-2 border-orange-700 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/edit.png')} />
            <Text className = "font-bold text-3xl flex-1"> Edit classes </Text>
            </TouchableOpacity>
            ) : (

            <TouchableOpacity onPress = {() =>
                setSelected(["hide"])}
                className = "rounded-2xl border-2 border-orange-700 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/Close.png')} />
            <Text className = "font-bold text-3xl flex-1"> Cancel </Text>
            </TouchableOpacity>
                )}
            {selected[0] === "hide"
                ? (
            <TouchableOpacity onPress = {() =>
                setSelected([])}
                className = "rounded-2xl border-2 border-orange-700 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
                >
            <Image className="w-32 h-32 " source={require('../assets/delete.png')} />
            <Text className = "font-bold text-3xl flex-1"> Delete classes </Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity
                className = "rounded-2xl border-2 border-orange-700 flex-1 items-center justify-center bg-orange-500 pt-5 pb-10"
            >
            <Image className="w-32 h-32 " source={require('../assets/delete.png')} />
            <Text className = "font-bold text-3xl flex-1"> Confirm delete </Text>
            </TouchableOpacity>
                )}
        </View>
        <DeleteModButton event = {event}/>
        </ScrollView>
      )}
    </View>
  );
}