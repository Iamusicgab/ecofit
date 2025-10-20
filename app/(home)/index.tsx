import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const months = [
		{ name: "Jan", active: true, color: "red" },
		{ name: "Feb", active: true, color: "yellow" },
		{ name: "Mar", active: true, color: "red" },
		{ name: "Apr", active: true, color: "green" },
		{ name: "May", active: true, color: "green" },
		{ name: "Jun", active: true, color: "red" },
		{ name: "Jul", active: true, color: "yellow" },
		{ name: "Aug", active: false, color: "gray" },
		{ name: "Sep", active: false, color: "gray" },
		{ name: "Oct", active: false, color: "gray" },
		{ name: "Nov", active: false, color: "gray" },
		{ name: "Dec", active: false, color: "gray" },
	];

	const getMonthButtonStyle = (month: any) => {
		if (!month.active) {
			return "bg-white border-2 border-gray-300";
		}
		
		switch (month.color) {
			case "red":
				return "bg-red-500";
			case "yellow":
				return "bg-yellow-400";
			case "green":
				return "bg-green-500";
			default:
				return "bg-white border-2 border-gray-300";
		}
	};

	const getMonthTextStyle = (month: any) => {
		return month.active ? "text-white" : "text-gray-600";
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="flex-row justify-between items-center px-4 py-2">
					<View className="flex-row items-center">
						<Text className="text-xl font-bold text-gray-800 mr-2">Home Page</Text>
						<View className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center">
							<Ionicons name="shirt" size={20} color="white" />
						</View>
					</View>
					<View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
						<Ionicons name="person" size={24} color="gray" />
					</View>
				</View>

				{/* Greeting Banner */}
				<View className="px-4 py-4">
					<View className="bg-white border-4 border-green-500 rounded-3xl p-4 -rotate-1">
						<Text className="text-3xl font-bold text-black text-center">
							Hello, Christiane!
						</Text>
					</View>
				</View>

				{/* Wear Index Section */}
				<View className="px-4 py-4">
					<Text className="text-lg font-semibold text-gray-800 mb-4">Wear Index</Text>
					
					<View className="flex-row items-center justify-between mb-6">
						<View className="bg-white border-4 border-yellow-400 rounded-3xl p-6 w-32">
							<Text className="text-4xl font-bold text-yellow-600 text-center">75%</Text>
						</View>
						
						{/* Robot Illustration */}
						<View className="items-center">
							<View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-2">
								<View className="w-16 h-16 bg-yellow-400 rounded-full items-center justify-center">
									<View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
										<View className="w-8 h-8 bg-white rounded-full items-center justify-center">
											<View className="w-4 h-4 bg-black rounded-full"></View>
										</View>
									</View>
								</View>
							</View>
							<View className="w-4 h-4 bg-green-500 rounded-full"></View>
						</View>
					</View>

					<Text className="text-lg font-semibold text-gray-800 mb-4">Monthly Wear Index</Text>
					
					{/* Monthly Buttons */}
					<View className="flex-row flex-wrap gap-2 mb-6">
						{months.map((month, index) => (
							<TouchableOpacity
								key={index}
								className={`px-3 py-2 rounded-lg ${getMonthButtonStyle(month)}`}
							>
								<Text className={`text-sm font-medium ${getMonthTextStyle(month)}`}>
									{month.name}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					<Text className="text-lg font-semibold text-gray-800 mb-4">Monthly Wear Index</Text>
					
					<View className="bg-white border-4 border-green-500 rounded-3xl p-6">
						<Text className="text-4xl font-bold text-green-600 text-center">39,780</Text>
					</View>
				</View>

				{/* Latest reWear Section */}
				<View className="px-4 py-4">
					<Text className="text-lg font-semibold text-gray-800 mb-4">Latest reWear</Text>
					
					<View className="flex-row gap-4">
						{/* reWear Card 1 */}
						<View className="flex-1 bg-gray-800 rounded-2xl p-4">
							<View className="w-full h-32 bg-red-600 rounded-lg mb-3 items-center justify-center">
								<Ionicons name="shirt" size={40} color="white" />
							</View>
							<View className="absolute bottom-4 left-4">
								<Text className="text-white text-sm">Grab from</Text>
								<Text className="text-white text-lg font-bold">Christiane</Text>
								<Text className="text-white text-xs">Uploaded July 22, 2025</Text>
							</View>
						</View>

						{/* reWear Card 2 */}
						<View className="flex-1 bg-gray-800 rounded-2xl p-4">
							<View className="w-full h-32 bg-red-600 rounded-lg mb-3 items-center justify-center">
								<Ionicons name="shirt" size={40} color="white" />
							</View>
							<View className="absolute bottom-4 left-4">
								<Text className="text-white text-sm">Grab from</Text>
								<Text className="text-white text-lg font-bold">Christiane</Text>
								<Text className="text-white text-xs">Uploaded July 22, 2025</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Bottom spacing for navigation */}
				<View className="h-20"></View>
			</ScrollView>
		</SafeAreaView>
	);
}