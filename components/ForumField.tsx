import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";


interface ForumFieldProps extends TextInputProps{
    title: string
    value: string;
    // placeholder: string
    handleChangeText: (e:string) => void;
    otherStyles?: string;
}


const ForumField: React.FC<ForumFieldProps> = ({
  title,
  value,
//   placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={otherStyles}>

      <View className="w-full h-16 px-4 bg-gray-200 rounded-xl flex flex-row items-center">
        <TextInput
          className="flex-1 text-black font-normal text-base"
          value={value}
          placeholder={title}
          placeholderTextColor="#4B5563"
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || title === "Confirm Password") && !showPassword}
          {...props}
        />

        {/* {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
};

export default ForumField;