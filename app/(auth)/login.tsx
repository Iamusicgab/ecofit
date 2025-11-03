import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "../../firebase/config";
import { useAuth } from "../../providers/AuthProvider";
WebBrowser.maybeCompleteAuthSession();
let logo = require("../../assets/images/logoGreen.svg");

export default function Login() {
    const insets = useSafeAreaInsets();
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });
    const isExpoGo = Constants.appOwnership === "expo";

    useEffect(() => {
        const go = async () => {
            if (response?.type !== "success") return;
            const idToken = response.authentication?.idToken;
            if (!idToken) return;
            try {
                const credential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, credential);
                router.replace("/(tabs)/(home)");
            } catch (e) {
                console.warn(e);
            }
        };
        go();
    }, [response]);

    const handleLogin = async () => {
        if (!email || !password) return;
        setSubmitting(true);
        try {
            await signIn(email.trim(), password);
            router.replace("/(tabs)/(home)");
        } catch (e) {
            console.warn(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) return;
        setSubmitting(true);
        try {
            await signUp(email.trim(), password);
            router.replace("/(tabs)/(home)");
        } catch (e) {
            console.warn(e);
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
                    <Text className="mt-2 text-4xl font-quicksand_bold text-green">ecofit</Text>
                </View>

                <View className="gap-4">
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
                        <Text className="text-white text-center font-quicksand_bold text-lg">Login</Text>
                    </TouchableOpacity>
                     <TouchableOpacity
                        disabled={submitting}
                        className="w-full py-4 rounded-2xl bg-orange"
                      
                        onPress={handleSignUp}
                    >
                        <Text className="text-white text-center font-quicksand_bold text-lg">Sign Up</Text>
                    </TouchableOpacity>

                </View>

                <View className="items-center mt-8">
                    <Text className="text-gray-600 mb-4">or sign in with</Text>
                    <TouchableOpacity
                        disabled={!request}
                        className="w-16 h-16 rounded-2xl bg-white border-2 border-gray-200 items-center justify-center"
                        onPress={() => promptAsync({ useProxy: isExpoGo })}
                    >
                        <Image
                            source="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            style={{ width: 28, height: 28 }}
                            contentFit="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}


