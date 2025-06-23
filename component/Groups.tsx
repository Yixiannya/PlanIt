import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Header from '../REUSABLES/HeaderBanner';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useGroupStore } from '../Data/groupStore';

export default function Groups({route}) {
  const navigation = useNavigation();
  const {loading, Groups} = route.params;
  const setGroup = useGroupStore((state) => state.setGroup);

  const Item = ({ item }) => (
      <TouchableOpacity
      className = "flex-1 m-2 p-5 bg-orange-400 rounded-2xl items-center justify-center"
      onPress = { () => {
          setGroup(item);
        navigation.navigate('GroupTabs', {
          screen: 'Group Info',
        });
      }}>
        <Text className="text-xl font-bold">{item.name}</Text>
      </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-orange-300">
      <Header word="Your Groups"
            image={require('../assets/Close.png')}
            onPress={() => navigation.pop()}
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl">Too fast, go back!</Text>
        </View>
      ) : (
          <View className="flex-1 pt-3 px-4">
            <FlatList
              data={Groups}
              numColumns={3}
              renderItem={Item}
              keyExtractor={(item) => item._id}
            />
            <TouchableOpacity onPress = {() => navigation.navigate('NewGroup')}>
            <View className = "mb-28 mt-10 justify-center items-center">
                <Text className = "rounded-xl bg-orange-500 px-5 py-5 text-2xl font-bold"> Create a Group </Text>
            </View>
            </TouchableOpacity>
          </View>
      )}
    </View>
  );
}