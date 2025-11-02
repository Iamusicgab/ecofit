import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Greetings from "../components/Greetings";
import List from "../components/home/List";
import ReWear from "../components/home/ReWear";
import WearIndex from "../components/home/WearIndex";

import Header from "../components/Header";

let HappyRobot = require("../../../assets/images/robot-happy.png");
let MidRobot = require("../../../assets/images/robot-mid.png");
let SadRobot = require("../../../assets/images/robot-sad.png");

export default function HomeScreen() {
	// Dynamically configure header for this screen
	const insets = useSafeAreaInsets();

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
				return "bg-red-500 border-2 border-red-300";
			case "yellow":
				return "bg-yellow-400 border-2 border-yellow-300";
			case "green":
				return "bg-green-500 border-2 border-green-300";
			default:
				return "bg-white border-2 border-gray-300";
		}
	};

	const getMonthTextStyle = (month: any) =>
		month.active
			? "text-white font-quicksand_bold"
			: "text-gray-600 font-quicksand_bold";

	return (
		<View className="flex-1 bg-white">
			<Header title="ecofit" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				<View className="flex-1 gap-8 px-6">
					<Greetings name="Christiane" />

					{/* Stats Section */}
					<View className="flex-row gap-4 justify-center items-center">
						<View className="flex-3 gap-4">
							<WearIndex percentage="100" />
							<ReWear totalrewear="1000" donated="100" sold="100" />
						</View>
						<View className="flex-2">
							<Image
								source={HappyRobot}
								style={{ height: 300 }}
								contentFit="contain"
							/>
						</View>
					</View>

					{/* Monthly Buttons */}
					<View className="flex-row flex-wrap gap-2 mb-6">
						{months.map((month, index) => (
							<TouchableOpacity
								key={index}
								className={`px-3 py-2 rounded-lg ${getMonthButtonStyle(month)}`}
							>
								<Text
									className={`text-sm font-medium ${getMonthTextStyle(month)}`}
								>
									{month.name}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Recent ReWears */}
					<View className="flex-1 gap-2">
						<Text className="font-quicksand_medium text-lg">
							Recent ReWears
						</Text>
						<List />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
