import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../../providers/AuthProvider";
import { ClothingService } from "../../../services/clothingService";
import { ClothingItem, GrabItem, GrabRequest } from "../../../types";
import Header from "../components/Header";

export default function Grab() {
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const [selectedItem, setSelectedItem] = useState<
		(GrabItem & { clothingItem: ClothingItem }) | null
	>(null);
	const [showQualityInspection, setShowQualityInspection] = useState(false);
	const [showListModal, setShowListModal] = useState(false);
	const [filter, setFilter] = useState("all");
	const [tab, setTab] = useState<"explore" | "my" | "pending">("explore");

	// State for grab functionality
	const [availableItems, setAvailableItems] = useState<
		(GrabItem & { clothingItem: ClothingItem })[]
	>([]);
	const [myListings, setMyListings] = useState<
		(GrabItem & { clothingItem: ClothingItem })[]
	>([]);
	const [myRequests, setMyRequests] = useState<
		(GrabRequest & { grabItem: GrabItem & { clothingItem: ClothingItem } })[]
	>([]);
	const [incomingRequests, setIncomingRequests] = useState<
		(GrabRequest & { grabItem: GrabItem & { clothingItem: ClothingItem } })[]
	>([]);
	const [myClothingItems, setMyClothingItems] = useState<ClothingItem[]>([]);
	const [loading, setLoading] = useState(false);

	// List item modal state
	const [selectedClothingItem, setSelectedClothingItem] =
		useState<ClothingItem | null>(null);
	const [listLocation, setListLocation] = useState("");
	const [listDescription, setListDescription] = useState("");

	const loadData = useCallback(async () => {
		if (!user) return;

		setLoading(true);
		try {
			if (tab === "explore") {
				const items = await ClothingService.getAvailableGrabItems(user.uid);
				setAvailableItems(items);
			} else if (tab === "my") {
				const [listings, clothingItems, requests] = await Promise.all([
					ClothingService.getUserGrabListings(user.uid),
					ClothingService.getUserClothingItems(user.uid),
					ClothingService.getGrabRequestsForOwner(user.uid),
				]);
				setMyListings(listings);
				setMyClothingItems(
					clothingItems.filter(
						(item) =>
							!listings.some((listing) => listing.clothingItemId === item.id)
					)
				);
				setIncomingRequests(requests);
			} else if (tab === "pending") {
				const requests = await ClothingService.getUserGrabRequests(user.uid);
				setMyRequests(requests);
			}
		} catch (error) {
			console.error("Error loading grab data:", error);
			Alert.alert("Error", "Failed to load data. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [user, tab]);

	useEffect(() => {
		if (user) {
			loadData();
		}
	}, [user, tab, loadData]);

	const filteredItems = availableItems.filter((item) => {
		if (filter === "all") return true;
		return item.clothingItem.clothingType === filter;
	});

	const handleGrabRequest = async (
		item: GrabItem & { clothingItem: ClothingItem }
	) => {
		if (!user) return;

		Alert.alert(
			"Request Item",
			`Send a grab request for "${item.clothingItem.clothingType}" from ${item.ownerName}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Request",
					onPress: async () => {
						try {
							setLoading(true);
							await ClothingService.requestGrabItem(
								item.id,
								user.uid,
								user.displayName || user.email || "Anonymous"
							);
							setShowQualityInspection(false);
							setTab("pending");
							Alert.alert("Success", "Grab request sent!");
						} catch (error) {
							console.error("Error requesting grab:", error);
							Alert.alert("Error", "Failed to send request. Please try again.");
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};

	const handleListItem = async () => {
		if (!user || !selectedClothingItem || !listLocation.trim()) return;

		try {
			setLoading(true);
			await ClothingService.listItemForGrab(
				selectedClothingItem.id,
				user.uid,
				user.displayName || user.email || "Anonymous",
				listLocation.trim(),
				listDescription.trim() || undefined
			);
			setShowListModal(false);
			setSelectedClothingItem(null);
			setListLocation("");
			setListDescription("");
			Alert.alert("Success", "Item listed for grab!");
			loadData(); // Refresh data
		} catch (error) {
			console.error("Error listing item:", error);
			Alert.alert("Error", "Failed to list item. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleApproveRequest = async (requestId: string) => {
		if (!user) return;

		Alert.alert(
			"Approve Request",
			"Are you sure you want to approve this grab request? This will transfer ownership of the item.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Approve",
					onPress: async () => {
						try {
							setLoading(true);
							await ClothingService.approveGrabRequest(requestId, user.uid);
							Alert.alert(
								"Success",
								"Request approved! Ownership transferred."
							);
							loadData(); // Refresh data
						} catch (error) {
							console.error("Error approving request:", error);
							Alert.alert(
								"Error",
								"Failed to approve request. Please try again."
							);
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};

	const handleDenyRequest = async (requestId: string) => {
		if (!user) return;

		Alert.alert(
			"Deny Request",
			"Are you sure you want to deny this grab request?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Deny",
					onPress: async () => {
						try {
							setLoading(true);
							await ClothingService.denyGrabRequest(requestId, user.uid);
							Alert.alert("Success", "Request denied.");
							loadData(); // Refresh data
						} catch (error) {
							console.error("Error denying request:", error);
							Alert.alert("Error", "Failed to deny request. Please try again.");
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};

	const handleRemoveListing = async (grabItemId: string) => {
		if (!user) return;

		Alert.alert(
			"Remove Listing",
			"Are you sure you want to remove this item from grab listings?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					onPress: async () => {
						try {
							setLoading(true);
							await ClothingService.removeGrabListing(grabItemId, user.uid);
							Alert.alert("Success", "Listing removed.");
							loadData(); // Refresh data
						} catch (error) {
							console.error("Error removing listing:", error);
							Alert.alert(
								"Error",
								"Failed to remove listing. Please try again."
							);
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};
	const renderHeader = () => <Header title="ReWear" />;

	const renderTabBar = () => (
		<View className="flex-row">
			{[
				{ key: "explore", label: "Explore" },
				{ key: "my", label: "My Items" },
				{ key: "pending", label: "Requests" },
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
					{["all", "upperwear", "lowerwear", "accessories"].map((category) => (
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

	const renderItemCard = (item: GrabItem & { clothingItem: ClothingItem }) => (
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
				<View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-4 overflow-hidden">
					{item.clothingItem.imageUrl ? (
						<Image
							source={{ uri: item.clothingItem.imageUrl }}
							style={{
								width: "100%",
								height: "100%",
								borderRadius: 8,
							}}
							contentFit="cover"
						/>
					) : (
						<View className="w-16 h-16 bg-orange-500 rounded-lg items-center justify-center">
							<Ionicons name="shirt" size={32} color="white" />
						</View>
					)}
				</View>

				{/* Item Details */}
				<View className="flex-1">
					<Text className="text-lg font-bold text-black mb-1">
						{item.clothingItem.clothingType}
					</Text>
					<Text className="text-sm text-gray-600 mb-2">
						{item.description || "Available for grab"}
					</Text>

					{/* Owner and Location */}
					<View className="flex-row items-center mb-2">
						<Ionicons name="person" size={16} color="#6B7280" />
						<Text className="text-sm text-gray-600 ml-1">{item.ownerName}</Text>
						<Ionicons
							name="location"
							size={16}
							color="#6B7280"
							style={{ marginLeft: 12 }}
						/>
						<Text className="text-sm text-gray-600 ml-1">{item.location}</Text>
					</View>

					{/* Date and Score */}
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center">
							<Ionicons name="calendar" size={16} color="#10B981" />
							<Text className="text-sm text-green-600 ml-1">
								Listed {item.listedAt.toLocaleDateString()}
							</Text>
						</View>
						<View className="flex-row items-center">
							<Ionicons name="star" size={16} color="#FCD34D" />
							<Text className="text-sm text-gray-600 ml-1">
								{item.clothingItem.currentScore.toFixed(1)}
							</Text>
						</View>
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
						{/* Item Image */}
						<View className="w-full h-64 bg-gray-100 rounded-xl items-center justify-center mb-6 overflow-hidden">
							{selectedItem.clothingItem.imageUrl ? (
								<Image
									source={{ uri: selectedItem.clothingItem.imageUrl }}
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 12,
									}}
									contentFit="cover"
								/>
							) : (
								<View className="w-48 h-48 bg-orange-500 rounded-xl items-center justify-center">
									<Ionicons name="shirt" size={80} color="white" />
								</View>
							)}
						</View>

						{/* Item Details */}
						<View className="mb-6">
							<Text className="text-2xl font-bold text-black mb-2">
								{selectedItem.clothingItem.clothingType}
							</Text>
							<Text className="text-lg text-gray-600 mb-4">
								{selectedItem.description || "Available for grab"}
							</Text>

							<View className="flex-row items-center justify-between mb-4">
								<Text className="text-lg font-semibold text-green-600">
									Listed by {selectedItem.ownerName}
								</Text>
								<View className="flex-row items-center">
									<Ionicons name="star" size={20} color="#FCD34D" />
									<Text className="text-lg font-bold text-black ml-1">
										{selectedItem.clothingItem.currentScore.toFixed(1)}
									</Text>
								</View>
							</View>
						</View>

						{/* Item Stats */}
						<View className="mb-6">
							<Text className="text-xl font-bold text-black mb-4">
								Item Information
							</Text>

							<View className="space-y-3">
								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Type</Text>
									<Text className="text-lg font-semibold text-green-600">
										{selectedItem.clothingItem.clothingType}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Usage Frequency</Text>
									<Text className="text-lg font-semibold text-yellow-600">
										{selectedItem.clothingItem.usageFrequency}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">EcoFit Score</Text>
									<Text className="text-lg font-bold text-green-600">
										{selectedItem.clothingItem.currentScore.toFixed(1)}
									</Text>
								</View>

								<View className="flex-row items-center justify-between">
									<Text className="text-lg text-gray-700">Added</Text>
									<Text className="text-lg font-semibold text-gray-600">
										{selectedItem.clothingItem.createdAt.toLocaleDateString()}
									</Text>
								</View>
							</View>
						</View>

						{/* Pickup Location */}
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
								<Text className="text-sm text-gray-600">
									Contact {selectedItem.ownerName} for pickup details
								</Text>
							</View>
						</View>

						{/* Action Buttons */}
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
								onPress={() => handleGrabRequest(selectedItem)}
								disabled={loading}
							>
								<Text className="text-center text-green text-lg font-bold">
									{loading ? "Sending..." : "Request"}
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
		</Modal>
	);

	const renderListModal = () => (
		<Modal visible={showListModal} animationType="slide" transparent={false}>
			<SafeAreaView className="bg-white flex-1">
				<View className="px-4 py-6 flex-1">
					<View className="flex-row items-center justify-between mb-6">
						<Text className="text-2xl font-bold text-black">
							List Item for Grab
						</Text>
						<TouchableOpacity onPress={() => setShowListModal(false)}>
							<Ionicons name="close" size={24} color="black" />
						</TouchableOpacity>
					</View>

					{selectedClothingItem && (
						<>
							{/* Selected Item Preview */}
							<View className="bg-gray-50 rounded-xl p-4 mb-6">
								<View className="flex-row items-center">
									<View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mr-4 overflow-hidden">
										{selectedClothingItem.imageUrl ? (
											<Image
												source={{ uri: selectedClothingItem.imageUrl }}
												style={{
													width: "100%",
													height: "100%",
													borderRadius: 8,
												}}
												contentFit="cover"
											/>
										) : (
											<View className="w-14 h-14 bg-orange-500 rounded-lg items-center justify-center">
												<Ionicons name="shirt" size={28} color="white" />
											</View>
										)}
									</View>
									<View className="flex-1">
										<Text className="text-lg font-bold text-black">
											{selectedClothingItem.clothingType}
										</Text>
										<Text className="text-sm text-gray-600">
											EcoFit Score:{" "}
											{selectedClothingItem.currentScore.toFixed(1)}
										</Text>
									</View>
								</View>
							</View>

							{/* Location Input */}
							<View className="mb-4">
								<Text className="text-lg font-semibold text-black mb-2">
									Pickup Location *
								</Text>
								<TextInput
									className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base"
									placeholder="e.g., Coffee shop on Main St, My office lobby"
									value={listLocation}
									onChangeText={setListLocation}
									multiline
								/>
							</View>

							{/* Description Input */}
							<View className="mb-6">
								<Text className="text-lg font-semibold text-black mb-2">
									Description (Optional)
								</Text>
								<TextInput
									className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base"
									placeholder="Additional details about the item..."
									value={listDescription}
									onChangeText={setListDescription}
									multiline
									numberOfLines={3}
								/>
							</View>

							{/* Action Buttons */}
							<View className="flex-row gap-4 mt-auto">
								<TouchableOpacity
									className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300"
									onPress={() => setShowListModal(false)}
								>
									<Text className="text-center text-gray-700 text-lg font-bold">
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className={`flex-1 px-6 py-4 rounded-xl border-2 ${
										listLocation.trim()
											? "border-green bg-green-50"
											: "border-gray-300 bg-gray-100"
									}`}
									onPress={handleListItem}
									disabled={!listLocation.trim() || loading}
								>
									<Text
										className={`text-center text-lg font-bold ${
											listLocation.trim() ? "text-green" : "text-gray-500"
										}`}
									>
										{loading ? "Listing..." : "List Item"}
									</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
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
				{loading ? (
					<View className="items-center justify-center py-8">
						<ActivityIndicator size="large" color="#10B981" />
						<Text className="text-gray-600 mt-2">Loading items...</Text>
					</View>
				) : (
					<>
						<View className="mb-4">
							<Text className="text-lg font-bold text-black mb-2">
								{filteredItems.length} items available
							</Text>
							<Text className="text-sm text-gray-600">
								Tap an item to view details and send a grab request
							</Text>
						</View>
						{filteredItems.map(renderItemCard)}
						{filteredItems.length === 0 && (
							<View className="items-center justify-center py-8">
								<Ionicons name="shirt-outline" size={64} color="#9CA3AF" />
								<Text className="text-gray-500 text-lg mt-4">
									No items available
								</Text>
								<Text className="text-gray-400 text-sm">
									Check back later for new listings
								</Text>
							</View>
						)}
					</>
				)}
			</ScrollView>
		</>
	);

	const renderMyItems = () => (
		<ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
			{loading ? (
				<View className="items-center justify-center py-8">
					<ActivityIndicator size="large" color="#10B981" />
					<Text className="text-gray-600 mt-2">Loading...</Text>
				</View>
			) : (
				<>
					{/* Items available to list */}
					<View className="mb-6">
						<Text className="text-lg font-bold text-black mb-3">
							List Items for Grab
						</Text>
						{myClothingItems.length > 0 ? (
							myClothingItems.map((item) => (
								<TouchableOpacity
									key={item.id}
									className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3"
									onPress={() => {
										setSelectedClothingItem(item);
										setShowListModal(true);
									}}
								>
									<View className="flex-row items-center">
										<View className="w-16 h-16 bg-green-100 rounded-lg items-center justify-center mr-4 overflow-hidden">
											{item.imageUrl ? (
												<Image
													source={{ uri: item.imageUrl }}
													style={{
														width: "100%",
														height: "100%",
														borderRadius: 8,
													}}
													contentFit="cover"
												/>
											) : (
												<View className="w-14 h-14 bg-green-500 rounded-lg items-center justify-center">
													<Ionicons name="shirt" size={28} color="#059669" />
												</View>
											)}
										</View>
										<View className="flex-1">
											<Text className="text-lg font-bold text-black mb-1">
												{item.clothingType}
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												EcoFit Score: {item.currentScore.toFixed(1)}
											</Text>
											<Text className="text-sm text-green-600">
												Tap to list for grab
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							))
						) : (
							<Text className="text-gray-500 text-center py-4">
								No items available to list
							</Text>
						)}
					</View>

					{/* Current listings */}
					<View className="mb-6">
						<Text className="text-lg font-bold text-black mb-3">
							Your Current Listings
						</Text>
						{myListings.map((item) => (
							<View
								key={item.id}
								className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4"
							>
								<View className="flex-row items-start">
									<View className="w-16 h-16 bg-orange-100 rounded-lg items-center justify-center mr-4 overflow-hidden">
										{item.clothingItem.imageUrl ? (
											<Image
												source={{ uri: item.clothingItem.imageUrl }}
												style={{
													width: "100%",
													height: "100%",
													borderRadius: 8,
												}}
												contentFit="cover"
											/>
										) : (
											<View className="w-14 h-14 bg-orange-500 rounded-lg items-center justify-center">
												<Ionicons name="shirt" size={28} color="#EA580C" />
											</View>
										)}
									</View>
									<View className="flex-1">
										<Text className="text-lg font-bold text-black mb-1">
											{item.clothingItem.clothingType}
										</Text>
										<Text className="text-sm text-gray-600 mb-2">
											{item.description || "Listed for grab"}
										</Text>
										<View className="flex-row items-center justify-between">
											<Text className="text-sm text-gray-600">
												📍 {item.location}
											</Text>
											<TouchableOpacity
												className="px-3 py-2 rounded-lg border-2 border-red-300"
												onPress={() => handleRemoveListing(item.id)}
											>
												<Text className="text-red-600 font-bold">Remove</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						))}
					</View>

					{/* Incoming requests */}
					<View>
						<Text className="text-lg font-bold text-black mb-3">
							Incoming Requests
						</Text>
						{incomingRequests
							.filter((req) => req.status === "pending")
							.map((request) => (
								<View
									key={request.id}
									className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200 mb-3"
								>
									<View className="flex-row items-center justify-between mb-3">
										<View>
											<Text className="text-base font-bold text-black">
												{request.grabItem.clothingItem.clothingType}
											</Text>
											<Text className="text-sm text-gray-600">
												Request from {request.requesterName}
											</Text>
										</View>
										<Text className="text-xs text-blue-600">
											{request.requestedAt.toLocaleDateString()}
										</Text>
									</View>
									<View className="flex-row gap-3">
										<TouchableOpacity
											className="flex-1 px-4 py-2 rounded-lg border-2 border-red-300"
											onPress={() => handleDenyRequest(request.id)}
										>
											<Text className="text-center text-red-600 font-bold">
												Deny
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											className="flex-1 px-4 py-2 rounded-lg border-2 border-green"
											onPress={() => handleApproveRequest(request.id)}
										>
											<Text className="text-center text-green font-bold">
												Approve
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}
						{incomingRequests.filter((req) => req.status === "pending")
							.length === 0 && (
							<Text className="text-gray-500 text-center py-4">
								No pending requests
							</Text>
						)}
					</View>
				</>
			)}
		</ScrollView>
	);

	const renderPending = () => (
		<ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
			{loading ? (
				<View className="items-center justify-center py-8">
					<ActivityIndicator size="large" color="#10B981" />
					<Text className="text-gray-600 mt-2">Loading requests...</Text>
				</View>
			) : (
				<>
					<Text className="text-lg font-bold text-black mb-3">
						Your Grab Requests
					</Text>
					{myRequests.length === 0 ? (
						<View className="items-center justify-center py-8">
							<Ionicons name="time-outline" size={64} color="#9CA3AF" />
							<Text className="text-gray-500 text-lg mt-4">
								No requests yet
							</Text>
							<Text className="text-gray-400 text-sm">
								Send a grab request to see it here
							</Text>
						</View>
					) : (
						myRequests.map((request) => (
							<View
								key={request.id}
								className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3"
							>
								<View className="flex-row items-center justify-between">
									<View>
										<Text className="text-base font-bold text-black">
											{request.grabItem.clothingItem.clothingType}
										</Text>
										<Text className="text-sm text-gray-600">
											from {request.grabItem.ownerName}
										</Text>
									</View>
									<View
										className={`px-3 py-1 rounded-full ${
											request.status === "pending"
												? "bg-yellow-100"
												: request.status === "approved"
												? "bg-green-100"
												: "bg-red-100"
										}`}
									>
										<Text
											className={`text-sm font-semibold ${
												request.status === "pending"
													? "text-yellow-700"
													: request.status === "approved"
													? "text-green-700"
													: "text-red-700"
											}`}
										>
											{request.status === "pending"
												? "Pending"
												: request.status === "approved"
												? "Approved"
												: "Denied"}
										</Text>
									</View>
								</View>
								{request.status === "approved" && (
									<View className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
										<View className="flex-row items-center">
											<Ionicons name="location" size={18} color="#059669" />
											<Text className="ml-2 text-green-900">
												Pickup: {request.grabItem.location}
											</Text>
										</View>
									</View>
								)}
							</View>
						))
					)}
				</>
			)}
		</ScrollView>
	);

	if (!user) {
		return (
			<View className="flex-1 bg-gray-50 items-center justify-center">
				<Text className="text-lg text-gray-600">
					Please sign in to use grab features
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gray-50">
			{renderHeader()}
			<View style={{ flex: 1, marginTop: insets.top + 120 }}>
				{renderTabBar()}
				{tab === "explore" && renderExplore()}
				{tab === "my" && renderMyItems()}
				{tab === "pending" && renderPending()}

				{renderQualityInspection()}
				{renderListModal()}
			</View>
		</View>
	);
}
