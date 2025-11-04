import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../providers/AuthProvider";
import { ClothingService } from "../../../services/clothingService";
import { ClothingItem } from "../../../types";
import ClothesList from "../components/clothes/ClothesList";

import { router } from "expo-router";

import Header from "../components/Header";

export default function Clothes() {
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const [clothingItems, setClothingItems] = React.useState<ClothingItem[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchClothingItems = async () => {
			try {
				if (!user?.uid) {
					console.log("No authenticated user found");
					setLoading(false);
					return;
				}

				const items = await ClothingService.getUserClothingItems(user.uid);
				console.log("Fetched clothing items:", items);
				setClothingItems(items);
			} catch (error) {
				console.error("Error fetching clothing items:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchClothingItems();
		} else {
			setLoading(false);
		}
	}, [user]);

	// Refresh data when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			if (user?.uid) {
				setLoading(true);
				ClothingService.getUserClothingItems(user.uid)
					.then((items) => {
						setClothingItems(items);
					})
					.catch((error) => {
						console.error("Error refreshing clothing items:", error);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		}, [user])
	);

	const getStatusText = (item: ClothingItem) => {
		const frequency = item.usageFrequency;
		const score = item.currentScore;

		if (frequency === "frequently") return `Frequently used • ${score}pts`;
		if (frequency === "occasionally") return `Occasionally used • ${score}pts`;
		return `Rarely used • ${score}pts`;
	};

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
				{loading ? (
					<View className="flex-1 justify-center items-center py-20">
						<Text className="text-gray-500 font-quicksand_medium">
							Loading your clothes...
						</Text>
					</View>
				) : clothingItems.length === 0 ? (
					<View className="flex-1 justify-center items-center py-20">
						<Text className="text-gray-500 font-quicksand_medium text-center">
							No clothes added yet.{"\n"}
							Add your first item in the &quot;New&quot; tab!
						</Text>
					</View>
				) : (
					<View className="flex-row flex-wrap justify-between">
						{clothingItems.map((item) => (
							<ClothesList
								key={item.id}
								name={`${
									item.clothingType.charAt(0).toUpperCase() +
									item.clothingType.slice(1)
								}`}
								status={getStatusText(item)}
								imageUrl={item.imageUrl}
								onPress={() => router.push(`/clothes/${item.id}`)}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{/* Item Modal */}
		</View>
	);
}
