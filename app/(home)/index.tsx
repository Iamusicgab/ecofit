import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	return (
		<SafeAreaView className="flex-1 " style={{ padding: 12 }}>
			<View className="grid gap-8">
				<View className="">
					<Text className="text-4xl p-4 rounded-3xl self-start justify-center items-center -rotate-[3deg] border-5 border-green font-bold font-quicksand_regular box-green">
						Hello, Christiane!
					</Text>
				</View>

				<View className=" self-start grid items-center gap-1">
					<Text>Wear Index</Text>
					<Text className="text-3xl self-start w-40 border-5 border-yellow py-3 px-6 rounded-tl-4xl rounded-tr-4xl rounded-bl-4xl rounded-br-xl font-bold font-quicksand_regular box-yellow text-center">
						75%
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
