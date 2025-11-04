import { Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";
import { getUserDocument } from "../../../utils/firestoreUtils";

let Rectangle = require("../../../assets/images/rectangle.png");

function Header(props: any) {
	const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
	const { signOut, user } = useAuth();

	React.useEffect(() => {
		const fetchUserPhoto = async () => {
			try {
				console.log("Auth user from context:", user);
				const uid = user?.uid;
				console.log("Current user UID:", uid);

				if (!uid) {
					console.log("No authenticated user found");
					return;
				}

				const { data, error } = await getUserDocument(uid);

				if (error) {
					console.log("Error fetching user data:", error);
					return;
				}

				console.log("User data fetched successfully:", data);
				if (data?.photoUrl) {
					console.log("Setting photo URL:", data.photoUrl);
					setPhotoUrl(data.photoUrl as string);
				} else {
					console.log("No photoUrl found in user data");
				}
			} catch (error) {
				console.log("Unexpected error fetching user photo:", error);
				// Silently fail - user photo is not critical
			}
		};

		// Only fetch when user is available
		if (user) {
			fetchUserPhoto();
		}
	}, [user]);

	const handleSignOut = async () => {
		try {
			await signOut();
			router.replace("/(auth)/login");
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 50,
			}}
		>
			<ImageBackground
				source={Rectangle}
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 16,
					paddingVertical: 64,
				}}
			>
				<View className="flex-row items-center gap-4 flex-1">
					{props.showBackButton && (
						<TouchableOpacity onPress={props.onBackPress}>
							<Ionicons name="arrow-back" size={28} color="white" />
						</TouchableOpacity>
					)}
					<Text className="text-4xl font-quicksand_bold text-white">
						{props.title}
					</Text>
				</View>

				<TouchableOpacity onPress={handleSignOut}>
					<Image
						style={{
							height: 40,
							width: 40,
							borderRadius: 100,
							borderColor: "white",
							borderWidth: 1.5,
						}}
						contentFit="cover"
						source={photoUrl}
					/>
				</TouchableOpacity>
			</ImageBackground>
		</View>
	);
}

export default Header;
