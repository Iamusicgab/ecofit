import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	Timestamp,
	updateDoc,
	where,
	writeBatch,
} from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { db, storage } from "../firebase/config";
import {
	ClothingItem,
	GrabItem,
	GrabRequest,
	UserEcoFitData,
	WearLog,
} from "../types";
import { EcoFitScorer } from "../utils/ecoFitScorer";

export class ClothingService {
	/**
	 * Add a new clothing item with image upload
	 */
	static async addClothingItem(
		userId: string,
		imageUri: string,
		clothingData: {
			clothingType: "upperwear" | "lowerwear" | "accessories";
			isNewlyBought: boolean;
			isImpulsivelyBought: boolean;
			usageFrequency: "rarely" | "occasionally" | "frequently";
		}
	): Promise<string> {
		try {
			// Upload image to Firebase Storage
			const imageUrl = await this.uploadClothingImage(imageUri, userId);

			// Calculate initial score
			const initialScore = EcoFitScorer.calculateInitialScore(clothingData);

			const now = new Date();
			const monthYear = now.toISOString().slice(0, 7);

			// Create clothing item data
			const clothingItem: Omit<ClothingItem, "id"> = {
				userId,
				imageUrl,
				...clothingData,
				createdAt: now,
				updatedAt: now,
				currentScore: initialScore,
				monthlyScores: { [monthYear]: initialScore },
				wearLogs: [],
			};

			// Add to Firestore
			const docRef = await addDoc(collection(db, "clothingItems"), {
				...clothingItem,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			// Update user's EcoFit data
			await this.updateUserEcoFitData(userId);

			return docRef.id;
		} catch (error) {
			console.error("Error adding clothing item:", error);
			throw error;
		}
	}

	/**
	 * Upload clothing image to Firebase Storage
	 */
	private static async uploadClothingImage(
		imageUri: string,
		userId: string
	): Promise<string> {
		try {
			const response = await fetch(imageUri);
			const blob = await response.blob();

			const filename = `clothing_${Date.now()}.jpg`;
			const storageRef = ref(storage, `clothing/${userId}/${filename}`);

			await uploadBytes(storageRef, blob);
			return await getDownloadURL(storageRef);
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		}
	}

	/**
	 * Get all clothing items for a user
	 */
	static async getUserClothingItems(userId: string): Promise<ClothingItem[]> {
		try {
			const q = query(
				collection(db, "clothingItems"),
				where("userId", "==", userId),
				orderBy("createdAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				createdAt: doc.data().createdAt?.toDate() || new Date(),
				updatedAt: doc.data().updatedAt?.toDate() || new Date(),
			})) as ClothingItem[];
		} catch (error) {
			console.error("Error getting clothing items:", error);
			throw error;
		}
	}

	/**
	 * Log a wear event for a clothing item
	 */
	static async logWearEvent(
		clothingItemId: string,
		wornDate: Date = new Date()
	): Promise<void> {
		try {
			// Add wear log
			const wearLog: Omit<WearLog, "id"> = {
				clothingItemId,
				wornDate,
				createdAt: new Date(),
			};

			await addDoc(collection(db, "wearLogs"), {
				...wearLog,
				wornDate: Timestamp.fromDate(wornDate),
				createdAt: serverTimestamp(),
			});

			// Get clothing item and all its wear logs
			const clothingItem = await this.getClothingItem(clothingItemId);
			if (!clothingItem) throw new Error("Clothing item not found");

			const wearLogs = await this.getWearLogs(clothingItemId);

			// Recalculate score
			const newScore = EcoFitScorer.calculateDynamicScore(
				clothingItem,
				wearLogs
			);

			// Update clothing item score
			await updateDoc(doc(db, "clothingItems", clothingItemId), {
				currentScore: newScore,
				updatedAt: serverTimestamp(),
			});

			// Update user's overall EcoFit data
			await this.updateUserEcoFitData(clothingItem.userId);
		} catch (error) {
			console.error("Error logging wear event:", error);
			throw error;
		}
	}

	/**
	 * Update usage frequency of a clothing item
	 */
	static async updateUsageFrequency(
		clothingItemId: string,
		newFrequency: "rarely" | "occasionally" | "frequently"
	): Promise<void> {
		try {
			const clothingItem = await this.getClothingItem(clothingItemId);
			if (!clothingItem) throw new Error("Clothing item not found");

			// Update the frequency
			const updatedItem = { ...clothingItem, usageFrequency: newFrequency };
			const wearLogs = await this.getWearLogs(clothingItemId);

			// Recalculate score with new frequency
			const newScore = EcoFitScorer.calculateDynamicScore(
				updatedItem,
				wearLogs
			);

			await updateDoc(doc(db, "clothingItems", clothingItemId), {
				usageFrequency: newFrequency,
				currentScore: newScore,
				updatedAt: serverTimestamp(),
			});

			// Update user's overall EcoFit data
			await this.updateUserEcoFitData(clothingItem.userId);
		} catch (error) {
			console.error("Error updating usage frequency:", error);
			throw error;
		}
	}

	/**
	 * Get a single clothing item
	 */
	static async getClothingItem(
		clothingItemId: string
	): Promise<ClothingItem | null> {
		try {
			const docSnap = await getDoc(doc(db, "clothingItems", clothingItemId));
			if (!docSnap.exists()) return null;

			return {
				id: docSnap.id,
				...docSnap.data(),
				createdAt: docSnap.data().createdAt?.toDate() || new Date(),
				updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
			} as ClothingItem;
		} catch (error) {
			console.error("Error getting clothing item:", error);
			throw error;
		}
	}

	/**
	 * Get wear logs for a clothing item
	 */
	static async getWearLogs(clothingItemId: string): Promise<WearLog[]> {
		try {
			const q = query(
				collection(db, "wearLogs"),
				where("clothingItemId", "==", clothingItemId),
				orderBy("wornDate", "desc")
			);

			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				wornDate: doc.data().wornDate?.toDate() || new Date(),
				createdAt: doc.data().createdAt?.toDate() || new Date(),
			})) as WearLog[];
		} catch (error) {
			console.error("Error getting wear logs:", error);
			throw error;
		}
	}

	/**
	 * Donate clothing items (delete them and update user stats)
	 */
	static async donateClothingItems(clothingItemIds: string[]): Promise<void> {
		try {
			if (clothingItemIds.length === 0) return;

			// Get the first item to find the user
			const firstItem = await this.getClothingItem(clothingItemIds[0]);
			if (!firstItem) throw new Error("Clothing item not found");

			const userId = firstItem.userId;

			// Delete all selected items
			const deletePromises = clothingItemIds.map((itemId) =>
				this.deleteClothingItem(itemId)
			);

			await Promise.all(deletePromises);

			// Update user's donated count
			await this.updateDonatedCount(userId, clothingItemIds.length);

			console.log(`Successfully donated ${clothingItemIds.length} items`);
		} catch (error) {
			console.error("Error donating clothing items:", error);
			throw error;
		}
	}

	/**
	 * Update user's donated items count
	 */
	static async updateDonatedCount(
		userId: string,
		donatedCount: number
	): Promise<void> {
		try {
			const currentData = await this.getUserEcoFitData(userId);
			const currentDonatedItems = currentData?.totalDonatedItems || 0;

			await setDoc(
				doc(db, "userEcoFitData", userId),
				{
					totalDonatedItems: currentDonatedItems + donatedCount,
					lastUpdated: serverTimestamp(),
				},
				{ merge: true }
			);
		} catch (error) {
			console.error("Error updating donated count:", error);
			throw error;
		}
	}

	/**
	 * Get total wear events count for a user across all their clothing items
	 */
	static async getTotalWearEvents(userId: string): Promise<number> {
		try {
			// Get all clothing items for the user
			const clothingItems = await this.getUserClothingItems(userId);

			if (clothingItems.length === 0) {
				return 0;
			}

			// Get all clothing item IDs
			const clothingItemIds = clothingItems.map((item) => item.id);

			// Query all wear logs for these items in one go
			const q = query(
				collection(db, "wearLogs"),
				where("clothingItemId", "in", clothingItemIds)
			);

			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.length;
		} catch (error) {
			console.error("Error getting total wear events:", error);
			return 0;
		}
	}

	/**
	 * Update user's overall EcoFit data
	 */
	static async updateUserEcoFitData(userId: string): Promise<void> {
		try {
			const clothingItems = await this.getUserClothingItems(userId);
			const overallScore = EcoFitScorer.calculateOverallScore(clothingItems);
			const totalWearEvents = await this.getTotalWearEvents(userId);

			// Get current user data to preserve donated count
			const currentUserData = await this.getUserEcoFitData(userId);
			const totalDonatedItems = currentUserData?.totalDonatedItems || 0;

			// Calculate monthly scores
			const monthlyScores: { [monthYear: string]: number } = {};

			// Get all months that have clothing items
			const months = new Set<string>();
			clothingItems.forEach((item) => {
				const itemMonth = new Date(item.createdAt).toISOString().slice(0, 7);
				months.add(itemMonth);
			});

			// Calculate score for each month
			months.forEach((month) => {
				monthlyScores[month] = EcoFitScorer.calculateMonthlyScore(
					clothingItems,
					month
				);
			});

			const userEcoFitData: Omit<UserEcoFitData, "userId"> = {
				currentOverallScore: overallScore,
				monthlyScores,
				totalClothingItems: clothingItems.length,
				totalWearEvents,
				totalDonatedItems,
				lastUpdated: new Date(),
			};

			await setDoc(
				doc(db, "userEcoFitData", userId),
				{
					...userEcoFitData,
					lastUpdated: serverTimestamp(),
				},
				{ merge: true }
			);
		} catch (error) {
			console.error("Error updating user EcoFit data:", error);
			throw error;
		}
	}

	/**
	 * Get user's EcoFit data
	 */
	static async getUserEcoFitData(
		userId: string
	): Promise<UserEcoFitData | null> {
		try {
			const docSnap = await getDoc(doc(db, "userEcoFitData", userId));
			if (!docSnap.exists()) {
				// Create initial data if it doesn't exist
				const initialData: UserEcoFitData = {
					userId,
					currentOverallScore: 0,
					monthlyScores: {},
					totalClothingItems: 0,
					totalWearEvents: 0,
					totalDonatedItems: 0,
					lastUpdated: new Date(),
				};

				await setDoc(doc(db, "userEcoFitData", userId), {
					...initialData,
					lastUpdated: serverTimestamp(),
				});

				return initialData;
			}

			return {
				userId,
				...docSnap.data(),
				lastUpdated: docSnap.data().lastUpdated?.toDate() || new Date(),
			} as UserEcoFitData;
		} catch (error) {
			console.error("Error getting user EcoFit data:", error);
			throw error;
		}
	}

	/**
	 * Delete a clothing item
	 */
	static async deleteClothingItem(clothingItemId: string): Promise<void> {
		try {
			const clothingItem = await this.getClothingItem(clothingItemId);
			if (!clothingItem) throw new Error("Clothing item not found");

			// Delete image from storage
			try {
				const imageRef = ref(storage, clothingItem.imageUrl);
				await deleteObject(imageRef);
			} catch (error) {
				console.warn("Error deleting image:", error);
			}

			// Delete wear logs
			const wearLogs = await this.getWearLogs(clothingItemId);
			const batch = writeBatch(db);

			wearLogs.forEach((log) => {
				batch.delete(doc(db, "wearLogs", log.id));
			});

			// Delete clothing item
			batch.delete(doc(db, "clothingItems", clothingItemId));

			await batch.commit();

			// Update user's EcoFit data
			await this.updateUserEcoFitData(clothingItem.userId);
		} catch (error) {
			console.error("Error deleting clothing item:", error);
			throw error;
		}
	}

	// ===== GRAB SECTION FUNCTIONALITY =====

	/**
	 * List a clothing item for others to grab
	 */
	static async listItemForGrab(
		clothingItemId: string,
		userId: string,
		userDisplayName: string,
		location: string,
		description?: string,
		availableUntil?: Date
	): Promise<string> {
		try {
			const clothingItem = await this.getClothingItem(clothingItemId);
			if (!clothingItem) throw new Error("Clothing item not found");
			if (clothingItem.userId !== userId)
				throw new Error("Not authorized to list this item");

			const grabItem: Omit<GrabItem, "id"> = {
				clothingItemId,
				ownerId: userId,
				ownerName: userDisplayName,
				location,
				isAvailable: true,
				listedAt: new Date(),
				availableUntil,
				description,
			};

			const docRef = await addDoc(collection(db, "grabItems"), {
				...grabItem,
				listedAt: serverTimestamp(),
				availableUntil: availableUntil
					? Timestamp.fromDate(availableUntil)
					: null,
			});

			return docRef.id;
		} catch (error) {
			console.error("Error listing item for grab:", error);
			throw error;
		}
	}

	/**
	 * Get all available grab items (excluding user's own items)
	 */
	static async getAvailableGrabItems(
		currentUserId: string
	): Promise<(GrabItem & { clothingItem: ClothingItem })[]> {
		try {
			const q = query(
				collection(db, "grabItems"),
				where("isAvailable", "==", true),
				where("ownerId", "!=", currentUserId),
				orderBy("ownerId"),
				orderBy("listedAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			const grabItems = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				listedAt: doc.data().listedAt?.toDate() || new Date(),
				availableUntil: doc.data().availableUntil?.toDate() || undefined,
			})) as GrabItem[];

			// Get clothing item details for each grab item
			const grabItemsWithClothing = await Promise.all(
				grabItems.map(async (grabItem) => {
					const clothingItem = await this.getClothingItem(
						grabItem.clothingItemId
					);
					if (!clothingItem) throw new Error("Clothing item not found");
					return { ...grabItem, clothingItem };
				})
			);

			return grabItemsWithClothing;
		} catch (error) {
			console.error("Error getting available grab items:", error);
			throw error;
		}
	}

	/**
	 * Get user's own grab listings
	 */
	static async getUserGrabListings(
		userId: string
	): Promise<(GrabItem & { clothingItem: ClothingItem })[]> {
		try {
			const q = query(
				collection(db, "grabItems"),
				where("ownerId", "==", userId),
				orderBy("listedAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			const grabItems = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				listedAt: doc.data().listedAt?.toDate() || new Date(),
				availableUntil: doc.data().availableUntil?.toDate() || undefined,
			})) as GrabItem[];

			// Get clothing item details for each grab item
			const grabItemsWithClothing = await Promise.all(
				grabItems.map(async (grabItem) => {
					const clothingItem = await this.getClothingItem(
						grabItem.clothingItemId
					);
					if (!clothingItem) throw new Error("Clothing item not found");
					return { ...grabItem, clothingItem };
				})
			);

			return grabItemsWithClothing;
		} catch (error) {
			console.error("Error getting user grab listings:", error);
			throw error;
		}
	}

	/**
	 * Request to grab an item
	 */
	static async requestGrabItem(
		grabItemId: string,
		requesterId: string,
		requesterName: string,
		message?: string
	): Promise<string> {
		try {
			const grabRequest: Omit<GrabRequest, "id"> = {
				grabItemId,
				requesterId,
				requesterName,
				status: "pending",
				requestedAt: new Date(),
				message,
			};

			const docRef = await addDoc(collection(db, "grabRequests"), {
				...grabRequest,
				requestedAt: serverTimestamp(),
			});

			return docRef.id;
		} catch (error) {
			console.error("Error requesting grab item:", error);
			throw error;
		}
	}

	/**
	 * Get grab requests for user's listed items
	 */
	static async getGrabRequestsForOwner(
		ownerId: string
	): Promise<
		(GrabRequest & { grabItem: GrabItem & { clothingItem: ClothingItem } })[]
	> {
		try {
			// Get user's grab items
			const userGrabItems = await this.getUserGrabListings(ownerId);
			const grabItemIds = userGrabItems.map((item) => item.id);

			if (grabItemIds.length === 0) return [];

			const q = query(
				collection(db, "grabRequests"),
				where("grabItemId", "in", grabItemIds),
				orderBy("requestedAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			const grabRequests = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				requestedAt: doc.data().requestedAt?.toDate() || new Date(),
				respondedAt: doc.data().respondedAt?.toDate() || undefined,
			})) as GrabRequest[];

			// Attach grab item details to each request
			const requestsWithDetails = await Promise.all(
				grabRequests.map(async (request) => {
					const grabItem = userGrabItems.find(
						(item) => item.id === request.grabItemId
					);
					if (!grabItem) throw new Error("Grab item not found");
					return { ...request, grabItem };
				})
			);

			return requestsWithDetails;
		} catch (error) {
			console.error("Error getting grab requests for owner:", error);
			throw error;
		}
	}

	/**
	 * Get user's own grab requests
	 */
	static async getUserGrabRequests(
		requesterId: string
	): Promise<
		(GrabRequest & { grabItem: GrabItem & { clothingItem: ClothingItem } })[]
	> {
		try {
			const q = query(
				collection(db, "grabRequests"),
				where("requesterId", "==", requesterId),
				orderBy("requestedAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			const grabRequests = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				requestedAt: doc.data().requestedAt?.toDate() || new Date(),
				respondedAt: doc.data().respondedAt?.toDate() || undefined,
			})) as GrabRequest[];

			// Get grab item details for each request
			const requestsWithDetails = await Promise.all(
				grabRequests.map(async (request) => {
					const grabItemDoc = await getDoc(
						doc(db, "grabItems", request.grabItemId)
					);
					if (!grabItemDoc.exists()) throw new Error("Grab item not found");

					const grabItem = {
						id: grabItemDoc.id,
						...grabItemDoc.data(),
						listedAt: grabItemDoc.data().listedAt?.toDate() || new Date(),
						availableUntil:
							grabItemDoc.data().availableUntil?.toDate() || undefined,
					} as GrabItem;

					const clothingItem = await this.getClothingItem(
						grabItem.clothingItemId
					);
					if (!clothingItem) throw new Error("Clothing item not found");

					return { ...request, grabItem: { ...grabItem, clothingItem } };
				})
			);

			return requestsWithDetails;
		} catch (error) {
			console.error("Error getting user grab requests:", error);
			throw error;
		}
	}

	/**
	 * Approve a grab request and transfer ownership
	 */
	static async approveGrabRequest(
		grabRequestId: string,
		ownerId: string
	): Promise<void> {
		try {
			const requestDoc = await getDoc(doc(db, "grabRequests", grabRequestId));
			if (!requestDoc.exists()) throw new Error("Grab request not found");

			const grabRequest = {
				id: requestDoc.id,
				...requestDoc.data(),
				requestedAt: requestDoc.data().requestedAt?.toDate() || new Date(),
				respondedAt: requestDoc.data().respondedAt?.toDate() || undefined,
			} as GrabRequest;

			// Get grab item
			const grabItemDoc = await getDoc(
				doc(db, "grabItems", grabRequest.grabItemId)
			);
			if (!grabItemDoc.exists()) throw new Error("Grab item not found");

			const grabItem = {
				id: grabItemDoc.id,
				...grabItemDoc.data(),
				listedAt: grabItemDoc.data().listedAt?.toDate() || new Date(),
				availableUntil:
					grabItemDoc.data().availableUntil?.toDate() || undefined,
			} as GrabItem;

			// Verify ownership
			if (grabItem.ownerId !== ownerId)
				throw new Error("Not authorized to approve this request");

			// Get clothing item
			const clothingItem = await this.getClothingItem(grabItem.clothingItemId);
			if (!clothingItem) throw new Error("Clothing item not found");

			// Start batch operation
			const batch = writeBatch(db);

			// Update grab request status
			batch.update(doc(db, "grabRequests", grabRequestId), {
				status: "approved",
				respondedAt: serverTimestamp(),
			});

			// Transfer clothing item ownership
			batch.update(doc(db, "clothingItems", grabItem.clothingItemId), {
				userId: grabRequest.requesterId,
				updatedAt: serverTimestamp(),
			});

			// Mark grab item as no longer available
			batch.update(doc(db, "grabItems", grabRequest.grabItemId), {
				isAvailable: false,
			});

			// Deny all other pending requests for this item
			const otherRequestsQuery = query(
				collection(db, "grabRequests"),
				where("grabItemId", "==", grabRequest.grabItemId),
				where("status", "==", "pending")
			);
			const otherRequestsSnapshot = await getDocs(otherRequestsQuery);

			otherRequestsSnapshot.docs.forEach((doc) => {
				if (doc.id !== grabRequestId) {
					batch.update(doc.ref, {
						status: "denied",
						respondedAt: serverTimestamp(),
					});
				}
			});

			await batch.commit();

			// Update EcoFit data for both users
			await this.updateUserEcoFitData(ownerId); // Previous owner
			await this.updateUserEcoFitData(grabRequest.requesterId); // New owner

			console.log("Grab request approved and ownership transferred");
		} catch (error) {
			console.error("Error approving grab request:", error);
			throw error;
		}
	}

	/**
	 * Deny a grab request
	 */
	static async denyGrabRequest(
		grabRequestId: string,
		ownerId: string
	): Promise<void> {
		try {
			const requestDoc = await getDoc(doc(db, "grabRequests", grabRequestId));
			if (!requestDoc.exists()) throw new Error("Grab request not found");

			const grabRequest = requestDoc.data() as GrabRequest;

			// Get grab item to verify ownership
			const grabItemDoc = await getDoc(
				doc(db, "grabItems", grabRequest.grabItemId)
			);
			if (!grabItemDoc.exists()) throw new Error("Grab item not found");

			const grabItem = grabItemDoc.data() as GrabItem;
			if (grabItem.ownerId !== ownerId)
				throw new Error("Not authorized to deny this request");

			// Update request status
			await updateDoc(doc(db, "grabRequests", grabRequestId), {
				status: "denied",
				respondedAt: serverTimestamp(),
			});

			console.log("Grab request denied");
		} catch (error) {
			console.error("Error denying grab request:", error);
			throw error;
		}
	}

	/**
	 * Remove a grab listing
	 */
	static async removeGrabListing(
		grabItemId: string,
		ownerId: string
	): Promise<void> {
		try {
			const grabItemDoc = await getDoc(doc(db, "grabItems", grabItemId));
			if (!grabItemDoc.exists()) throw new Error("Grab item not found");

			const grabItem = grabItemDoc.data() as GrabItem;
			if (grabItem.ownerId !== ownerId)
				throw new Error("Not authorized to remove this listing");

			const batch = writeBatch(db);

			// Delete the grab item
			batch.delete(doc(db, "grabItems", grabItemId));

			// Delete all associated requests
			const requestsQuery = query(
				collection(db, "grabRequests"),
				where("grabItemId", "==", grabItemId)
			);
			const requestsSnapshot = await getDocs(requestsQuery);

			requestsSnapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});

			await batch.commit();

			console.log("Grab listing removed");
		} catch (error) {
			console.error("Error removing grab listing:", error);
			throw error;
		}
	}
}
