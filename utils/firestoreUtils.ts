import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Safely get a document from Firestore with proper error handling
 */
export async function safeGetDoc<T = any>(
	docRef: DocumentReference
): Promise<{ data: T | null; error: string | null }> {
	try {
		const snapshot = await getDoc(docRef);

		if (snapshot.exists()) {
			return { data: snapshot.data() as T, error: null };
		} else {
			return { data: null, error: "Document does not exist" };
		}
	} catch (error: any) {
		console.warn("Firestore get document error:", error);

		// Handle specific Firestore errors
		if (error?.code === "unavailable") {
			return {
				data: null,
				error: "Firestore service is temporarily unavailable",
			};
		} else if (error?.code === "permission-denied") {
			return { data: null, error: "Permission denied to access document" };
		} else {
			return { data: null, error: "Failed to fetch document" };
		}
	}
}

/**
 * Get user document with error handling
 */
export async function getUserDocument(uid: string) {
	console.log("Fetching user document for UID:", uid);

	if (!uid || uid.trim() === "") {
		console.log("Invalid UID provided:", uid);
		return { data: null, error: "Invalid user ID" };
	}

	const userDocRef = doc(db, "users", uid);
	console.log("Document path:", `users/${uid}`);

	const result = await safeGetDoc(userDocRef);
	console.log("Document fetch result:", result);

	return result;
}
