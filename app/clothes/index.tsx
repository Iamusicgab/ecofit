import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Clothes() {
	// Sample inventory data
	const inventoryItems = [
		{ id: 1, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 2, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 3, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 4, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 5, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 6, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 7, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 8, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 9, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
		{ id: 10, name: "Shirt", status: "Occasionally used", color: "#8B4513" },
	];

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Header */}
			<View className="px-4 py-4">
				<View className="flex-row items-center">
					<View className="w-8 h-8 bg-green-500 rounded-full mr-3"></View>
					<View>
						<Text className="text-3xl font-bold text-black">Fit Inventory</Text>
						<Text className="text-sm text-gray-600">Sorted by Latest</Text>
					</View>
				</View>
			</View>

			{/* Inventory Grid */}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="flex-row flex-wrap justify-between">
					{inventoryItems.map((item, index) => (
						<View key={item.id} className="w-[48%] mb-4">
							<TouchableOpacity className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
								{/* T-shirt Image */}
								<View className="w-full h-32 bg-gray-100 rounded-lg mb-3 items-center justify-center">
									<View
										className="w-20 h-20 rounded-lg"
										style={{ backgroundColor: item.color }}
									>
										{/* T-shirt shape using View */}
										<View className="w-full h-full items-center justify-center">
											<Ionicons name="shirt" size={40} color="white" />
										</View>
									</View>
								</View>

								{/* Item Labels */}
								<View className="items-center">
									<Text className="text-lg font-bold text-black mb-1">
										{item.name}
									</Text>
									<Text className="text-sm text-gray-600">{item.status}</Text>
								</View>
							</TouchableOpacity>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
