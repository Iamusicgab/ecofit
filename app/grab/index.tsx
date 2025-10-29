import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Alert,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Item {
	id: number;
	title: string;
	description: string;
	donor: string;
	location: string;
	distance: string;
	coordinates: { latitude: number; longitude: number };
	images: string[];
	condition: string;
	rating: number;
	availableUntil: string;
	category: string;
	size: string;
	brand: string;
	quality: {
		fabric: string;
		wear: string;
		cleanliness: string;
		overall: number;
	};
}

export default function Grab() {
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [showMap, setShowMap] = useState(false);
	const [showQualityInspection, setShowQualityInspection] = useState(false);
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("distance");

	// Sample nearby items data
	const nearbyItems = [
		{
			id: 1,
			title: "Vintage Denim Jacket",
			description: "Size M, Excellent Condition",
			donor: "Sarah M.",
			location: "Downtown Coffee Shop",
			distance: "0.3 km",
			coordinates: { latitude: 40.7128, longitude: -74.006 },
			images: ["jacket1", "jacket2"],
			condition: "Excellent",
			rating: 4.8,
			availableUntil: "2 hours",
			category: "upperwear",
			size: "M",
			brand: "Levi's",
			quality: {
				fabric: "Denim",
				wear: "Minimal",
				cleanliness: "Excellent",
				overall: 4.8,
			},
		},
		{
			id: 2,
			title: "Organic Cotton T-Shirt",
			description: "Size L, Like New",
			donor: "Mike R.",
			location: "Central Park",
			distance: "0.8 km",
			coordinates: { latitude: 40.7829, longitude: -73.9654 },
			images: ["shirt1", "shirt2"],
			condition: "Like New",
			rating: 4.9,
			availableUntil: "4 hours",
			category: "upperwear",
			size: "L",
			brand: "Patagonia",
			quality: {
				fabric: "Organic Cotton",
				wear: "None",
				cleanliness: "Perfect",
				overall: 4.9,
			},
		},
		{
			id: 3,
			title: "Sustainable Jeans",
			description: "Size 32, Good Condition",
			donor: "Emma L.",
			location: "Brooklyn Bridge",
			distance: "1.2 km",
			coordinates: { latitude: 40.7061, longitude: -73.9969 },
			images: ["jeans1", "jeans2"],
			condition: "Good",
			rating: 4.5,
			availableUntil: "6 hours",
			category: "lowerwear",
			size: "32",
			brand: "Everlane",
			quality: {
				fabric: "Cotton Blend",
				wear: "Light",
				cleanliness: "Good",
				overall: 4.5,
			},
		},
		{
			id: 4,
			title: "Eco-Friendly Dress",
			description: "Size S, Brand New",
			donor: "Sophia M.",
			location: "Union Square",
			distance: "1.5 km",
			coordinates: { latitude: 40.7359, longitude: -73.9911 },
			images: ["dress1", "dress2"],
			condition: "Brand New",
			rating: 5.0,
			availableUntil: "8 hours",
			category: "dress",
			size: "S",
			brand: "Reformation",
			quality: {
				fabric: "Tencel",
				wear: "None",
				cleanliness: "Perfect",
				overall: 5.0,
			},
		},
	];

	const filteredItems = nearbyItems.filter((item) => {
		if (filter === "all") return true;
		return item.category === filter;
	});

	const sortedItems = filteredItems.sort((a, b) => {
		if (sortBy === "distance") {
			return parseFloat(a.distance) - parseFloat(b.distance);
		}
		return b.rating - a.rating;
	});

	const handleGrabItem = (item: any) => {
		Alert.alert(
			"Grab Item",
			`Are you sure you want to grab "${item.title}" from ${item.donor}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Grab It!",
					onPress: () => {
						Alert.alert(
							"Success!",
							"Item grabbed! You have 2 hours to pick it up."
						);
						setShowQualityInspection(false);
					},
				},
			]
		);
	};

	const renderHeader = () => (
		<View className="bg-green-500 px-4 py-6">
			<View className="flex-row items-center justify-between">
				<Text className="text-2xl font-bold text-white">Grab Nearby Items</Text>
				<TouchableOpacity
					className="w-12 h-12 bg-green-600 rounded-full items-center justify-center"
					onPress={() => setShowMap(!showMap)}
				>
					<Ionicons name="map" size={24} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderFilters = () => (
		<View className="px-4 py-4 bg-white border-b border-gray-200">
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View className="flex-row space-x-2">
					{["all", "upperwear", "lowerwear", "dress"].map((category) => (
						<TouchableOpacity
							key={category}
							className={`px-4 py-2 rounded-full ${
								filter === category ? "bg-green-500" : "bg-gray-200"
							}`}
							onPress={() => setFilter(category)}
						>
							<Text
								className={`font-medium ${
									filter === category ? "text-white" : "text-gray-600"
								}`}
							>
								{category === "all"
									? "All Items"
									: category.charAt(0).toUpperCase() + category.slice(1)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);

	const renderItemCard = (item: any) => (
		<TouchableOpacity
			key={item.id}
			className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4"
			onPress={() => {
				setSelectedItem(item);
				setShowQualityInspection(true);
			}}
		>
			<View className="flex-row items-start">
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
					<Text className="text-sm text-gray-600 mb-2">{item.description}</Text>

					{/* Donor and Location */}
					<View className="flex-row items-center mb-2">
						<Ionicons name="person" size={16} color="#6B7280" />
						<Text className="text-sm text-gray-600 ml-1">{item.donor}</Text>
						<Ionicons
							name="location"
							size={16}
							color="#6B7280"
							className="ml-3"
						/>
						<Text className="text-sm text-gray-600 ml-1">{item.location}</Text>
					</View>

					{/* Distance and Rating */}
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center">
							<Ionicons name="walk" size={16} color="#10B981" />
							<Text className="text-sm text-green-600 ml-1">
								{item.distance}
							</Text>
						</View>
						<View className="flex-row items-center">
							<Ionicons name="star" size={16} color="#FCD34D" />
							<Text className="text-sm text-gray-600 ml-1">{item.rating}</Text>
						</View>
						<Text className="text-sm text-orange-600 font-medium">
							Available: {item.availableUntil}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderQualityInspection = () => (
		<Modal
			visible={showQualityInspection}
			animationType="slide"
			transparent={false}
		>
			<SafeAreaView className="flex-1 bg-white">
				{/* Header */}
				<View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
					<TouchableOpacity onPress={() => setShowQualityInspection(false)}>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
					<Text className="text-lg font-bold">Quality Inspection</Text>
					<View className="w-8 h-8" />
				</View>

				{selectedItem && (
					<ScrollView className="flex-1 px-4 py-6">
						{/* Item Images */}
						<View className="w-full h-64 bg-gray-100 rounded-xl items-center justify-center mb-6">
							<View className="w-48 h-48 bg-orange-500 rounded-xl items-center justify-center">
								<Ionicons name="shirt" size={80} color="white" />
							</View>
						</View>

						{/* Item Details */}
						<View className="mb-6">
							<Text className="text-2xl font-bold text-black mb-2">
								{selectedItem.title}
							</Text>
							<Text className="text-lg text-gray-600 mb-4">
								{selectedItem.description}
							</Text>

							<View className="flex-row items-center justify-between mb-4">
								<Text className="text-lg font-semibold text-green-600">
									Donated by {selectedItem.donor}
								</Text>
								<View className="flex-row items-center">
									<Ionicons name="star" size={20} color="#FCD34D" />
									<Text className="text-lg font-bold text-black ml-1">
										{selectedItem.rating}
									</Text>
								</View>
							</View>
						</View>

						{/* Quality Assessment */}
						<View className="mb-6">
							<Text className="text-xl font-bold text-black mb-4">
								Quality Assessment
							</Text>

							<View className="space-y-3">
								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Fabric Quality</Text>
									<Text className="text-lg font-semibold text-green-600">
										{selectedItem.quality.fabric}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Wear Level</Text>
									<Text className="text-lg font-semibold text-yellow-600">
										{selectedItem.quality.wear}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Cleanliness</Text>
									<Text className="text-lg font-semibold text-green-600">
										{selectedItem.quality.cleanliness}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Overall Rating</Text>
									<View className="flex-row items-center">
										<Text className="text-lg font-bold text-green-600 mr-2">
											{selectedItem.quality.overall}
										</Text>
										<View className="flex-row">
											{[...Array(5)].map((_, i) => (
												<Ionicons
													key={i}
													name="star"
													size={16}
													color={
														i < Math.floor(selectedItem.quality.overall)
															? "#FCD34D"
															: "#D1D5DB"
													}
												/>
											))}
										</View>
									</View>
								</View>
							</View>
						</View>

						{/* Location Details */}
						<View className="mb-6">
							<Text className="text-xl font-bold text-black mb-4">
								Pickup Location
							</Text>
							<View className="bg-gray-50 rounded-xl p-4">
								<View className="flex-row items-center mb-2">
									<Ionicons name="location" size={20} color="#10B981" />
									<Text className="text-lg font-semibold text-black ml-2">
										{selectedItem.location}
									</Text>
								</View>
								<View className="flex-row items-center">
									<Ionicons name="walk" size={16} color="#6B7280" />
									<Text className="text-sm text-gray-600 ml-2">
										{selectedItem.distance} away
									</Text>
								</View>
							</View>
						</View>

						{/* Action Buttons */}
						<View className="flex-row gap-4">
							<TouchableOpacity
								className="flex-1 bg-yellow-500 px-6 py-4 rounded-xl"
								onPress={() => setShowQualityInspection(false)}
							>
								<Text className="text-white text-lg font-bold text-center">
									Back
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 bg-green-500 px-6 py-4 rounded-xl"
								onPress={() => handleGrabItem(selectedItem)}
							>
								<Text className="text-white text-lg font-bold text-center">
									Grab It!
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
		</Modal>
	);

	const renderMapView = () => (
		<Modal visible={showMap} animationType="slide" transparent={false}>
			<SafeAreaView className="flex-1 bg-white">
				{/* Map Header */}
				<View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
					<TouchableOpacity onPress={() => setShowMap(false)}>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
					<Text className="text-lg font-bold">Nearby Items Map</Text>
					<View className="w-8 h-8" />
				</View>

				{/* Map Placeholder */}
				<View className="flex-1 bg-gray-200 items-center justify-center">
					<View className="w-80 h-80 bg-green-100 rounded-xl items-center justify-center">
						<Ionicons name="map" size={80} color="#10B981" />
						<Text className="text-lg font-bold text-green-600 mt-4">
							Interactive Map
						</Text>
						<Text className="text-sm text-gray-600 text-center mt-2">
							Tap on markers to view items
						</Text>
					</View>
				</View>

				{/* Map Controls */}
				<View className="px-4 py-4 bg-white border-t border-gray-200">
					<View className="flex-row gap-4">
						<TouchableOpacity className="flex-1 bg-green-500 px-4 py-3 rounded-xl">
							<Text className="text-white font-bold text-center">
								Refresh Map
							</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-blue-500 px-4 py-3 rounded-xl">
							<Text className="text-white font-bold text-center">
								My Location
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			{renderHeader()}
			{renderFilters()}

			<ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
				<View className="mb-4">
					<Text className="text-lg font-bold text-black mb-2">
						{sortedItems.length} items available nearby
					</Text>
					<Text className="text-sm text-gray-600">
						Tap on items to inspect quality before grabbing
					</Text>
				</View>

				{sortedItems.map(renderItemCard)}
			</ScrollView>

			{renderQualityInspection()}
			{renderMapView()}
		</SafeAreaView>
	);
}
