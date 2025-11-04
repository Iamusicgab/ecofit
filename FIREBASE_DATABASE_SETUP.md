# Firebase Firestore Database Structure for EcoFit App

## Collections Overview

Your Firebase Firestore database will need the following collections:

### 1. `users` Collection

**Document ID**: User's UID from Firebase Auth

```json
{
	"firstName": "John",
	"lastName": "Doe",
	"email": "john.doe@email.com",
	"photoUrl": "https://storage.googleapis.com/...", // Optional profile picture
	"createdAt": "2024-11-05T10:30:00Z",
	"updatedAt": "2024-11-05T10:30:00Z"
}
```

### 2. `clothingItems` Collection

**Document ID**: Auto-generated

```json
{
	"userId": "user-uid-here",
	"imageUrl": "https://storage.googleapis.com/...",
	"clothingType": "upperwear", // "upperwear" | "lowerwear" | "accessories"
	"isNewlyBought": true,
	"isImpulsivelyBought": false,
	"usageFrequency": "occasionally", // "rarely" | "occasionally" | "frequently"
	"createdAt": "2024-11-05T10:30:00Z",
	"updatedAt": "2024-11-05T10:30:00Z",
	"currentScore": 85,
	"monthlyScores": {
		"2024-11": 85,
		"2024-12": 90
	}
}
```

### 3. `wearLogs` Collection

**Document ID**: Auto-generated

```json
{
	"clothingItemId": "clothing-item-doc-id",
	"wornDate": "2024-11-05T08:00:00Z",
	"createdAt": "2024-11-05T10:30:00Z"
}
```

### 4. `userEcoFitData` Collection

**Document ID**: User's UID from Firebase Auth

```json
{
	"userId": "user-uid-here",
	"currentOverallScore": 78,
	"monthlyScores": {
		"2024-10": 75,
		"2024-11": 78,
		"2024-12": 82
	},
	"totalClothingItems": 15,
	"lastUpdated": "2024-11-05T10:30:00Z"
}
```

## Firebase Security Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own clothing items
    match /clothingItems/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Users can read/write wear logs for their clothing items
    match /wearLogs/{logId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/clothingItems/$(resource.data.clothingItemId)) &&
        get(/databases/$(database)/documents/clothingItems/$(resource.data.clothingItemId)).data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        exists(/databases/$(database)/documents/clothingItems/$(request.resource.data.clothingItemId)) &&
        get(/databases/$(database)/documents/clothingItems/$(request.resource.data.clothingItemId)).data.userId == request.auth.uid;
    }

    // Users can read/write their own EcoFit data
    match /userEcoFitData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Firebase Storage Structure

For clothing images, the storage structure will be:

```
clothing/
  ├── {userId}/
      ├── clothing_1699187400123.jpg
      ├── clothing_1699187500456.jpg
      └── ...
```

## Setup Steps in Firebase Console

### 1. Firestore Database

1. Go to Firebase Console → Your Project → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location
5. After creation, go to "Rules" tab and paste the security rules above

### 2. Storage

1. Go to Firebase Console → Your Project → Storage
2. Click "Get started"
3. Choose "Start in test mode"
4. Select your preferred location
5. After creation, go to "Rules" tab and add these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /clothing/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Indexes (REQUIRED) ⚠️

Go to Firestore → Indexes and create these composite indexes:

1. **clothingItems collection** (REQUIRED):
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   - **Quick Fix**: Click this direct link from your error message:
     ```
     https://console.firebase.google.com/v1/r/project/ecofit-21d05/firestore/indexes?create_composite=ClJwcm9qZWN0cy9lY29maXQtMjFkMDUvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Nsb3RoaW5nSXRlbXMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
     ```
2. **wearLogs collection** (for future features):
   - Fields: `clothingItemId` (Ascending), `wornDate` (Descending)

> ⚠️ **Important**: Index creation takes 5-10 minutes. Your app won't work until the index is built!

## Testing Your Setup

1. **Create Index First**: Click the link above to create the required index
2. **Wait 5-10 minutes**: Index building takes time
3. Create a user account through your app
4. Add a clothing item through the "New" tab
5. Check Firestore console to see if documents are created correctly
6. Check Storage console to see if the image was uploaded

## Troubleshooting

### "The query requires an index" Error

- **Solution**: Click the index creation link provided in the error message
- **Wait Time**: Indexes take 5-10 minutes to build
- **Check Status**: Go to Firestore Console → Indexes to see build progress

### "Permission denied" Errors

- **Solution**: Make sure you've added the security rules above
- **Check**: Verify the user is properly authenticated

### Images not uploading

- **Solution**: Make sure you've added the Storage security rules
- **Check**: Verify Storage is enabled in Firebase Console

## EcoFit Scoring System

### Initial Score Calculation:

- **Base Score by Frequency**:

  - Rarely: 20 points
  - Occasionally: 60 points
  - Frequently: 100 points

- **Penalties**:
  - Impulsive Purchase: -30 points
  - Newly Bought: -10 points

### Dynamic Score Updates:

- Tracks actual wear frequency vs. stated frequency
- Rewards items worn more than expected
- Penalizes items worn less than expected
- Long-term bonus for consistent usage (after 3 months)

### Monthly Tracking:

- Each month gets its own score in the `monthlyScores` object
- Overall score is calculated from all clothing items
- Home page displays current month's score and overall trend
