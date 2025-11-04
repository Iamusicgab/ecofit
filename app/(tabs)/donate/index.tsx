import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
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
import { ClothingItem } from "../../../types";
import Header from "../components/Header";

type Organization = {
	id: number;
	name: string;
	focus: string;
	address: string;
	distance: string;
};

export default function Donate() {
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const [step, setStep] = useState<"select" | "org" | "pending">("select");
	const [selected, setSelected] = useState<Set<string>>(new Set()); // Changed to string for clothing IDs
	const [chosenOrg, setChosenOrg] = useState<Organization | null>(null);
	const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [donating, setDonating] = useState(false);

	// Grab functionality state
	const [showGrabModal, setShowGrabModal] = useState(false);
	const [grabLocation, setGrabLocation] = useState("");
	const [grabDescription, setGrabDescription] = useState("");
	const [listingForGrab, setListingForGrab] = useState(false);

	// Fetch user's clothing items
	React.useEffect(() => {
		const fetchClothingItems = async () => {
			try {
				if (!user?.uid) {
					setLoading(false);
					return;
				}

				const items = await ClothingService.getUserClothingItems(user.uid);
				setClothingItems(items);
			} catch (error) {
				console.error("Error fetching clothing items:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchClothingItems();
		} else {
			setLoading(false);
		}
	}, [user]);

	// Refresh data when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			if (user?.uid) {
				setLoading(true);
				ClothingService.getUserClothingItems(user.uid)
					.then((items) => {
						setClothingItems(items);
					})
					.catch((error) => {
						console.error("Error refreshing clothing items:", error);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		}, [user])
	);

	const organizations: Organization[] = [
		{
			id: 1,
			name: "Green Threads Foundation",
			focus: "Disaster relief clothing",
			address: "123 Riverside Ave, City Center",
			distance: "0.6 km",
		},
		{
			id: 2,
			name: "Warm Hearts NGO",
			focus: "Homeless outreach",
			address: "45 Oak Street, Midtown",
			distance: "1.1 km",
		},
		{
			id: 3,
			name: "Ask Helps",
			focus: "Calamity response",
			address: "88 Pine Road, West District",
			distance: "1.8 km",
		},
	];

	const toggleSelect = (id: string) => {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		setSelected(next);
	};

	const proceedToOrg = () => {
		if (selected.size === 0) return;
		setStep("org");
	};

	const proceedToGrab = () => {
		if (selected.size === 0) return;
		console.log(
			"Opening grab modal with selected items:",
			Array.from(selected)
		);
		console.log("Clothing items:", clothingItems.length);
		setShowGrabModal(true);
	};

	const handleGrabListing = async () => {
		if (!user?.uid || selected.size === 0 || !grabLocation.trim()) return;

		setListingForGrab(true);
		try {
			// List each selected item for grab
			const listingPromises = Array.from(selected).map((itemId) =>
				ClothingService.listItemForGrab(
					itemId,
					user.uid,
					user.displayName || user.email || "Anonymous",
					grabLocation.trim(),
					grabDescription.trim() || undefined
				)
			);

			await Promise.all(listingPromises);

			// Refresh clothing list
			const updatedItems = await ClothingService.getUserClothingItems(user.uid);
			setClothingItems(updatedItems);

			// Reset state
			setSelected(new Set());
			setGrabLocation("");
			setGrabDescription("");
			setShowGrabModal(false);

			Alert.alert(
				"Success!",
				`${
					Array.from(selected).length
				} item(s) listed for grab. Others can now request these items.`
			);
		} catch (error) {
			console.error("Error listing items for grab:", error);
			Alert.alert("Error", "Failed to list items for grab. Please try again.");
		} finally {
			setListingForGrab(false);
		}
	};

	const chooseOrg = (org: Organization) => {
		setChosenOrg(org);
		setStep("pending");
	};

	const resetDonation = () => {
		setSelected(new Set());
		setChosenOrg(null);
		setStep("select");
	};

	const completeDonation = async () => {
		if (!user?.uid || selected.size === 0 || !chosenOrg) return;

		setDonating(true);
		try {
			// Use the new donation method that handles everything
			await ClothingService.donateClothingItems(Array.from(selected));
			console.log(`Donated ${selected.size} items to ${chosenOrg.name}`);

			// Refresh clothing list
			const updatedItems = await ClothingService.getUserClothingItems(user.uid);
			setClothingItems(updatedItems);

			// Reset state
			resetDonation();
		} catch (error) {
			console.error("Error completing donation:", error);
		} finally {
			setDonating(false);
		}
	};

	const getStatusText = (item: ClothingItem) => {
		const frequency = item.usageFrequency;
		const score = item.currentScore;

		if (frequency === "frequently") return `Frequently used • ${score}pts`;
		if (frequency === "occasionally") return `Occasionally used • ${score}pts`;
		return `Rarely used • ${score}pts`;
	};

	const HeaderBar = (
		<Header
			title={
				step === "select"
					? "Donate"
					: step === "org"
					? "Choose Organization"
					: "Donate Pending"
			}
		/>
	);

	const SelectItems = (
		<View className="bg-white">
			{HeaderBar}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				<Text className="text-xl font-quicksand_bold mb-4">
					Choose items to donate
				</Text>
				{loading ? (
					<View className="flex-1 justify-center items-center py-20">
						<Text className="text-gray-500 font-quicksand_medium">
							Loading your clothes...
						</Text>
					</View>
				) : clothingItems.length === 0 ? (
					<View className="flex-1 justify-center items-center py-20">
						<Text className="text-gray-500 font-quicksand_medium text-center">
							No clothes available to donate.{"\n"}
							Add some items first!
						</Text>
					</View>
				) : (
					<View className="flex-row flex-wrap justify-between">
						{clothingItems.map((item) => {
							const isSelected = selected.has(item.id);
							return (
								<TouchableOpacity
									key={item.id}
									className={`w-[48%] mb-4 rounded-2xl p-4 border-2 shadow-[0_6px_0px_rgba(229,231,235,1)] ${
										isSelected
											? "border-green bg-green-50"
											: "border-gray-200 bg-white"
									}`}
									onPress={() => toggleSelect(item.id)}
								>
									<View className="flex-1 justify-center items-center">
										<Image
											source={item.imageUrl}
											style={{
												width: "100%",
												height: 130,
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

									<View className="items-center">
										<Text className="text-lg font-quicksand_bold text-black mb-1">
											{item.clothingType.charAt(0).toUpperCase() +
												item.clothingType.slice(1)}
										</Text>
										<Text className="text-sm text-gray-600 font-medium">
											{getStatusText(item)}
										</Text>
									</View>
								</TouchableOpacity>
							);
						})}
					</View>
				)}

				<View className="gap-4 mt-2">
					{/* Donate Button */}
					<TouchableOpacity
						disabled={selected.size === 0}
						className={`w-full py-4 rounded-xl ${
							selected.size === 0
								? "border-2 border-gray-300 shadow-[0_6px_0px_rgba(229,231,235,1)]"
								: "border-2 border-green shadow-[0_6px_0px_rgba(129,211,52,1)]"
						}`}
						onPress={proceedToOrg}
					>
						<Text
							className={`text-center font-quicksand_bold text-lg ${
								selected.size === 0 ? "text-gray-300" : "text-green"
							}`}
						>
							Donate ({selected.size})
						</Text>
					</TouchableOpacity>

					{/* Put up for Grab Button */}
					<TouchableOpacity
						disabled={selected.size === 0}
						className={`w-full py-4 rounded-xl ${
							selected.size === 0
								? "border-2 border-gray-300 shadow-[0_6px_0px_rgba(229,231,235,1)]"
								: "border-2 border-blue-500 shadow-[0_6px_0px_rgba(59,130,246,1)]"
						}`}
						onPress={proceedToGrab}
					>
						<Text
							className={`text-center font-quicksand_bold text-lg ${
								selected.size === 0 ? "text-gray-300" : "text-blue-500"
							}`}
						>
							Put up for Grab ({selected.size})
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);

	const ChooseOrganization = (
		<View className=" bg-white">
			{HeaderBar}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				<View className="gap-3">
					{organizations.map((org) => (
						<TouchableOpacity
							key={org.id}
							className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-[0_6px_0px_rgba(229,231,235,1)]"
							onPress={() => chooseOrg(org)}
						>
							<View className="flex-row items-center justify-between">
								<View>
									<Text className="text-lg font-quicksand_bold text-black">
										{org.name}
									</Text>
									<Text className="text-sm text-gray-600">{org.focus}</Text>
									<View className="flex-row items-center mt-1">
										<Ionicons name="location" size={16} color="#10B981" />
										<Text className="text-sm text-gray-700 ml-1">
											{org.address}
										</Text>
									</View>
								</View>
								<View className="items-end">
									<Text className="text-sm text-green-700 font-quicksand_semibold">
										{org.distance}
									</Text>
									<View className="mt-2 bg-green-600 rounded-full px-3 py-1">
										<Text className="text-white font-quicksand_bold">
											Donate here
										</Text>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity className="mt-4" onPress={() => setStep("select")}>
					<Text className="text-center text-gray-600">
						Back to item selection
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);

	const DonatePending = (
		<View className="bg-white">
			{HeaderBar}
			<ScrollView
				className="px-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				<Text className="text-gray-700 mb-6">
					Bring the items to the drop-off location below.
				</Text>

				{/* Selected items summary */}
				<View className="mb-6">
					<Text className="text-lg font-quicksand_semibold mb-2">Items</Text>
					<View className="flex-row flex-wrap gap-2">
						{clothingItems
							.filter((item) => selected.has(item.id))
							.map((item) => (
								<View
									key={item.id}
									className="px-3 py-2 rounded-full bg-gray-100 border border-gray-200"
								>
									<Text className="text-sm text-gray-800">
										{item.clothingType.charAt(0).toUpperCase() +
											item.clothingType.slice(1)}
									</Text>
								</View>
							))}
					</View>
				</View>

				{/* Organization and location */}
				{chosenOrg && (
					<View className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
						<Text className="text-lg font-quicksand_bold text-green-800">
							{chosenOrg.name}
						</Text>
						<Text className="text-sm text-green-800 mt-1">
							{chosenOrg.focus}
						</Text>
						<View className="flex-row items-center mt-3">
							<Ionicons name="location" size={18} color="#059669" />
							<Text className="ml-2 text-base text-green-900">
								{chosenOrg.address}
							</Text>
						</View>
						<Text className="mt-2 text-sm text-green-900">
							Approx. {chosenOrg.distance} away
						</Text>
					</View>
				)}

				<View className="flex-row gap-2">
					<TouchableOpacity
						className="flex-1 bg-gray-200 py-4 rounded-xl"
						onPress={resetDonation}
					>
						<Text className="text-center text-gray-800 font-quicksand_bold">
							Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="flex-1 bg-green-600 py-4 rounded-xl"
						onPress={completeDonation}
						disabled={donating}
					>
						<Text className="text-center text-white font-quicksand_bold">
							{donating ? "Donating..." : "Mark as Delivered"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);

	const GrabModal = (
		<Modal
			visible={showGrabModal}
			animationType="slide"
			transparent={false}
			presentationStyle="pageSheet"
		>
			<SafeAreaView className="bg-white flex-1" style={{ flex: 1 }}>
				<View className="px-4 py-6 flex-1" style={{ flex: 1 }}>
					<View className="flex-row items-center justify-between mb-6">
						<Text className="text-2xl font-quicksand_bold text-black">
							Put up for Grab
						</Text>
						<TouchableOpacity
							onPress={() => {
								console.log("Closing grab modal");
								setShowGrabModal(false);
							}}
						>
							<Ionicons name="close" size={24} color="black" />
						</TouchableOpacity>
					</View>

					{/* Debug info */}
					<Text className="text-sm text-gray-600 mb-4">
						Selected: {selected.size} items, Total items: {clothingItems.length}
					</Text>

					{/* Selected items summary */}
					<View className="mb-6">
						<Text className="text-lg font-quicksand_semibold mb-3">
							Selected Items ({selected.size})
						</Text>
						<View className="flex-row flex-wrap gap-2">
							{clothingItems
								.filter((item) => selected.has(item.id))
								.map((item) => (
									<View
										key={item.id}
										className="px-3 py-2 rounded-full bg-blue-100 border border-blue-200"
									>
										<Text className="text-sm text-blue-800 font-quicksand_medium">
											{item.clothingType.charAt(0).toUpperCase() +
												item.clothingType.slice(1)}
										</Text>
									</View>
								))}
						</View>
					</View>

					{/* Location Input */}
					<View className="mb-4">
						<Text className="text-lg font-quicksand_semibold text-black mb-2">
							Pickup Location *
						</Text>
						<TextInput
							className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-quicksand_medium"
							placeholder="e.g., Coffee shop on Main St, My office lobby"
							value={grabLocation}
							onChangeText={setGrabLocation}
							multiline
						/>
					</View>

					{/* Description Input */}
					<View className="mb-6">
						<Text className="text-lg font-quicksand_semibold text-black mb-2">
							Description (Optional)
						</Text>
						<TextInput
							className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-quicksand_medium"
							placeholder="Additional details about the items..."
							value={grabDescription}
							onChangeText={setGrabDescription}
							multiline
							numberOfLines={3}
						/>
					</View>

					{/* Action Buttons */}
					<View className="flex-row gap-4 mt-auto">
						<TouchableOpacity
							className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300"
							onPress={() => setShowGrabModal(false)}
						>
							<Text className="text-center text-gray-700 text-lg font-quicksand_bold">
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className={`flex-1 px-6 py-4 rounded-xl border-2 ${
								grabLocation.trim()
									? "border-blue-500 bg-blue-50"
									: "border-gray-300 bg-gray-100"
							}`}
							onPress={handleGrabListing}
							disabled={!grabLocation.trim() || listingForGrab}
						>
							<Text
								className={`text-center text-lg font-quicksand_bold ${
									grabLocation.trim() ? "text-blue-500" : "text-gray-500"
								}`}
							>
								{listingForGrab ? "Listing..." : "List for Grab"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);

	return (
		<View className="bg-white">
			{step === "select" && SelectItems}
			{step === "org" && ChooseOrganization}
			{step === "pending" && DonatePending}
			{GrabModal}
		</View>
	);
}
