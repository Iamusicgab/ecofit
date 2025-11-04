import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../providers/AuthProvider";
import { ClothingService } from "../../../services/clothingService";
import { UserEcoFitData } from "../../../types";
import { getUserDocument } from "../../../utils/firestoreUtils";

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
	const [firstName, setFirstName] = React.useState<string>("");
	const [ecoFitData, setEcoFitData] = React.useState<UserEcoFitData | null>(
		null
	);
	const { user } = useAuth();

	React.useEffect(() => {
		const fetchUserData = async () => {
			try {
				console.log("Fetching user data for:", user?.uid);
				const uid = user?.uid;

				if (!uid) {
					console.log("No authenticated user found");
					return;
				}

				// Fetch user profile data (for name)
				const { data: userData, error: userError } = await getUserDocument(uid);

				if (userError) {
					console.log("Error fetching user data for name:", userError);
				} else if (userData?.firstName) {
					console.log("Setting firstName:", userData.firstName);
					setFirstName(userData.firstName as string);
				}

				// Fetch EcoFit data
				const ecoFitData = await ClothingService.getUserEcoFitData(uid);
				console.log("EcoFit data fetched:", ecoFitData);
				setEcoFitData(ecoFitData);
			} catch (error) {
				console.log("Unexpected error fetching user data:", error);
			}
		};

		// Only fetch when user is available
		if (user) {
			fetchUserData();
		}
	}, [user]);

	// Refresh data when screen comes into focus (e.g., returning from clothes tab)
	useFocusEffect(
		React.useCallback(() => {
			if (user?.uid) {
				// Refresh EcoFit data
				ClothingService.getUserEcoFitData(user.uid)
					.then((ecoFitData) => {
						console.log("Refreshed EcoFit data:", ecoFitData);
						setEcoFitData(ecoFitData);
					})
					.catch((error) => {
						console.error("Error refreshing EcoFit data:", error);
					});
			}
		}, [user])
	);

	// Function to get robot image based on EcoFit score
	const getRobotImage = () => {
		if (!ecoFitData) return HappyRobot;

		const score = ecoFitData.currentOverallScore;
		if (score >= 75) return HappyRobot;
		if (score >= 50) return MidRobot;
		return SadRobot;
	};

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
					<Greetings name={firstName || ""} />

					{/* Stats Section */}
					<View className="flex-row gap-4 justify-center items-center">
						<View className="flex-3 gap-4">
							<WearIndex percentage={ecoFitData?.currentOverallScore} />
							<ReWear
								totalrewear={ecoFitData?.totalWearEvents?.toString() || "0"}
								donated={ecoFitData?.totalDonatedItems?.toString() || "0"}
								sold="0"
							/>
						</View>
						<View className="flex-2">
							<Image
								source={getRobotImage()}
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
