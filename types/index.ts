// Data types for the EcoFit app

export interface ClothingItem {
	id: string;
	userId: string;
	imageUrl: string;
	clothingType: "upperwear" | "lowerwear" | "accessories";
	isNewlyBought: boolean;
	isImpulsivelyBought: boolean;
	usageFrequency: "rarely" | "occasionally" | "frequently";
	createdAt: Date;
	updatedAt: Date;
	currentScore: number;
	monthlyScores: { [monthYear: string]: number }; // e.g., "2024-11": 85
	wearLogs: WearLog[];
}

export interface WearLog {
	id: string;
	clothingItemId: string;
	wornDate: Date;
	createdAt: Date;
}

export interface UserEcoFitData {
	userId: string;
	currentOverallScore: number;
	monthlyScores: { [monthYear: string]: number }; // e.g., "2024-11": 85
	totalClothingItems: number;
	totalWearEvents: number; // Total number of times all items have been worn
	totalDonatedItems: number; // Total number of items donated
	lastUpdated: Date;
}

export interface MonthlyStats {
	monthYear: string; // "2024-11"
	totalItems: number;
	averageScore: number;
	itemsAdded: number;
	wearFrequency: {
		rarely: number;
		occasionally: number;
		frequently: number;
	};
}

// Grab section types
export interface GrabItem {
	id: string;
	clothingItemId: string; // Reference to original clothing item
	ownerId: string; // User who owns the item
	ownerName: string; // Display name of owner
	location: string; // Pickup location
	isAvailable: boolean; // Whether still available for grab
	listedAt: Date;
	availableUntil?: Date; // Optional expiration
	description?: string; // Optional description for grab
}

export interface GrabRequest {
	id: string;
	grabItemId: string;
	requesterId: string; // User requesting to grab
	requesterName: string; // Display name of requester
	status: "pending" | "approved" | "denied" | "completed";
	requestedAt: Date;
	respondedAt?: Date;
	message?: string; // Optional message from requester
}
