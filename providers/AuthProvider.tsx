import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInAnonymously,
	signInWithCredential,
	signInWithEmailAndPassword,
	User,
} from "firebase/auth";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { auth } from "../firebase/config";

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
	user: User | null;
	loading: boolean;
	signInAnon: () => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Configure Google Auth
	const [request, response, promptAsync] = Google.useAuthRequest({
		iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
		androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
		webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
	});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoading(false);
		});
		return unsub;
	}, []);

	// Handle Google Sign-In response
	useEffect(() => {
		if (response?.type === "success") {
			const { authentication } = response;
			if (authentication?.accessToken) {
				signInWithGoogleToken(authentication.accessToken);
			}
		}
	}, [response]);

	const signInWithGoogleToken = async (accessToken: string) => {
		try {
			const credential = GoogleAuthProvider.credential(null, accessToken);
			await signInWithCredential(auth, credential);
		} catch (error) {
			console.error("Google Sign-In Error:", error);
			throw error;
		}
	};

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			loading,
			async signInAnon() {
				await signInAnonymously(auth);
			},
			async signIn(email, password) {
				await signInWithEmailAndPassword(auth, email, password);
			},
			async signUp(email, password) {
				await createUserWithEmailAndPassword(auth, email, password);
			},
			async signInWithGoogle() {
				await promptAsync();
			},
			async signOut() {
				await import("firebase/auth").then(({ signOut }) => signOut(auth));
			},
		}),
		[user, loading, promptAsync]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
