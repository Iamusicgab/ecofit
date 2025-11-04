import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Expo: read from public env so values are available at runtime
// Set these in app config or a .env file as EXPO_PUBLIC_* variables
const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: process.env
		.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
};

let app: FirebaseApp;
if (!getApps().length) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApps()[0]!;
}

// Use RN persistence so auth survives app restarts
let auth = (() => {
	try {
		// Resolve at runtime to avoid type issues when deps aren't installed yet

		const { initializeAuth } = require("firebase/auth");

		const { getReactNativePersistence } = require("firebase/auth");

		const AsyncStorage =
			require("@react-native-async-storage/async-storage").default;
		return initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		});
	} catch {
		return getAuth(app);
	}
})();

// Initialize Firestore with better error handling
const db = (() => {
	try {
		return getFirestore(app);
	} catch (error) {
		console.warn("Firestore initialization warning:", error);
		return getFirestore(app);
	}
})();

const storage = getStorage(app);

// Optional: connect to emulators in dev
if (__DEV__ && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
	try {
		console.log("Connecting to Firebase emulators...");
		connectFirestoreEmulator(db, "127.0.0.1", 8080);
		connectStorageEmulator(storage, "127.0.0.1", 9199);
		console.log("Connected to Firebase emulators successfully");
		// Auth emulator is set via environment var at runtime:
		// await import("firebase/auth").then(({ connectAuthEmulator }) =>
		//   connectAuthEmulator(auth, "http://127.0.0.1:9099")
		// );
	} catch (error) {
		console.warn("Failed to connect to Firebase emulators:", error);
	}
}

export { app, auth, db, storage };
