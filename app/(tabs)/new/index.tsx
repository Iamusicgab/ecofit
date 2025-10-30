import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewClothing() {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
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

	const handleUploadPhoto = () => {
		// Simulate photo upload
		setFormData({ ...formData, image: "placeholder" });
		handleNext();
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
		<View className="flex-1 items-center justify-center px-6">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[0].title}
			</Text>
			
			{/* T-shirt placeholder */}
			<View className="w-64 h-64 bg-gray-200 rounded-lg items-center justify-center mb-8">
				<View className="w-48 h-48 bg-white rounded-lg items-center justify-center border-2 border-gray-300">
					<View className="w-32 h-32 bg-orange-500 rounded-lg items-center justify-center">
						<Ionicons name="shirt" size={60} color="white" />
					</View>
					<View className="absolute bottom-2 right-2">
						<Ionicons name="camera" size={24} color="gray" />
					</View>
				</View>
			</View>

			<TouchableOpacity 
				className="bg-green-500 px-8 py-4 rounded-lg w-full"
				onPress={handleUploadPhoto}
			>
				<Text className="text-white text-lg font-bold text-center">Upload Photo</Text>
			</TouchableOpacity>
		</View>
	);

	const renderStep2 = () => (
		<View className="flex-1 items-center justify-center px-6">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[1].title}
			</Text>
			
			{/* Confirmed t-shirt image */}
			<View className="w-64 h-64 bg-gray-200 rounded-lg items-center justify-center mb-8">
				<View className="w-48 h-48 bg-white rounded-lg items-center justify-center border-2 border-gray-300">
					<View className="w-32 h-32 bg-orange-500 rounded-lg items-center justify-center">
						<Ionicons name="shirt" size={60} color="white" />
					</View>
				</View>
			</View>

			<View className="flex-row gap-4 w-full">
				<TouchableOpacity 
					className="flex-1 border-2 border-yellow-500 px-6 py-4 rounded-lg"
					onPress={() => handleConfirmPicture(false)}
				>
					<Text className="text-yellow-600 text-lg font-bold text-center">Retake</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					className="flex-1 border-2 border-green-500 px-6 py-4 rounded-lg"
					onPress={() => handleConfirmPicture(true)}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Confirm</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep3 = () => (
		<View className="flex-1 px-6 py-8">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[2].title}
			</Text>
			
			<View className="space-y-4">
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleClothingType("Upperwear")}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Upperwear</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleClothingType("Lowerwear")}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Lowerwear</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleClothingType("Addwear")}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Addwear</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep4 = () => (
		<View className="flex-1 px-6 py-8">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[3].title}
			</Text>
			
			<View className="space-y-4">
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleNewlyBought(true)}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Yes</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleNewlyBought(false)}
				>
					<Text className="text-red-600 text-lg font-bold text-center">No</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep5 = () => (
		<View className="flex-1 px-6 py-8">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[4].title}
			</Text>
			
			<View className="space-y-4">
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleImpulsivelyBought(true)}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Yes</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleImpulsivelyBought(false)}
				>
					<Text className="text-red-600 text-lg font-bold text-center">No</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep6 = () => (
		<View className="flex-1 px-6 py-8">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[5].title}
			</Text>
			
			<View className="space-y-4">
				<TouchableOpacity 
					className="border-2 border-green-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleUsageFrequency("Frequently")}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Frequently</Text>
					<Text className="text-gray-600 text-sm text-center">0-5 Times a week</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-yellow-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleUsageFrequency("Occasionally")}
				>
					<Text className="text-yellow-600 text-lg font-bold text-center">Occasionally</Text>
					<Text className="text-gray-600 text-sm text-center">0-5 Times a week</Text>
				</TouchableOpacity>
				
				<TouchableOpacity 
					className="border-2 border-red-500 bg-white px-6 py-4 rounded-lg"
					onPress={() => handleUsageFrequency("Rarely")}
				>
					<Text className="text-red-600 text-lg font-bold text-center">Rarely</Text>
					<Text className="text-gray-600 text-sm text-center">0-5 Times a week</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderStep7 = () => (
		<View className="flex-1 px-6 py-8">
			<Text className="text-2xl font-bold text-center mb-8">
				{steps[6].title}
			</Text>
			
			{/* Summary t-shirt image */}
			<View className="w-48 h-48 bg-gray-200 rounded-lg items-center justify-center mb-6 mx-auto">
				<View className="w-32 h-32 bg-white rounded-lg items-center justify-center border-2 border-gray-300">
					<View className="w-24 h-24 bg-orange-500 rounded-lg items-center justify-center">
						<Ionicons name="shirt" size={40} color="white" />
					</View>
				</View>
			</View>

			{/* Summary details */}
			<View className="space-y-3 mb-8">
				<Text className="text-lg text-center">{formData.clothingType}</Text>
				<Text className="text-lg text-center">{formData.usageFrequency} used</Text>
				<Text className="text-lg text-center">
					{formData.impulsivelyBought ? "Impulsively bought" : "Not impulsively bought"}
				</Text>
			</View>

			<View className="flex-row gap-4">
				<TouchableOpacity 
					className="flex-1 border-2 border-yellow-500 px-6 py-4 rounded-lg"
					onPress={handleBack}
				>
					<Text className="text-yellow-600 text-lg font-bold text-center">Back</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					className="flex-1 border-2 border-green-500 px-6 py-4 rounded-lg"
					onPress={() => {
						// Handle completion
						console.log("Clothing added:", formData);
					}}
				>
					<Text className="text-green-600 text-lg font-bold text-center">Done</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1: return renderStep1();
			case 2: return renderStep2();
			case 3: return renderStep3();
			case 4: return renderStep4();
			case 5: return renderStep5();
			case 6: return renderStep6();
			case 7: return renderStep7();
			default: return renderStep1();
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Header */}
			<View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
				<TouchableOpacity onPress={handleBack}>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text className="text-lg font-bold">New Clothing</Text>
				<View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
					<Ionicons name="person" size={20} color="gray" />
				</View>
			</View>

			{/* Step Content */}
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{renderCurrentStep()}
			</ScrollView>
		</SafeAreaView>
	);
}