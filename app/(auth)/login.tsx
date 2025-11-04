import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../providers/AuthProvider";

let logo = require("../../assets/images/logoGreen.svg");

export default function Login() {
	const insets = useSafeAreaInsets();
	const { signIn, signInWithGoogle } = useAuth();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [submitting, setSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	// Expo Go-friendly: email/password only

	const handleLogin = async () => {
		setError(null);
		const emailTrimmed = email.trim();
		if (!emailTrimmed || !password) {
			setError("Enter email and password.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		setSubmitting(true);
		try {
			await signIn(emailTrimmed, password);
			router.replace("/(tabs)/(home)");
		} catch (e: any) {
			const code = e?.code ?? "auth/error";
			if (
				code === "auth/invalid-credential" ||
				code === "auth/invalid-email" ||
				code === "auth/user-not-found" ||
				code === "auth/wrong-password"
			) {
				setError("Invalid email or password.");
			} else {
				setError("Login failed. Please try again.");
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError(null);
		setSubmitting(true);
		try {
			await signInWithGoogle();
			router.replace("/(tabs)/(home)");
		} catch (error) {
			console.error("Google Sign-In Error:", error);
			setError("Google sign-in failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.select({ ios: "padding", android: undefined })}
			className="flex-1 bg-white"
			style={{ paddingTop: insets.top + 24 }}
		>
			<View className=" px-6">
				<View className="items-center mt-6 mb-10">
					<Image
						source={logo}
						style={{ width: 100, height: 100 }}
						contentFit="contain"
					/>
					<Text className="mt-2 text-4xl font-quicksand_bold text-green">
						ecofit
					</Text>
				</View>

				<View className="gap-4">
					{error && (
						<Text className="text-red-600 font-quicksand_medium">{error}</Text>
					)}
					<TextInput
						placeholder="Email"
						autoCapitalize="none"
						keyboardType="email-address"
						className="w-full rounded-2xl px-4 py-4 bg-gray-100 text-black font-quicksand_regular"
						value={email}
						onChangeText={setEmail}
					/>
					<TextInput
						placeholder="Password"
						secureTextEntry
						className="w-full rounded-2xl px-4 py-4 bg-gray-100 text-black font-quicksand_regular"
						value={password}
						onChangeText={setPassword}
					/>
				</View>

				<View className="mt-6 gap-3">
					<TouchableOpacity
						disabled={submitting}
						className="w-full py-4 rounded-2xl bg-green"
						onPress={handleLogin}
					>
						<Text className="text-white text-center font-quicksand_bold text-lg">
							{submitting ? "Loading..." : "Login"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						disabled={submitting}
						className="w-full py-4 rounded-2xl bg-white border-2 border-gray-300 flex-row items-center justify-center gap-3"
						onPress={handleGoogleSignIn}
					>
						<Ionicons name="logo-google" size={20} color="#4285F4" />
						<Text className="text-gray-800 text-center font-quicksand_bold text-lg">
							{submitting ? "Loading..." : "Continue with Google"}
						</Text>
					</TouchableOpacity>
				</View>

				<View className="items-center mt-4">
					<TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
						<Text className="text-green font-quicksand_bold">
							Create an account
						</Text>
					</TouchableOpacity>
				</View>

				<View className="items-center mt-8">
					<Text className="text-gray-500 text-center font-quicksand_regular">
						By signing in, you agree to our Terms of Service and Privacy Policy.
					</Text>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
