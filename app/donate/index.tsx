import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Donate() {
	const [activeTab, setActiveTab] = useState("goals");
	const [selectedGoal, setSelectedGoal] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(null);

	// Sustainability goals data
	const sustainabilityGoals = [
		{ 
			id: 1, 
			title: "Avoid buying clothes for 30 days", 
			completed: true, 
			progress: 100,
			icon: "checkmark-circle",
			color: "green"
		},
		{ 
			id: 2, 
			title: "Rewear each item in my closet at least 5 times before adding anything", 
			completed: false, 
			progress: 60,
			icon: "time",
			color: "gray"
		},
		{ 
			id: 3, 
			title: "Donate or resell at least 10 items this season", 
			completed: false, 
			progress: 30,
			icon: "time",
			color: "gray"
		},
		{ 
			id: 4, 
			title: "Buy only second-hand clothes for 3 months", 
			completed: false, 
			progress: 0,
			icon: "time",
			color: "gray"
		},
		{ 
			id: 5, 
			title: "Organize a clothing swap with friends", 
			completed: false, 
			progress: 0,
			icon: "time",
			color: "gray"
		}
	];

	// Monthly EcoFit index data
	const monthlyIndex = [
		{ month: "Jan", score: 75, color: "red", active: true },
		{ month: "Feb", score: 60, color: "yellow", active: true },
		{ month: "Mar", score: 80, color: "red", active: true },
		{ month: "Apr", score: 90, color: "green", active: true },
		{ month: "May", score: 85, color: "green", active: true },
		{ month: "Jun", score: 70, color: "red", active: true },
		{ month: "Jul", score: 65, color: "yellow", active: true },
		{ month: "Aug", score: 0, color: "gray", active: false },
		{ month: "Sep", score: 0, color: "gray", active: false },
		{ month: "Oct", score: 0, color: "gray", active: false },
		{ month: "Nov", score: 0, color: "gray", active: false },
		{ month: "Dec", score: 0, color: "gray", active: false }
	];

	// Smart donation options
	const smartOptions = [
		{
			id: 1,
			title: "Vintage Denim Jacket",
			description: "Size M, Brand New",
			rating: 5,
			image: "jacket",
			price: "$45",
			condition: "Excellent"
		},
		{
			id: 2,
			title: "Organic Cotton T-Shirt",
			description: "Size L, Like New",
			rating: 5,
			image: "shirt",
			price: "$25",
			condition: "Very Good"
		},
		{
			id: 3,
			title: "Sustainable Jeans",
			description: "Size 32, Good Condition",
			rating: 4,
			image: "jeans",
			price: "$35",
			condition: "Good"
		},
		{
			id: 4,
			title: "Eco-Friendly Dress",
			description: "Size S, Brand New",
			rating: 5,
			image: "dress",
			price: "$55",
			condition: "Excellent"
		}
	];

	const getGoalIcon = (goal: any) => {
		if (goal.completed) {
			return <Ionicons name="checkmark-circle" size={24} color="#10B981" />;
		}
		return <Ionicons name="time" size={24} color="#6B7280" />;
	};

	const getGoalStyle = (goal: any) => {
		if (goal.completed) {
			return "bg-green-100 border-green-500";
		}
		return "bg-gray-100 border-gray-300";
	};

	const getMonthStyle = (month: any) => {
		if (!month.active) {
			return "bg-gray-200 border-gray-300";
		}
		
		switch (month.color) {
			case "red":
				return "bg-red-100 border-red-500";
			case "yellow":
				return "bg-yellow-100 border-yellow-500";
			case "green":
				return "bg-green-100 border-green-500";
			default:
				return "bg-gray-200 border-gray-300";
		}
	};

	const renderHeader = () => (
		<View className="bg-green-500 px-4 py-6">
			<View className="flex-row items-center justify-between">
				<Text className="text-2xl font-bold text-white">Sustainability Goals</Text>
				<View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center">
					<Ionicons name="leaf" size={24} color="white" />
				</View>
			</View>
		</View>
	);

	const renderTabBar = () => (
		<View className="flex-row bg-white border-b border-gray-200">
			<TouchableOpacity
				className={`flex-1 py-4 items-center ${activeTab === "goals" ? "border-b-2 border-green-500" : ""}`}
				onPress={() => setActiveTab("goals")}
			>
				<Text className={`font-semibold ${activeTab === "goals" ? "text-green-600" : "text-gray-600"}`}>
					Goals
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				className={`flex-1 py-4 items-center ${activeTab === "smart" ? "border-b-2 border-green-500" : ""}`}
				onPress={() => setActiveTab("smart")}
			>
				<Text className={`font-semibold ${activeTab === "smart" ? "text-green-600" : "text-gray-600"}`}>
					Smart Options
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderSustainabilityGoals = () => (
		<View className="px-4 py-6">
			<Text className="text-2xl font-bold text-black mb-6">ecofit Quest:</Text>
			
			<View className="space-y-4">
				{sustainabilityGoals.map((goal) => (
					<TouchableOpacity
						key={goal.id}
						className={`border-2 rounded-xl p-4 ${getGoalStyle(goal)}`}
						onPress={() => setSelectedGoal(goal)}
					>
						<View className="flex-row items-center justify-between">
							<View className="flex-row items-center flex-1">
								{getGoalIcon(goal)}
								<Text className="ml-3 text-lg font-medium text-black flex-1">
									{goal.title}
								</Text>
							</View>
						</View>
						
						{/* Progress Bar */}
						<View className="mt-3">
							<View className="w-full bg-gray-200 rounded-full h-2">
								<View 
									className="bg-green-500 h-2 rounded-full" 
									style={{ width: `${goal.progress}%` }}
								/>
							</View>
							<Text className="text-sm text-gray-600 mt-1">{goal.progress}% Complete</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>

			<Text className="text-2xl font-bold text-black mb-6 mt-8">Monthly ecofit Index:</Text>
			
			<View className="flex-row flex-wrap gap-2">
				{monthlyIndex.map((month, index) => (
					<TouchableOpacity
						key={index}
						className={`px-3 py-2 rounded-lg border-2 ${getMonthStyle(month)}`}
						onPress={() => setSelectedMonth(month)}
					>
						<Text className={`text-sm font-medium ${month.active ? "text-black" : "text-gray-500"}`}>
							{month.month}
						</Text>
						{month.active && (
							<Text className="text-xs text-gray-600">{month.score}%</Text>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderSmartOptions = () => (
		<View className="px-4 py-6">
			<Text className="text-2xl font-bold text-black mb-6">Smart Options</Text>
			
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="space-y-4">
					{smartOptions.map((item) => (
						<TouchableOpacity
							key={item.id}
							className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
						>
							<View className="flex-row items-center">
								{/* Item Image */}
								<View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-4">
									<View className="w-16 h-16 bg-orange-500 rounded-lg items-center justify-center">
										<Ionicons name="shirt" size={32} color="white" />
									</View>
								</View>
								
								{/* Item Details */}
								<View className="flex-1">
									<Text className="text-lg font-bold text-black mb-1">
										{item.title}
									</Text>
									<Text className="text-sm text-gray-600 mb-2">
										{item.description}
									</Text>
									
									{/* Rating */}
									<View className="flex-row items-center mb-2">
										{[...Array(5)].map((_, i) => (
											<Ionicons 
												key={i} 
												name="star" 
												size={16} 
												color={i < item.rating ? "#FCD34D" : "#D1D5DB"} 
											/>
										))}
									</View>
									
									<View className="flex-row items-center justify-between">
										<Text className="text-lg font-bold text-green-600">{item.price}</Text>
										<Text className="text-sm text-gray-500">{item.condition}</Text>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);

	const renderGoalSetting = () => (
		<View className="px-4 py-6">
			<Text className="text-2xl font-bold text-black mb-6">Goal Setting:</Text>
			
			<TouchableOpacity className="bg-green-100 border-2 border-green-500 rounded-xl p-4 mb-6">
				<View className="flex-row items-center">
					<Ionicons name="checkmark-circle" size={24} color="#10B981" />
					<Text className="ml-3 text-lg font-bold text-green-700">
						Avoid buying clothes for 30 days
					</Text>
				</View>
			</TouchableOpacity>

			<View className="space-y-3">
				<Text className="text-lg text-gray-700">• Buy no new clothes for 30 days</Text>
				<Text className="text-lg text-gray-700">• Rewear each item in my closet at least 5 times before adding anything</Text>
				<Text className="text-lg text-gray-700">• Donate or resell at least 10 items this season</Text>
			</View>

			<Text className="text-2xl font-bold text-black mb-6 mt-8">Goal Tracker:</Text>
			
			<View className="flex-row flex-wrap gap-2">
				{monthlyIndex.map((month, index) => (
					<TouchableOpacity
						key={index}
						className={`px-3 py-2 rounded-lg border-2 ${getMonthStyle(month)}`}
						onPress={() => setSelectedMonth(month)}
					>
						<Text className={`text-sm font-medium ${month.active ? "text-black" : "text-gray-500"}`}>
							{month.month}
						</Text>
						{month.active && (
							<Text className="text-xs text-gray-600">{month.score}%</Text>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	return (
		<SafeAreaView className="flex-1 bg-white">
			{renderHeader()}
			{renderTabBar()}
			
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{activeTab === "goals" && renderSustainabilityGoals()}
				{activeTab === "smart" && renderSmartOptions()}
			</ScrollView>
		</SafeAreaView>
	);
}
