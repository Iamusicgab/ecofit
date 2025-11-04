import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { ClothingService } from "../../../../services/clothingService";
import { ClothingItem } from "../../../../types";
import CustomButton from "../../components/CustomButton";

function Clothing() {
	const { clothing: clothingId } = useLocalSearchParams<{ clothing: string }>();
	const [clothingItem, setClothingItem] = React.useState<ClothingItem | null>(
		null
	);
	const [loading, setLoading] = React.useState(true);

	const [isLoggingWear, setIsLoggingWear] = React.useState(false);

	React.useEffect(() => {
		const fetchClothingItem = async () => {
			if (!clothingId) {
				setLoading(false);
				return;
			}

			try {
				const item = await ClothingService.getClothingItem(clothingId);
				setClothingItem(item);
			} catch (error) {
				console.error("Error fetching clothing item:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchClothingItem();
	}, [clothingId]);

	const handleWearItem = async () => {
		if (!clothingItem || isLoggingWear) return;

		setIsLoggingWear(true);
		try {
			await ClothingService.logWearEvent(clothingItem.id);
			// Refresh the item to get updated score
			const updatedItem = await ClothingService.getClothingItem(
				clothingItem.id
			);
			setClothingItem(updatedItem);
			console.log("Wear event logged! New score:", updatedItem?.currentScore);
		} catch (error) {
			console.error("Error logging wear event:", error);
		} finally {
			setIsLoggingWear(false);
		}
	};

	if (loading) {
		return (
			<View className="p-4 flex-1 bg-white justify-center items-center">
				<Text className="text-gray-500 font-quicksand_medium">Loading...</Text>
			</View>
		);
	}

	if (!clothingItem) {
		return (
			<View className="p-4 flex-1 bg-white justify-center items-center">
				<Text className="text-gray-500 font-quicksand_medium">
					Item not found
				</Text>
			</View>
		);
	}

	const getFrequencyText = () => {
		switch (clothingItem.usageFrequency) {
			case "frequently":
				return "Frequently used";
			case "occasionally":
				return "Occasionally used";
			case "rarely":
				return "Rarely used";
			default:
				return "Unknown";
		}
	};
	return (
		<View className="p-4 flex-1 bg-white gap-8">
			<View className="w-full items-center">
				<Image
					source={clothingItem.imageUrl}
					style={{
						width: "100%",
						height: 300,
						aspectRatio: 1 / 1,
						borderRadius: 12,
						borderColor: "#e5e7eb",
						shadowColor: "#e5e7eb",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						borderWidth: 4,
					}}
					contentFit="cover"
				/>
			</View>
			<View>
				<Text className="text-3xl font-quicksand_bold">
					{clothingItem.clothingType.charAt(0).toUpperCase() +
						clothingItem.clothingType.slice(1)}
				</Text>
				<Text className="text-xl font-quicksand_regular">
					{getFrequencyText()}
				</Text>
				<Text className="text-lg font-quicksand_medium text-green-600">
					EcoFit Score: {clothingItem.currentScore}/100
				</Text>
			</View>

			<View>
				<Text className="text-lg font-quicksand_semibold">
					Usage: {getFrequencyText()}
				</Text>
				<Text className="text-lg font-quicksand_semibold">
					{clothingItem.isImpulsivelyBought
						? "Impulsively bought"
						: "Planned purchase"}
				</Text>
				<Text className="text-lg font-quicksand_semibold">
					{clothingItem.isNewlyBought ? "Recently bought" : "Owned for a while"}
				</Text>
				<Text className="text-lg font-quicksand_semibold">
					Added {new Date(clothingItem.createdAt).toLocaleDateString()}
				</Text>
			</View>
			<View className="flex-row mt-4 gap-2 flex-wrap">
				<CustomButton
					label={isLoggingWear ? "Logging..." : "I Wore This!"}
					onPress={handleWearItem}
				/>
				<CustomButton
					label="Donate"
					onPress={() => router.push("/(tabs)/donate")}
				/>
				<CustomButton
					label="Sell"
					onPress={() => router.push("/(tabs)/(home)")}
				/>
			</View>
		</View>
	);
}

export default Clothing;
