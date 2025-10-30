import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function index() {
	return (
		<SafeAreaView className="flex-1 justify-center items-center px-4 py-2">
			<Text className="text-2xl font-quicksand_bold">name</Text>
			<Text className="text-gray-600 mb-4">status</Text>

			<TouchableOpacity className="bg-green-500 px-4 py-2 rounded-xl">
				<Text className="text-white font-quicksand_bold">Close</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default index;
