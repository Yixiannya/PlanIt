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
export default function ConfigureMods({route}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();
  const {event, myevents} = route.params;

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const mod = await getModSchedule(event.year, event.moduleCode);
      const modevents = mod.semesterData[event.semester - 1].timetable;
      setEvents(sorter(modevents));
      const classTypes = [...new Set(modevents.map(event => event.lessonType))];
      setTypes(classTypes);
      setSelected(selected.concat(myevents));
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const select = (item) => {
      if (selected.some(ev => ev.lessonType == item.lessonType && ev.classNo == item.classNo)) {
          setSelected(selected.filter(ev => ev.lessonType != item.lessonType && ev.classNo != item.classNo))
      } else {
          setSelected(selected.concat(item))
      }
  }

  return (
    <View className="flex-1 bg-orange-600">
      <Header word="Choose your classes" image={require("../assets/Close.png")}
        onPress={() => navigation.pop()} />
      {loading ? (
        <View className="flex-1 items-center justify-center py-2 px-2 bg-orange-400">
          <Text className="font-bold text-4xl">Loading</Text>
        </View>
      ) : (
          <ScrollView>
        <ModSelector selected = {selected} select = {select} events = {events} types = {types}/>
        <TouchableOpacity
        className = "rounded-2xl border-2 border-orange-700 items-center justify-center bg-orange-500 py-10"
        >
        <Image className="w-32 h-32 " source={require('../assets/edit.png')} />
        <Text className = "font-bold text-3xl"> Add classes </Text>
        </TouchableOpacity>
        <DeleteModButton event = {event}/>
        </ScrollView>
      )}
    </View>
  );
}