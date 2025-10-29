import { Image } from "expo-image";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClothesList from "../components/clothes/ClothesList";
let Rectangle = require("../../assets/images/rectangle.png");

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
			{/* Sticky Top Nav */}
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
						source="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
					/>
				</ImageBackground>
			</View>

			{/* Inventory Grid */}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="py-10"></View>
				<View className="flex-row flex-wrap justify-between">
					{inventoryItems.map((item, index) => (
						<ClothesList key={item.id} name={item.name} status={item.status} />
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
