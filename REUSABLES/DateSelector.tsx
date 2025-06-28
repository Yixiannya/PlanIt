import { Calendar } from 'react-native-calendars';
import { Text, View } from 'react-native';

const DateSelector = ({ actualDate, setActualDate }) => {
    return (
    <View className = "bg-orange-400">
    <Text className = "px-1 py-3 pt-3 text-4xl text-gray-800 font-bold"> Date: </Text>
    <Calendar
        onDayPress={(day) => {
        setActualDate(day.dateString);
        }}
        markedDates={{
        [actualDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedDotColor: 'orange',
        },
        }}
    />
    </View>
    )
}

export default DateSelector;