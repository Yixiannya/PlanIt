import { Text, View, TextInput} from 'react-native';

const TimeSelector = ({ searchHour, searchMinute, setSearchMinute,
                        setSearchHour,onChangeHour, onChangeMinute, onBlurPad  }) => {
    return (
    <View className = "bg-orange-300 py-2">
           <Text className = "px-1 pt-2 text-4xl text-gray-800 font-bold"> Time: </Text>
           <View className = "flex-row pb-3">
           <TextInput
               placeholder = "(HH)"
               value = {searchHour}
               onChangeText={onChangeHour}
               onBlur={() => onBlurPad(setSearchHour, searchHour)}
               maxLength={2}
               className = "pl-6 text-[50px] font-bold"
               />
           <Text className = "text-[50px] font-bold py-2"> : </Text>
           <TextInput
               placeholder = "(MM)"
               value = {searchMinute}
               onChangeText={onChangeMinute}
               onBlur={() => onBlurPad(setSearchMinute, searchMinute)}
               maxLength={2}
               className = "text-[50px] font-bold"
           />
           </View>
    </View>
    )
}

export default TimeSelector;