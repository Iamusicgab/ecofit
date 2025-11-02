import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClothesList from "../components/clothes/ClothesList";

import { router } from "expo-router";

import Header from "../components/Header";

export default function Clothes() {
	const insets = useSafeAreaInsets();

	const inventoryItems = [
		{
			id: 1,
			name: "Shirt1",
			status: "Occasionally used",
			color: "#8B4513",
			impulselyBought: true,
		},
		{
			id: 2,
			name: "Shirt2",
			status: "Occasionally used",
			color: "#8B4513",
			impulselyBought: false,
		},
		// ... more
	];

	return (
		<View className="flex-1 bg-white ">
			<Header title="My Clothes" />

			{/* Scrollable Inventory */}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				<View className="flex-row flex-wrap justify-between">
					{inventoryItems.map((item) => (
						<ClothesList
							key={item.id}
							name={item.name}
							status={item.status}
							onPress={() => router.push(`/clothes/${item.id}`)}
						/>
					))}
				</View>
			</ScrollView>

			{/* Item Modal */}
		</View>
	);
}
