import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../providers/AuthProvider";
import { db, storage } from "../../firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

let logo = require("../../assets/images/logoGreen.svg");

export default function Signup() {
    const insets = useSafeAreaInsets();
    const { signUp } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            if (!res.canceled) {
                setPhotoUri(res.assets[0].uri);
            }
        } catch (e) {
            setError("Could not pick image");
        }
    };

    const handleSignup = async () => {
        setError(null);
        const emailTrimmed = email.trim();
        if (!firstName.trim() || !emailTrimmed || !password) {
            setError("Enter first name, email, and password.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setSubmitting(true);
        try {
            await signUp(emailTrimmed, password);
            // Create user profile
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { auth } = require("../../firebase/config");
            const uid = auth.currentUser?.uid as string;
            if (uid) {
                let photoUrl: string | null = null;
                if (photoUri) {
                    const resp = await fetch(photoUri);
                    const blob = await resp.blob();
                    const key = `users/${uid}/profile.jpg`;
                    const storageRef = ref(storage, key);
                    await uploadBytes(storageRef, blob);
                    photoUrl = await getDownloadURL(storageRef);
                }
                await setDoc(
                    doc(db, "users", uid),
                    {
                        firstName: firstName.trim(),
                        email: emailTrimmed,
                        photoUrl: photoUrl,
                        points: 0,
                        createdAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            }
            router.replace("/(tabs)/(home)");
        } catch (e) {
            setError("Sign up failed. Try another email.");
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
                    <Image source={logo} style={{ width: 100, height: 100 }} contentFit="contain" />
                    <Text className="mt-2 text-4xl font-quicksand_bold text-green">ecofit</Text>
                </View>

                <View className="gap-4">
                    {error && (
                        <Text className="text-red-600 font-quicksand_medium">{error}</Text>
                    )}
                    <TextInput
                        placeholder="First name"
                        autoCapitalize="words"
                        className="w-full rounded-2xl px-4 py-4 bg-gray-100 text-black font-quicksand_regular"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
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
                    <TouchableOpacity
                        onPress={pickImage}
                        className="w-full py-4 rounded-2xl border-2 border-green shadow-[0_6px_0px_rgba(129,211,52,1)] items-center"
                    >
                        <Text className="text-green font-quicksand_bold">
                            {photoUri ? "Change Profile Photo" : "Add Profile Photo"}
                        </Text>
                    </TouchableOpacity>
                    {photoUri && (
                        <View className="items-center mt-2">
                            <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        </View>
                    )}
                </View>

                <View className="mt-6 gap-3">
                    <TouchableOpacity
                        disabled={submitting}
                        className="w-full py-4 rounded-2xl bg-green"
                        onPress={handleSignup}
                    >
                        <Text className="text-white text-center font-quicksand_bold text-lg">{submitting ? "Loading..." : "Sign Up"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={submitting}
                        className="w-full py-4 rounded-2xl border-2 border-gray-300"
                        onPress={() => router.replace("/(auth)/login")}
                    >
                        <Text className="text-center text-gray-800 font-quicksand_bold text-lg">Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}


