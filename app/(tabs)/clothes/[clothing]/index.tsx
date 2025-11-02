import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";

function Clothing() {
	return (
		<View className="p-4 flex-1 bg-white gap-8">
			<View className="w-full items-center">
				<Image
					source="https://levi.in/cdn/shop/files/c435dd3b-5181-4c23-a96b-830115915dd81738670738633-Womens-Self-Design-Spread-Collar-Shirt-7361738670738106-1.jpg?v=1750421494"
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
				/>
			</View>
			<View>
				<Text className="text-3xl font-quicksand_bold">Testing</Text>
				<Text className="text-xl font-quicksand_regular">Upperwear</Text>
			</View>

			<View>
				<Text className="text-lg font-quicksand_semibold">Frequently Worn</Text>
				<Text className="text-lg font-quicksand_semibold">
					Impulsely bought
				</Text>
				<Text className="text-lg font-quicksand_semibold">
					Added May 12, 2006
				</Text>
			</View>
			<View className="flex-row mt-4 gap-2 flex-wrap">
				<CustomButton
					label="ReWear"
					onPress={() => router.push("/(tabs)/(home)")}
				/>
				<CustomButton
					label="Donate"
					onPress={() => router.push("/(tabs)/(home)")}
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
