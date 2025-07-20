import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Alert, Text, View, ScrollView} from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import {ModSelector} from '../REUSABLES/ModSelector';
import { useNavigation } from '@react-navigation/native';
import {getModSchedule} from '../Data/getModSchedule';
import {DeleteModButton} from '../REUSABLES/deleteModButton'
import { useUserStore } from '../Data/userStore';
import {updateMod} from '../Data/updateMod';
import {sendUserMod} from '../Data/sendUserMod';
import {deleteClass} from '../Data/deleteClass';

export function sorter(array) {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
     return array.sort((a, b) =>
        a.day !== b.day
          ? dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          : a.startTime.localeCompare(b.startTime)
      );
    }

export const prepare = (classes, mod, id) => {
  return classes.map(aclass => ({
    moduleCode: mod.moduleCode,
    lessonType: aclass.lessonType,
    classNo: aclass.classNo,
    description: mod.description,
    year: mod.year,
    semester: mod.semester,
    day: aclass.day,
    startDate: mod.startDate,
    startTime: aclass.startTime,
    endTime: aclass.endTime,
    weeks: aclass.weeks,
    userId: id,
    venue: aclass.venue
  }));
};

export const prepare2 = (modclass, id) => {
    return modclass.map(indiv =>({
        userId: id,
        lessonType: indiv.lessonType,
        classNo: indiv.classNo,
        startTime: indiv.startTime,
        endTime: indiv.endTime,
        day: indiv.day
    }));
};

export default function ConfigureMods({route}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [previous, setPrevious] = useState([]);
  const navigation = useNavigation();
  const {event, myevents} = route.params;

  const sendClasses = async () => {
      const mymods = prepare(selected, event, useUserStore.getState().user._id,);
      console.log(mymods);
      try {
          setLoading(true);
            Alert.alert('Mod editing in process...', 'Please be patient');
           await handleClassDelete();
           await Promise.all(
              mymods.map(async (mod) => {
                await sendUserMod(mod);
              })
            );
            await updateMod(event._id, {
              userId: useUserStore.getState().user._id,
            });
          Alert.alert("Classes have been configured!");
          setLoading(false);
          navigation.pop();
          if (navigation.canGoBack()) {
            navigation.pop();
          }
      } catch (error) {
         Alert.alert("Error", "Something went wrong")
         console.log(error);
      }
   };

   const handleClassDelete = async () => {
         const removal = previous.filter(x =>
           !selected.some(y =>
             y.lessonType === x.lessonType && y.classNo === x.classNo
           )
         );
          const mods = prepare2(removal, useUserStore.getState().user._id)
          console.log("This is mods", mods);
         try {
             setLoading(true);
          for (const mod of mods) {
            await deleteClass(event._id, mod);
          }
         } catch (error) {
           console.log("Is it me", error);
           setLoading(false);
           Alert.alert("Error", "Something went wrong");
         }
     };

  useEffect(() => {
    async function fetchEvents() {
        try {
          console.log(event.startDate)
          const mod = await getModSchedule(event.year, event.moduleCode);
          const modevents = mod.semesterData[event.semester - 1].timetable;
          setEvents(sorter(modevents));
          const classTypes = [...new Set(modevents.map(event => event.lessonType))];
          setTypes(classTypes);
          setSelected(selected.concat(myevents));
          setPrevious(previous.concat(myevents));
          setLoading(false);
         } catch (e) {
            setLoading(false);
            Alert.alert("This mod is invalid in NUSMods server",
                "Please delete it as soon as possible")
             }
    }
    fetchEvents();
  }, []);

  const select = (item) => {
      if (selected.some(ev => ev.lessonType == item.lessonType && ev.classNo == item.classNo
          )) {
           setSelected(selected.filter(ev => !(ev.lessonType === item.lessonType && ev.classNo === item.classNo)))
      } else {
          setSelected(selected.concat(
              events.filter(ev => ev.lessonType == item.lessonType && ev.classNo == item.classNo)))
      }
  }

  return (
    <View className="flex-1 bg-orange-600">
      <Header word="Choose your classes" image={require("../assets/Close.png")}
        onPress={() => navigation.pop()} />
      {loading ? (
        <View className="flex-1 items-center justify-center py-2 px-2 bg-orange-400">
          <Text className="text-center px-10 pb-5 font-bold text-4xl">Loading, do not leave this page...</Text>
        </View>
      ) : (
          <ScrollView>
        <ModSelector selected = {selected} select = {select} events = {events} types = {types}/>
        <View className = "bg-orange-600">
        <TouchableOpacity
        className = "rounded-2xl border-2 border-orange-600 items-center justify-center bg-orange-500 py-10"
        onPress= {() => sendClasses()}
        >
        <Image className="w-32 h-32 " source={require('../assets/edit.png')} />
        <Text className = "font-bold text-3xl"> Add classes </Text>
        </TouchableOpacity>
        </View>
        <DeleteModButton event = {event} setLoading = {setLoading}/>
        </ScrollView>
      )}
    </View>
  );
}