import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="h-full bg-white" >
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex w-full h-full justify-center items-center p-4">
          <Text className="text-5xl text-black font-thin text-center mb-11">
            Connect with {"\n"} trusted {"\n"} personal care {"\n"} support
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-11"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
