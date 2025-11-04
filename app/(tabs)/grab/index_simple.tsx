import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../providers/AuthProvider";
import Header from "../components/Header";

export default function Grab() {
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const [tab, setTab] = useState<"explore" | "my" | "pending">("explore");

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
			<Header title="ReWear" />
			<View style={{ flex: 1, marginTop: insets.top + 80, paddingTop: 20 }}>
				{/* Tab Bar */}
				<View className="flex-row bg-white">
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

				{/* Content */}
				<ScrollView className="flex-1 px-4 py-4">
					{tab === "explore" && (
						<View className="flex-1 items-center justify-center min-h-[400px]">
							<Ionicons name="search" size={64} color="#9CA3AF" />
							<Text className="text-lg text-gray-600 mt-4">Explore Items</Text>
							<Text className="text-sm text-gray-500 mt-2 text-center">
								Browse items from other users that are available for grab
							</Text>
							<View className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
								<Text className="text-blue-800 font-semibold">
									Coming Soon!
								</Text>
								<Text className="text-blue-600 text-sm mt-1">
									Full functionality will be available shortly
								</Text>
							</View>
						</View>
					)}

					{tab === "my" && (
						<View className="flex-1 items-center justify-center min-h-[400px]">
							<Ionicons name="shirt" size={64} color="#9CA3AF" />
							<Text className="text-lg text-gray-600 mt-4">My Items</Text>
							<Text className="text-sm text-gray-500 mt-2 text-center">
								Manage your listings and handle incoming requests
							</Text>
							<View className="mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
								<Text className="text-green-800 font-semibold">
									Coming Soon!
								</Text>
								<Text className="text-green-600 text-sm mt-1">
									List your items and manage requests here
								</Text>
							</View>
						</View>
					)}

					{tab === "pending" && (
						<View className="flex-1 items-center justify-center min-h-[400px]">
							<Ionicons name="time" size={64} color="#9CA3AF" />
							<Text className="text-lg text-gray-600 mt-4">Requests</Text>
							<Text className="text-sm text-gray-500 mt-2 text-center">
								Track your grab requests and their status
							</Text>
							<View className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
								<Text className="text-yellow-800 font-semibold">
									Coming Soon!
								</Text>
								<Text className="text-yellow-600 text-sm mt-1">
									View your outgoing requests here
								</Text>
							</View>
						</View>
					)}
				</ScrollView>
			</View>
		</View>
	);
}
