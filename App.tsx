import { useState } from 'react';
import "./global.css";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import GroupInfo from './classes';

type Group = {
    id: number;
    groupicon: Image;
    name: string;
    deadline: string;
    duedate: string;
}

export default function App() {
    return (
    <View className="flex-1 flex-col items-center">
    <Header />
    <Carousel />
    <CurrentGroupsHeader />
    <ClassReminder />
    </View>
  );
  }

  const Header = () => {
      const iconPressed = () => {
          console.log('Icon button pressed');
      };
  return (
      <View className="h-[11%] w-full flex-row items-center justify-between bg-orange-500 px-2 pt-10">
        <Text className="w-4/5 text-black text-[27px] font-bold pl-1">
          Your upcoming events
        </Text>
        <TouchableOpacity onPress={iconPressed}>
            <Image source={require('./assets/ICON.png')}/>
        </TouchableOpacity>
      </View>
  );
};
const Carousel = ({ group }: { group: Group }) => {
  return (
      <View className="h-56 w-full flex-row items-center justify-center bg-orange-500">
        <View className="mr-0.25 absolute w-full h-56 rounded-t-xl rounded-b-xl items-center bg-white z-0" />
            <ScrollView horizontal>
                <View className="flex-row justify-center item-center">
                {GroupInfo.map((page) => (
                    <View key={page.name} className="flex-column px-9">
                        <TouchableOpacity className="h-30 w-30 item-center">
                            <Image source={page.groupicon}/>
                        </TouchableOpacity>
                        <Text className="py-2 items-center font-bold text-2xl">{page.name}</Text>
                        <Text className="py-2 items-center">{page.duedate}</Text>
                    </View>
                ))}
                </View>
            </ScrollView>
      </View>
  );
};

const CurrentGroupsHeader = () => {
      const GroupDirect = () => {
          console.log('Group Direct button pressed');
      };
  return (
      <TouchableOpacity onPress={GroupDirect}>
      <View className="w-full h-18 flex-row items-center justify-between bg-orange-500 pb-2 pl-2">
        <Text className="text-black text-[20px] font-bold pl-1">
          Your Current Groups
        </Text>
        <Image className="ml-2 pt-1" source={require('./assets/Arrow.png')}/>
      </View>
      </TouchableOpacity>
  );
};

const ClassReminder = () => {
    return (
      <ScrollView>
    <View className="w-full flex-col items-center justify-center">
      {GroupInfo.map((group) => (
        <GroupComponent key={group.id} group={group} />
      ))}
    </View>
    </ScrollView>
  );
};

const menu = () => {
    return (
     <View className="w-full flex-row items-center justify-between bg-gray-500 pb-2 pl-2">
            <TouchableOpacity onPress={GroupDirect} className="ml-2 flex-1 pt-1">
                <Image source={require('./assets/Arrow.png')}/>
            </TouchableOpacity>
          </View>
  );
};

const GroupComponent = ({ group }: { group: Group }) => {
     const GroupIconPressed = () => {
              console.log('Group Icon button pressed');
          };
    return (
        <View className="w-full flex-row items-center justify-between bg-gray-300">
            <TouchableOpacity onPress={GroupIconPressed} className="h-20 w-20 items-center mt-2">
                <Image source={group.groupicon}/>
            </TouchableOpacity>

            <View className="w-full flex-col justify-center ml-2 flex-1 py-2" >
                <Text className="font-bold text-xl">{group.name}</Text>
                <Text>Due date: {group.deadline}</Text>
                <Text>Due date: {group.duedate}</Text>
            </View>

            <TouchableOpacity onPress={GroupIconPressed} className="h-20 w-20 items-center mt-2">
                <Image source={require('./assets/Arrow.png')}/>
            </TouchableOpacity>
        </View>
    );
}


