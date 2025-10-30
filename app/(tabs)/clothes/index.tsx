import { Image } from "expo-image";
import { useState } from "react";
import {
	ImageBackground,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClothesList from "../components/clothes/ClothesList";

let Rectangle = require("../../../assets/images/rectangle.png");

export default function Clothes() {
	const [selectedItem, setSelectedItem] = useState<any>(null);

	const inventoryItems = [
		{ id: 1, name: "Shirt1", status: "Occasionally used", color: "#8B4513" },
		{ id: 2, name: "Shirt2", status: "Occasionally used", color: "#8B4513" },
		// ... more
	];

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Sticky Header */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 50,
				}}
			>
				<ImageBackground
					source={Rectangle}
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						padding: 16,
						paddingVertical: 60,
					}}
				>
					<Text className="text-4xl font-quicksand_bold text-white">
						My Clothes
					</Text>
					<Image
						style={{
							height: 50,
							width: 50,
							borderRadius: 15,
							borderColor: "white",
							borderWidth: 2,
						}}
						contentFit="cover"
						source="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&fm=jpg&q=60&w=3000"
					/>
				</ImageBackground>
			</View>

			{/* Scrollable Inventory */}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="py-10"></View>
				<View className="flex-row flex-wrap justify-between">
					{inventoryItems.map((item) => (
						<ClothesList
							key={item.id}
							name={item.name}
							status={item.status}
							onPress={() => setSelectedItem(item)}
						/>
					))}
				</View>
			</ScrollView>

			{/* Item Modal */}
			<Modal
				visible={!!selectedItem}
				animationType="slide"
				transparent={false}
				onRequestClose={() => setSelectedItem(null)}
			>
				<SafeAreaView className="flex-1 justify-center items-center">
					<Text className="text-2xl font-quicksand_bold">
						{selectedItem?.name}
					</Text>
					<Text className="text-gray-600 mb-4">{selectedItem?.status}</Text>

					<TouchableOpacity
						className="bg-green-500 px-4 py-2 rounded-xl"
						onPress={() => setSelectedItem(null)}
					>
						<Text className="text-white font-quicksand_bold">Close</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
}
