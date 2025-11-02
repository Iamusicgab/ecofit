import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../components/Header";

export default function NewClothing() {
	const insets = useSafeAreaInsets();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<{
		image: string | null;
		clothingType: string;
		newlyBought: boolean | null;
		impulsivelyBought: boolean | null;
		usageFrequency: string;
	}>({
		image: null,
		clothingType: "",
		newlyBought: null,
		impulsivelyBought: null,
		usageFrequency: "",
	});

	const steps = [
		{ id: 1, title: "Let's capture your clothing!" },
		{ id: 2, title: "Proceed with this picture?" },
		{ id: 3, title: "What type of clothing?" },
		{ id: 4, title: "Is this item newly bought?" },
		{ id: 5, title: "Was the item impulsively bought?" },
		{ id: 6, title: "How frequent do you use this clothing?" },
		{ id: 7, title: "Summary" },
	];

	const handleNext = () => {
		if (currentStep < 7) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	useEffect(() => {
		(async () => {
			const { status } = await ImagePicker.requestCameraPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Permission needed",
					"Camera permission is required to capture photos of your clothing.",
					[{ text: "OK" }]
				);
			}
		})();
	}, []);

	const handleUploadPhoto = async () => {
		try {
			const { status } = await ImagePicker.getCameraPermissionsAsync();
			if (status !== "granted") {
				const { status: newStatus } =
					await ImagePicker.requestCameraPermissionsAsync();
				if (newStatus !== "granted") {
					Alert.alert(
						"Permission needed",
						"Camera permission is required to capture photos.",
						[{ text: "OK" }]
					);
					return;
				}
			}

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				const imageUri = result.assets[0].uri;
				setFormData({ ...formData, image: imageUri });
				handleNext();
			}
		} catch (error) {
			Alert.alert("Error", "Failed to capture image. Please try again.");
			console.error("Camera error:", error);
		}
	};

	const handleConfirmPicture = (confirm: boolean) => {
		if (confirm) {
			handleNext();
		} else {
			setCurrentStep(1);
		}
	};

	const handleClothingType = (type: string) => {
		setFormData({ ...formData, clothingType: type });
		handleNext();
	};

	const handleNewlyBought = (bought: boolean) => {
		setFormData({ ...formData, newlyBought: bought });
		handleNext();
	};

	const handleImpulsivelyBought = (impulsive: boolean) => {
		setFormData({ ...formData, impulsivelyBought: impulsive });
		handleNext();
	};

	const handleUsageFrequency = (frequency: string) => {
		setFormData({ ...formData, usageFrequency: frequency });
		handleNext();
	};

	const renderStep1 = () => (
		<View className="flex-1 items-center justify-center px-6 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[0].title}
			</Text>

			{/* Camera preview placeholder */}
			<View className="w-64 h-64 bg-gray-200 rounded-2xl items-center justify-center shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 overflow-hidden">
				<View className="w-full h-full items-center justify-center">
					<View className="w-48 h-48 bg-white rounded-2xl items-center justify-center border-2 border-gray-300">
						<View className="w-32 h-32 bg-orange-500 rounded-2xl items-center justify-center">
							<Ionicons name="shirt" size={60} color="white" />
						</View>
						<View className="absolute bottom-2 right-2">
							<Ionicons name="camera" size={24} color="gray" />
						</View>
					</View>
				</View>
			</View>

			<TouchableOpacity
				className="border-2 border-green px-8 py-4 rounded-2xl w-full shadow-[0_4px_0px_rgba(129,211,52,1)]"
				onPress={handleUploadPhoto}
			>
				<Text className="text-green font-quicksand_semibold text-lg text-center">
					Take Photo
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderStep2 = () => (
		<View className="flex-1 items-center justify-center px-6 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[1].title}
			</Text>

			{/* Confirmed clothing image */}
			<View className="w-64 h-64 bg-gray-200 rounded-2xl items-center justify-center shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 overflow-hidden">
				{formData.image ? (
					<Image
						source={{ uri: formData.image }}
						style={{ width: "100%", height: "100%" }}
						contentFit="cover"
					/>
				) : (
					<View className="w-48 h-48 bg-white rounded-2xl items-center justify-center border-2 border-gray-300">
						<View className="w-32 h-32 bg-orange-500 rounded-2xl items-center justify-center">
							<Ionicons name="shirt" size={60} color="white" />
						</View>
					</View>
				)}
			</View>

			<View className="flex-row gap-4 w-full">
				<TouchableOpacity
					className="flex-1 border-2 border-yellow-500 px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(250,204,21,1)]"
					onPress={() => handleConfirmPicture(false)}
				>
					<Text className="text-yellow-600 font-quicksand_semibold text-lg text-center">
						Retake
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className="flex-1 border-2 border-green px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleConfirmPicture(true)}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Confirm
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep3 = () => (
		<View className="flex-1 px-6 py-8 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[2].title}
			</Text>

			<View className="gap-4">
				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleClothingType("Upperwear")}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Upperwear
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleClothingType("Lowerwear")}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Lowerwear
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleClothingType("Addwear")}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Addwear
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep4 = () => (
		<View className="flex-1 px-6 py-8 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[3].title}
			</Text>

			<View className="gap-4">
				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleNewlyBought(true)}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Yes
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(239,68,68,1)]"
					onPress={() => handleNewlyBought(false)}
				>
					<Text className="text-red-600 font-quicksand_semibold text-lg text-center">
						No
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep5 = () => (
		<View className="flex-1 px-6 py-8 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[4].title}
			</Text>

			<View className="gap-4">
				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleImpulsivelyBought(true)}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Yes
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(239,68,68,1)]"
					onPress={() => handleImpulsivelyBought(false)}
				>
					<Text className="text-red-600 font-quicksand_semibold text-lg text-center">
						No
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep6 = () => (
		<View className="flex-1 px-6 py-8 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[5].title}
			</Text>

			<View className="gap-4">
				<TouchableOpacity
					className="border-2 border-green bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => handleUsageFrequency("Frequently")}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Frequently
					</Text>
					<Text className="text-gray-600 font-quicksand_medium text-sm text-center">
						0-5 Times a week
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-yellow-500 bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(250,204,21,1)]"
					onPress={() => handleUsageFrequency("Occasionally")}
				>
					<Text className="text-yellow-600 font-quicksand_semibold text-lg text-center">
						Occasionally
					</Text>
					<Text className="text-gray-600 font-quicksand_medium text-sm text-center">
						0-5 Times a week
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(239,68,68,1)]"
					onPress={() => handleUsageFrequency("Rarely")}
				>
					<Text className="text-red-600 font-quicksand_semibold text-lg text-center">
						Rarely
					</Text>
					<Text className="text-gray-600 font-quicksand_medium text-sm text-center">
						0-5 Times a week
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep7 = () => (
		<View className="flex-1 px-6 py-8 gap-8">
			<Text className="text-2xl font-quicksand_bold text-center">
				{steps[6].title}
			</Text>

			{/* Summary clothing image */}
			<View className="w-48 h-48 bg-gray-200 rounded-2xl items-center justify-center mx-auto shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 overflow-hidden">
				{formData.image ? (
					<Image
						source={{ uri: formData.image }}
						style={{ width: "100%", height: "100%" }}
						contentFit="cover"
					/>
				) : (
					<View className="w-32 h-32 bg-white rounded-2xl items-center justify-center border-2 border-gray-300">
						<View className="w-24 h-24 bg-orange-500 rounded-2xl items-center justify-center">
							<Ionicons name="shirt" size={40} color="white" />
						</View>
					</View>
				)}
			</View>

			{/* Summary details */}
			<View className="gap-3">
				<View className="border-4 border-green rounded-3xl p-4 shadow-[0_6px_0px_rgba(129,211,52,1)] gap-2">
					<Text className="font-quicksand_bold text-lg text-center">
						{formData.clothingType}
					</Text>
					<Text className="font-quicksand_semibold text-center">
						{formData.usageFrequency} used
					</Text>
					<Text className="font-quicksand_medium text-center">
						{formData.impulsivelyBought
							? "Impulsively bought"
							: "Not impulsively bought"}
					</Text>
				</View>
			</View>

			<View className="flex-row gap-4">
				<TouchableOpacity
					className="flex-1 border-2 border-yellow-500 px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(250,204,21,1)]"
					onPress={handleBack}
				>
					<Text className="text-yellow-600 font-quicksand_semibold text-lg text-center">
						Back
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className="flex-1 border-2 border-green px-6 py-4 rounded-2xl shadow-[0_4px_0px_rgba(129,211,52,1)]"
					onPress={() => {
						// Handle completion
						console.log("Clothing added:", formData);
					}}
				>
					<Text className="text-green font-quicksand_semibold text-lg text-center">
						Done
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return renderStep1();
			case 2:
				return renderStep2();
			case 3:
				return renderStep3();
			case 4:
				return renderStep4();
			case 5:
				return renderStep5();
			case 6:
				return renderStep6();
			case 7:
				return renderStep7();
			default:
				return renderStep1();
		}
	};

	return (
		<View className="flex-1 bg-white">
			{/* Header */}
			<Header
				title="New Clothing"
				icon={true}
				showBackButton={true}
				onBackPress={() => handleBack()}
			/>

			{/* Step Content */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100,
					paddingTop: insets.top + 80,
				}}
			>
				{renderCurrentStep()}
			</ScrollView>
		</View>
	);
}
