import { ClothingItem, WearLog } from "../types";

/**
 * EcoFit Scoring Algorithm
 *
 * Base Score Calculation:
 * - Impulsive Purchase: -30 points
 * - Newly Bought: -10 points (recent purchases need to prove their worth)
 * - Usage Frequency:
 *   - Rarely: 20 points
 *   - Occasionally: 60 points
 *   - Frequently: 100 points
 *
 * Dynamic Scoring:
 * - Tracks actual wear logs to adjust usage frequency over time
 * - Penalizes items that aren't worn as expected
 * - Rewards items that exceed expected usage
 */

export class EcoFitScorer {
	/**
	 * Calculate the initial score for a new clothing item
	 */
	static calculateInitialScore(itemData: {
		clothingType: "upperwear" | "lowerwear" | "accessories";
		isNewlyBought: boolean;
		isImpulsivelyBought: boolean;
		usageFrequency: "rarely" | "occasionally" | "frequently";
	}): number {
		let score = 0;

		// Base frequency score
		switch (itemData.usageFrequency) {
			case "rarely":
				score = 20;
				break;
			case "occasionally":
				score = 60;
				break;
			case "frequently":
				score = 100;
				break;
		}

		console.log(`Initial scoring calculation:`);
		console.log(`- Base frequency (${itemData.usageFrequency}): ${score}`);

		// Penalties
		if (itemData.isImpulsivelyBought) {
			score -= 30;
			console.log(`- Impulsive purchase penalty: -30, new score: ${score}`);
		}

		if (itemData.isNewlyBought) {
			score -= 10;
			console.log(`- Newly bought penalty: -10, new score: ${score}`);
		}

		const finalScore = Math.max(0, Math.min(100, score));
		console.log(`- Final initial score: ${finalScore}`);

		// Ensure score is between 0 and 100
		return finalScore;
	}

	/**
	 * Calculate dynamic score based on actual wear logs
	 */
	static calculateDynamicScore(
		item: ClothingItem,
		wearLogs: WearLog[]
	): number {
		const now = new Date();
		const createdAt = new Date(item.createdAt);
		const daysSinceCreated = Math.floor(
			(now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
		);

		console.log(`Dynamic scoring for item ${item.id}:`);
		console.log(`- Days since created: ${daysSinceCreated}`);
		console.log(`- Current score: ${item.currentScore}`);
		console.log(`- Wear logs count: ${wearLogs.length}`);

		// For very new items (< 7 days), give immediate positive feedback for wear events
		if (daysSinceCreated < 7) {
			console.log(`- Item too new (< 7 days), applying immediate wear bonus`);
			const itemWearLogs = wearLogs.filter(
				(log) => log.clothingItemId === item.id
			);
			const wearBonus = Math.min(15, itemWearLogs.length * 5); // 5 points per wear, max 15
			const newScore = Math.min(100, item.currentScore + wearBonus);
			console.log(
				`- Wear events: ${itemWearLogs.length}, bonus: ${wearBonus}, new score: ${newScore}`
			);
			return newScore;
		}

		// Get wear logs for the item
		const itemWearLogs = wearLogs.filter(
			(log) => log.clothingItemId === item.id
		);
		const weeksOwned = Math.max(1, Math.floor(daysSinceCreated / 7));
		const actualWearsPerWeek = itemWearLogs.length / weeksOwned;

		// Expected wears per week based on stated frequency
		let expectedWearsPerWeek: number;
		switch (item.usageFrequency) {
			case "rarely":
				expectedWearsPerWeek = 0.5; // ~2 times per month
				break;
			case "occasionally":
				expectedWearsPerWeek = 1.5; // ~6 times per month
				break;
			case "frequently":
				expectedWearsPerWeek = 3; // ~12 times per month
				break;
		}

		// Calculate usage ratio (actual vs expected)
		const usageRatio = actualWearsPerWeek / expectedWearsPerWeek;

		// Start with initial score and adjust based on actual usage
		let dynamicScore = this.calculateInitialScore({
			clothingType: item.clothingType,
			isNewlyBought: item.isNewlyBought,
			isImpulsivelyBought: item.isImpulsivelyBought,
			usageFrequency: item.usageFrequency,
		});

		if (usageRatio >= 1.2) {
			// Exceeding expectations - bonus points
			dynamicScore += Math.min(20, (usageRatio - 1) * 30);
		} else if (usageRatio < 0.5) {
			// Significantly underused - penalty
			dynamicScore -= Math.min(40, (1 - usageRatio) * 50);
		}

		// Time-based adjustments
		if (daysSinceCreated > 90) {
			// After 3 months, reward consistent usage
			if (usageRatio >= 0.8) {
				dynamicScore += 10;
			}
		}

		// Ensure score is between 0 and 100
		return Math.max(0, Math.min(100, Math.round(dynamicScore)));
	}

	/**
	 * Calculate monthly score for a specific month
	 */
	static calculateMonthlyScore(
		items: ClothingItem[],
		monthYear: string
	): number {
		const monthItems = items.filter((item) => {
			const itemMonth = new Date(item.createdAt).toISOString().slice(0, 7);
			return itemMonth <= monthYear;
		});

		if (monthItems.length === 0) return 0;

		const totalScore = monthItems.reduce((sum, item) => {
			return sum + (item.monthlyScores[monthYear] || item.currentScore);
		}, 0);

		return Math.round(totalScore / monthItems.length);
	}

	/**
	 * Calculate overall EcoFit index
	 */
	static calculateOverallScore(items: ClothingItem[]): number {
		if (items.length === 0) return 0;

		const totalScore = items.reduce((sum, item) => sum + item.currentScore, 0);
		return Math.round(totalScore / items.length);
	}

	/**
	 * Determine if usage frequency should be updated based on wear patterns
	 */
	static suggestFrequencyUpdate(
		item: ClothingItem,
		wearLogs: WearLog[]
	): "rarely" | "occasionally" | "frequently" | null {
		const itemWearLogs = wearLogs.filter(
			(log) => log.clothingItemId === item.id
		);
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// Count wears in the last 30 days
		const recentWears = itemWearLogs.filter(
			(log) => new Date(log.wornDate) >= thirtyDaysAgo
		).length;

		let suggestedFrequency: "rarely" | "occasionally" | "frequently";

		if (recentWears <= 2) {
			suggestedFrequency = "rarely";
		} else if (recentWears <= 6) {
			suggestedFrequency = "occasionally";
		} else {
			suggestedFrequency = "frequently";
		}

		// Only suggest change if it's different from current
		return suggestedFrequency !== item.usageFrequency
			? suggestedFrequency
			: null;
	}
}
