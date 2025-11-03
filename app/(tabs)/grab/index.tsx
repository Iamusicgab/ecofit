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
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../components/Header";

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
	const insets = useSafeAreaInsets();
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [showMap, setShowMap] = useState(false);
	const [showQualityInspection, setShowQualityInspection] = useState(false);
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("distance");
	const [tab, setTab] = useState<"explore" | "my" | "pending">("explore");

	// Pending grabs initiated by current user
	const [pendingGrabs, setPendingGrabs] = useState<
		{
			id: number;
			title: string;
			donor: string;
			status: "pending" | "approved";
			location?: string;
		}[]
	>([]);

	// Sample nearby items data (from other users)
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

	// Items added by current user for others to grab
	const myRewearItems: Item[] = [
		{
			id: 101,
			title: "Linen Short Sleeve Shirt",
			description: "Size M, Great for summer",
			donor: "You",
			location: "Your condo lobby",
			distance: "—",
			coordinates: { latitude: 0, longitude: 0 },
			images: ["mine1"],
			condition: "Good",
			rating: 5,
			availableUntil: "12 hours",
			category: "upperwear",
			size: "M",
			brand: "Uniqlo",
			quality: {
				fabric: "Linen",
				wear: "Light",
				cleanliness: "Clean",
				overall: 4.6,
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
		Alert.alert("Grab Item", `Grab "${item.title}" from ${item.donor}?`, [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Grab",
				onPress: () => {
					// Create a pending grab record; owner will approve
					setPendingGrabs((prev) => [
						...prev,
						{
							id: item.id,
							title: item.title,
							donor: item.donor,
							status: "pending",
						},
					]);
					setShowQualityInspection(false);
					setTab("pending");
				},
			},
		]);
	};

	const renderHeader = () => <Header title="ReWear" />;

	const renderTabBar = () => (
		<View className="flex-row">
			{[
				{ key: "explore", label: "Explore" },
				{ key: "my", label: "My ReWear" },
				{ key: "pending", label: "Pending" },
			].map((t: any) => (
				<TouchableOpacity
					key={t.key}
					className={`flex-1 py-4 items-center ${
						tab === t.key ? "border-b-2 border-green" : ""
					}`}
					onPress={() => setTab(t.key)}
				>
					<Text
						className={`font-semibold ${
							tab === t.key ? "text-green" : "text-gray-600"
						}`}
					>
						{t.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);

	const renderFilters = () => (
		<View className="px-4 py-4 bg-white border-b border-gray-200">
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View className="flex-row gap-2">
					{["all", "upperwear", "lowerwear", "dress"].map((category) => (
						<TouchableOpacity
							key={category}
							className={`px-4 py-2 rounded-full border-2 ${
								filter === category
									? "border-green bg-green-50"
									: "border-gray-300 bg-white"
							}`}
							onPress={() => setFilter(category)}
						>
							<Text
								className={`font-medium ${
									filter === category ? "text-green" : "text-gray-600"
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
			<SafeAreaView className="bg-white">
				{selectedItem && (
					<ScrollView className="px-4 py-6">
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

						{/* Action Buttons - outlined style to match Donate */}
						<View className="flex-row gap-4">
							<TouchableOpacity
								className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 shadow-[0_6px_0px_rgba(229,231,235,1)]"
								onPress={() => setShowQualityInspection(false)}
							>
								<Text className="text-center text-gray-700 text-lg font-bold">
									Back
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 px-6 py-4 rounded-xl border-2 border-green shadow-[0_6px_0px_rgba(129,211,52,1)]"
								onPress={() => handleGrabItem(selectedItem)}
							>
								<Text className="text-center text-green text-lg font-bold">
									Grab
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

	const renderExplore = () => (
		<>
			{renderFilters()}
			<ScrollView
				className="px-4 py-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="mb-4">
					<Text className="text-lg font-bold text-black mb-2">
						{sortedItems.length} items nearby
					</Text>
					<Text className="text-sm text-gray-600">
						Tap an item to view details and grab
					</Text>
				</View>
				{sortedItems.map(renderItemCard)}
			</ScrollView>
		</>
	);

	const renderMyItems = () => (
		<ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
			<Text className="text-lg font-bold text-black mb-3">
				Items you posted
			</Text>
			{myRewearItems.map((item) => (
				<View
					key={item.id}
					className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4"
				>
					<View className="flex-row items-start">
						<View className="w-16 h-16 bg-green-100 rounded-lg items-center justify-center mr-4">
							<Ionicons name="shirt" size={28} color="#059669" />
						</View>
						<View className="flex-1">
							<Text className="text-lg font-bold text-black mb-1">
								{item.title}
							</Text>
							<Text className="text-sm text-gray-600 mb-2">
								{item.description}
							</Text>
							<View className="flex-row items-center justify-between">
								<Text className="text-sm text-gray-600">
									Available until {item.availableUntil}
								</Text>
								{/* Simulate approving a pending grab for demo */}
								<TouchableOpacity
									className="px-3 py-2 rounded-lg border-2 border-green shadow-[0_6px_0px_rgba(129,211,52,1)]"
									onPress={() => {
										// Approve the first pending grab for this demo
										setPendingGrabs((prev) =>
											prev.map((p) =>
												p.status === "pending"
													? {
															...p,
															status: "approved",
															location: item.location,
													  }
													: p
											)
										);
										Alert.alert("Approved", "A pending grab was approved.");
									}}
								>
									<Text className="text-green font-bold">Approve a grab</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			))}
		</ScrollView>
	);

	const renderPending = () => (
		<ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
			<Text className="text-lg font-bold text-black mb-3">
				Your pending grabs
			</Text>
			{pendingGrabs.length === 0 && (
				<Text className="text-sm text-gray-600">No pending grabs yet.</Text>
			)}
			{pendingGrabs.map((p) => (
				<View
					key={`${p.id}-${p.status}`}
					className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3"
				>
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-base font-bold text-black">{p.title}</Text>
							<Text className="text-sm text-gray-600">from {p.donor}</Text>
						</View>
						<View
							className={`px-3 py-1 rounded-full ${
								p.status === "pending" ? "bg-yellow-100" : "bg-green-100"
							}`}
						>
							<Text
								className={`text-sm font-semibold ${
									p.status === "pending" ? "text-yellow-700" : "text-green-700"
								}`}
							>
								{p.status === "pending" ? "Awaiting approval" : "Approved"}
							</Text>
						</View>
					</View>
					{p.status === "approved" && p.location && (
						<View className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
							<View className="flex-row items-center">
								<Ionicons name="location" size={18} color="#059669" />
								<Text className="ml-2 text-green-900">
									Pickup: {p.location}
								</Text>
							</View>
						</View>
					)}
				</View>
			))}
		</ScrollView>
	);

	return (
		<View className="flex-1 bg-gray-50">
			{renderHeader()}
			<View style={{ flex: 1, marginTop: insets.top + 120 }}>
				{renderTabBar()}
				{tab === "explore" && renderExplore()}
				{tab === "my" && renderMyItems()}
				{tab === "pending" && renderPending()}

				{renderQualityInspection()}
				{renderMapView()}
			</View>
		</View>
	);
}
