import { Text, View, Button, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';

const Header = ({ word, image, onPress }) => {
      const iconPressed = () => {
          console.log('Icon button pressed');
      };

  return (
      <View className = "py-4 h-[11%] w-full flex-row items-center justify-between bg-orange-500 px-3 pt-10">
        <Text className="w-4/5 text-black text-[28px] font-bold pl-1">
            {word}
        </Text>
        <TouchableOpacity onPress={onPress}>
            <Image source = {image} />
        </TouchableOpacity>
      </View>
  );
};

export default Header;