import { Text, View, Button, Image, TouchableOpacity} from 'react-native';

const Header = ({ word }) => {
      const iconPressed = () => {
          console.log('Icon button pressed');
      };
  return (
      <View className="h-[11%] w-full flex-row items-center justify-between bg-orange-500 px-2 pt-10">
        <Text className="w-4/5 text-black text-[27px] font-bold pl-1">
            {word}
        </Text>
        <TouchableOpacity onPress={iconPressed}>
            <Image source={require('../assets/ICON.png')}/>
        </TouchableOpacity>
      </View>
  );
};

export default Header;