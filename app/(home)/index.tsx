import { Image, ImageBackground } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Greetings from "../components/Greetings";
import List from "../components/home/List";
import ReWear from "../components/home/ReWear";
import WearIndex from "../components/home/WearIndex";
let Rectangle = require("../../assets/images/rectangle.png");

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
				return "bg-red-500 border-2 border-red-300";
			case "yellow":
				return "bg-yellow-400 border-2 border-yellow-300";
			case "green":
				return "bg-green-500 border-2 border-green-300";
			default:
				return "bg-white border-2 border-gray-300";
		}
	};

	const getMonthTextStyle = (month: any) => {
		return month.active
			? "text-white font-quicksand_bold"
			: "text-gray-600 font-quicksand_bold";
	};
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
					<Image
						style={{ height: 50, width: 50 }}
						contentFit="contain"
						source={require("../../assets/images/logo.svg")}
					/>
					<Text className="text-4xl font-quicksand_bold text-white">
						ecofit
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
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="py-10"></View>
				{/* Div Container */}
				<View className="flex-1 gap-8 p-6">
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
								source={require("../../assets/images/robot-happy.png")}
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
						<Text className="font-quicksand_medium">Recent ReWears</Text>

						<List />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
