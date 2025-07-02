import { TouchableOpacity, Image, Alert, Text, View, } from 'react-native';

export const ModSelector = ({selected, select, events, types}) => (
      <View>
          {types.map(type => (
            <View >
              <View className="border-orange-600 border-4 py-3 px-2 bg-orange-500">
                <Text className="px-1 py-1 font-bold text-3xl">{type}</Text>
              </View>

              {events
                .filter(event => event.lessonType === type)
                .map(event => (
                    <TouchableOpacity
                    className="flex-1 rounded-xl border-4 border-orange-500 flex-row py-3 px-2 bg-orange-400"
                    onPress = {() => select(event)}>
                    <View className="flex-col w-5/6">
                      <Text className="font-bold text-2xl">
                        {event.lessonType} ({event.classNo})
                      </Text>
                      <Text className="pt-1 font-bold text-2xl">{event.venue}</Text>
                      <Text className="font-bold text-xl">{event.day}</Text>
                      <Text className="text-xl">Start time: {event.startTime}</Text>
                      <Text className="text-xl">End time: {event.endTime}</Text>
                    </View>
                    {selected[0] === "hide" ? null : selected.some(ev => ev.lessonType == event.lessonType && ev.classNo == event.classNo)
                        ? (
                    <View className="items-center justify-center flex-1">
                      <Image source={require("../assets/selected.png")} />
                    </View>
                    ) : (
                        <View className="items-center justify-center flex-1">
                        <Image source={require("../assets/notSelected.png")} />
                        </View>)}
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </View>
        );