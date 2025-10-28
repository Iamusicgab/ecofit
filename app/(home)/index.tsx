import { Image } from "expo-image";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Greetings from "../components/Greetings";
import ReWear from "../components/home/ReWear";
import WearIndex from "../components/home/WearIndex";

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
			<ScrollView className="p-4" showsVerticalScrollIndicator={false}>
				{/* Div Container */}
				<View className="flex-1 gap-8">
					<Greetings name="Christiane" />
					{/* Stats Section */}
					<View className="flex-row gap-4 justify-center items-center">
						{/* Wear Index and ReWear Stats */}
						<View className="flex-3 gap-4">
							<WearIndex percentage="100" />
							<ReWear totalrewear="1000" donated="100" sold="100" />
						</View>
						<View className="flex-2">
							<Image
								source={require("../../assets/images/robot.png")}
								style={{ height: 300 }}
								contentFit="contain"
							/>
						</View>
					</View>

					{/* Recent ReWears */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
