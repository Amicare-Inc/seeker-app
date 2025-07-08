import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
    iconName,
    iconColor = "#fff",
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-black rounded-xl min-h-[56px] flex justify-center items-center ${containerStyles} ${
                isLoading ? 'opacity-50' : ''
            }`}
            disabled={isLoading}
        >
            <View className="flex-row items-center">
                {iconName && (
                    <Ionicons 
                        name={iconName} 
                        size={24} 
                        color={iconColor}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text className={`text-white text-xl ${textStyles}`}>
                    {title}
                </Text>
            </View>

            {isLoading && (
                <ActivityIndicator
                    animating={isLoading}
                    color="#fff"
                    size="small"
                    className="ml-2"
                />
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;