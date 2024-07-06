import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="h-full" >
      {/* <Text>AmiCare</Text>
      <Link href="/sign-in">sign in</Link> */}
      <ScrollView contentContainerStyle = {{height: '100%'}}>
        <View className="flex w-full h-full justify-center items-center p-4">
          <View className="">
            <Text className="text-5xl text-black font-thin text-center">
              Connect with {"\n"} trusted {"\n"} personal care {"\n"} support
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
