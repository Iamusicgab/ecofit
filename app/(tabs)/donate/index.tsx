import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Header";

type InventoryItem = {
	id: number;
	name: string;
	status: string;
};

type Organization = {
	id: number;
	name: string;
	focus: string;
	address: string;
	distance: string;
};

export default function Donate() {
	const insets = useSafeAreaInsets();
	const [step, setStep] = useState<"select" | "org" | "pending">("select");
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [chosenOrg, setChosenOrg] = useState<Organization | null>(null);

	// Reuse the same kind of data as in `clothes/index.tsx`
	const inventoryItems: InventoryItem[] = [
		{ id: 1, name: "Shirt1", status: "Occasionally used" },
		{ id: 2, name: "Shirt2", status: "Occasionally used" },
		{ id: 3, name: "Pants1", status: "Rarely used" },
		{ id: 4, name: "Jacket1", status: "Occasionally used" },
	];

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

	const toggleSelect = (id: number) => {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		setSelected(next);
	};

	const proceedToOrg = () => {
		if (selected.size === 0) return;
		setStep("org");
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
				<View className="flex-row flex-wrap justify-between">
					{inventoryItems.map((item) => {
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
								<View className="w-full h-32 bg-gray-100 rounded-lg items-center justify-center mb-3">
									<Ionicons
										name="shirt"
										size={32}
										color={isSelected ? "#16a34a" : "#6b7280"}
									/>
								</View>
								<View className="items-center">
									<Text className="text-lg font-quicksand_bold text-black mb-1">
										{item.name}
									</Text>
									<Text className="text-sm text-gray-600 font-medium">
										{item.status}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>

				<TouchableOpacity
					disabled={selected.size === 0}
					className={`mt-2 w-full py-4 rounded-xl ${
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
						Continue ({selected.size})
					</Text>
				</TouchableOpacity>
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
						{inventoryItems
							.filter((i) => selected.has(i.id))
							.map((i) => (
								<View
									key={i.id}
									className="px-3 py-2 rounded-full bg-gray-100 border border-gray-200"
								>
									<Text className="text-sm text-gray-800">{i.name}</Text>
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
					<TouchableOpacity className="flex-1 bg-green-600 py-4 rounded-xl">
						<Text className="text-center text-white font-quicksand_bold">
							Mark as Delivered
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);

	return (
		<View className="bg-white">
			{step === "select" && SelectItems}
			{step === "org" && ChooseOrganization}
			{step === "pending" && DonatePending}
		</View>
	);
}
