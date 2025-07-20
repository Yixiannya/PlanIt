import { useRef, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import {getMod} from '../Data/getMod';
import DateSelector from '../REUSABLES/DateSelector'
import {SendModButton} from '../REUSABLES/SendModButton'
import {getUserMod} from '../Data/getUserMod'

import { useUserStore } from '../Data/userStore';

export default function SearchModToAdd({route}) {
    const navigation = useNavigation();

    const access = useRef(null);
    const [allMods, setAllMods] = useState([]);
    const [searchDisplay, setSearchDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchMods, setSearchMods] = useState('');
    const [selectedMods, setSelectedMods] = useState([]);
    const [actualDate, setActualDate] = useState([]);
    const myuser = useUserStore((state) => state.user);
    const [openTable, setopenTable] = useState(false);
    const {year, sem} = route.params;

    useEffect(() => {
            async function loadAllMods() {
                try {
                    setLoading(true);
                    const mod = await getMod(`${year}`);
                    const mymods = await getUserMod(myuser._id);
                    const simple = mymods.map(x => x.moduleCode);
                    const filtermods = mod
                      .filter(x => x.semesters.some(y => y == sem))
                      .filter(y => !simple.includes(y.moduleCode));
                    setAllMods(filtermods);
                    setLoading(false);
                } catch (error) {
                      Alert.alert('Notice', 'This AY does not have any information yet, come back later');
                      setLoading(false);
            }}
            loadAllMods();
    }, []);


    const Item = ({ item }) => (
        <View className="flex-1 items-center justify-center m-2 p-5 bg-orange-400 rounded-2xl">
          <TouchableOpacity
          onPress = { () =>
              {
           select(item);
           }
          }>
            <Text className="text-xl font-bold">{item.moduleCode}</Text>
          </TouchableOpacity>
        </View>
      );

    const search = () => {
        if (searchMods.length < 2) {
            Alert.alert("Warning", "The system may be laggy due to an abundance of mods, narrow your search if you wish to avoid this")
        }
        if (allMods.filter(mod =>
            mod.moduleCode.toLowerCase().startsWith(searchMods.toLowerCase())).length === 0) {
             Alert.alert('Error', 'No such mod')
        } else {
            setSearchDisplay(
                    searchMods === ""
                      ? []
                      : allMods.filter(mod =>
                          mod.moduleCode.toLowerCase().startsWith(searchMods.toLowerCase()))
            );
        }
    };

     const select = async (mod) => {
         setLoading(true);
         setSelectedMods (
            [...selectedMods, mod]
         );
        setSearchDisplay(searchDisplay.filter(mods => mods.moduleCode !== mod.moduleCode));
        setAllMods(allMods.filter(mods => mods.moduleCode !== mod.moduleCode));
        await new Promise(resolve => setTimeout(resolve, 400));
        setLoading(false);
     };

    return (
    <View className="flex-1 bg-orange-300">
          <Header word="Add a new mod"
                image={require('../assets/Close.png')}
                onPress={() => navigation.pop()}
          />
          <ScrollView>
          { sem >= 3 &&
          <View className = "bg-orange-500">
          <TouchableOpacity onPress = {() => setopenTable(!openTable)}>
          <View className = "border-2 border-orange-500 flex-row items-center bg-orange-400">
              <Text className = "text-[25px] text-gray-800 font-bold"> Select start of academic year </Text>
              {!openTable ?
                <Image source= { require('../assets/arrowdown.png' ) } />
              :
              <Image source= { require('../assets/arrowup.png' ) } />}
          </View>
          </TouchableOpacity>
          </View>}
          {openTable && <DateSelector actualDate={actualDate} setActualDate={setActualDate} />}
           <View className = "bg-orange-400 items-center flex-row">
                <View className = "flex-1 w-5/6 flex-row">
                  <Text className = "pt-5 text-3xl text-gray-800 font-bold"> Code: </Text>
                  <TouchableOpacity onPress={() => access.focus()} className = "flex-1">
                  <TextInput
                       ref = {access}
                       placeholder = "Search a mod"
                       value = {searchMods}
                       onChangeText={text => setSearchMods(text)}
                       className = "pt-4 text-[28px]"
                  />
                  </TouchableOpacity>
                </View>
                 <TouchableOpacity onPress = {() => search()}>
                 <Image source = {require('../assets/search.png')} />
                 </TouchableOpacity>
           </View>
                 { loading ? (
                     <View className = "flex-1 items-center justify-center">
                     <Text className = "py-20 text-3xl font-bold"> Loading mods...</Text>
                     </View>
                 ): searchDisplay.length == 0 ? (
                     <View className = "flex-1 items-center justify-center">
                      <Text className = "mr-1 py-20 px-16 text-center text-3xl font-bold">Enter a module's code and press the search icon to find a mod! </Text>
                      </View>
                     ):(
                     <View className="flex-1 pt-3 px-4">
                        <FlatList
                        data={searchDisplay}
                        numColumns={3}
                        renderItem={Item}
                        keyExtractor={(item) => item.moduleCode}
                        />
                </View>
                 )}
             </ScrollView>
             <View className = "justify-center bg-orange-500 flex-row">
                <Text className = "px-2 py-2 text-2xl font-bold"> Added Mods </Text>
             </View>
             <View className="items-center bg-orange-400 flex-row h-20">
                <ScrollView horizontal className=" bg-orange-400">
                    {selectedMods.map((event) => (
                    <TouchableOpacity
                              onPress = { async () =>
                                  {
                                      setLoading(true);
                               setSelectedMods(selectedMods.filter(mod => mod !== event));
                               if (event.moduleCode.toLowerCase().startsWith(searchMods.toLowerCase())) {
                                     setSearchDisplay([...searchDisplay, event]
                                         .sort((x, y) => x.moduleCode.localeCompare(y.moduleCode)));
                               }
                               setAllMods([...allMods, event].sort());
                               await new Promise(resolve => setTimeout(resolve, 400));
                               setLoading(false);
                               }
                              }>
                    <View className="rounded-xl flex-col px-3 py-3">
                        <Text className="rounded-xl px-3 py-3 bg-orange-300 font-bold text-2xl">{event.moduleCode}</Text>
                    </View>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
           </View>
           <SendModButton mods = {selectedMods} year = {year} semester = {sem} startDate = {sem < 3 ? "2003-03-08T00:00:00.000Z" : actualDate} />
    </View>
    )
}