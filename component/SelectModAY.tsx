import { useEffect, useState } from 'react';
import { Alert, Image, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';

export default function SelectModAY() {
    const navigation = useNavigation();
    const today =  new Date().getFullYear();
    const [AY, setAY] = useState('');
    const [sem, setSem] = useState('');

    return (
        <View className = "flex-1 bg-orange-300">
            <Header word="Select AY/Semester"
                 image={require('../assets/Close.png')}
            onPress={() => navigation.pop()}
            />
            <ScrollView>
            <Text className = "mb-4 py-5 px-3 bg-orange-400 text-4xl font-bold">
            Academic Year (AY) </Text>

            <View className = "flex-row items-center justify-center">

                <TouchableOpacity className = "flex-1 justify-center items-center"
                    onPress = {() => setAY(`${today - 1}-${today}`)}>
                    <Text className = {`text-3xl font-bold rounded-3xl bg-orange-400 px-5 py-8
                      ${AY === `${today - 1}-${today}` ? 'border-2 border-orange-700' : ''}`}>
                    {today - 1} /{" "}{today}</Text>
                </TouchableOpacity>

                <TouchableOpacity className = "flex-1 justify-center items-center"
                    onPress = {() => setAY(`${today}-${today + 1}`)}>
                     <Text className = {`text-3xl font-bold rounded-3xl bg-orange-400 px-5 py-8
                         ${AY === `${today}-${today + 1}` ? 'border-2 border-orange-700' : ''}`}>
                    {today} / {today + 1}</Text>
                </TouchableOpacity>
            </View>

            <Text className = "mt-4 mb-4 py-5 px-3 bg-orange-400 text-4xl font-bold">
            Semester </Text>

            <View className = "py-4 flex-row items-center justify-center">
                <TouchableOpacity className = "flex-1 items-center justify-center"
                onPress = {() => setSem("1")}>
                <Text className = {`w-48 text-center text-3xl font-bold rounded-3xl bg-orange-400 px-5 py-8
                       ${sem == "1" ? 'border-2 border-orange-700' : ''}`}>
                  Semester 1</Text>
                </TouchableOpacity>

                <TouchableOpacity className = "flex-1 items-center justify-center"
                onPress = {() => setSem("2")}>
                   <Text className = {`w-48 text-center text-3xl font-bold rounded-3xl bg-orange-400 px-5 py-8
                       ${sem == "2" ? 'border-2 border-orange-700' : ''}`}>
                   Semester 2</Text>
               </TouchableOpacity>
            </View>

            <View className = "py-4 flex-row items-center justify-center">
                <TouchableOpacity className = "flex-1 items-center justify-center"
                onPress = {() => setSem("3")}>
                    <Text className = {`w-48 text-center text-3xl font-bold rounded-3xl bg-orange-400 px-8 py-8
                        ${sem == "3" ? 'border-2 border-orange-700' : ''}`}>
                    Special Term 1</Text>
                </TouchableOpacity>

                <TouchableOpacity className = "flex-1 items-center justify-center"
                onPress = {() => setSem("4")}>
                    <Text className = {`w-48 text-center text-3xl font-bold rounded-3xl bg-orange-400 px-8 py-8
                        ${sem == "4" ? 'border-2 border-orange-700' : ''}`}>
                    Special Term 2</Text>
                </TouchableOpacity>
            </View>
        <TouchableOpacity className = "mt-8 flex-1 bg-orange-400 py-20 item-end justify-center"
        onPress={() => {
          if (AY == "" || sem == "") {
            Alert.alert('Please choose an Academic year and a Semester')
          } else {
            navigation.navigate("SearchModToAdd", {year: AY, sem})
          }
        }}>
            <Text className = "mr-1 mb-10 text-center text-5xl font-bold text-center"> Next </Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
        )
}