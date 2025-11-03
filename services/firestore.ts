import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";

// Collections
const listingsCol = collection(db, "rewearListings");
const grabsCol = collection(db, "grabs");
const clothesCol = collection(db, "clothes");
const donationsCol = collection(db, "donations");

// Explore listings
export async function fetchExploreListings(category?: string) {
  const constraints = [where("isActive", "==", true), orderBy("createdAt", "desc"), limit(30)];
  // category filter (optional)
  const q = category && category !== "all"
    ? query(listingsCol, where("category", "==", category), ...constraints.slice(1))
    : query(listingsCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchMyListings(userId: string) {
  const q = query(listingsCol, where("ownerId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createGrab(params: { listingId: string; ownerId: string; grabberId: string; }) {
  return addDoc(grabsCol, {
    listingId: params.listingId,
    ownerId: params.ownerId,
    grabberId: params.grabberId,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function approveGrab(grabId: string, payload: { pickupLocationText: string; coords?: { latitude: number; longitude: number } }) {
  const ref = doc(db, "grabs", grabId);
  await updateDoc(ref, { status: "approved", pickupLocationText: payload.pickupLocationText, coords: payload.coords ?? null, updatedAt: serverTimestamp() });
}

export async function fetchMyPendingGrabs(userId: string) {
  const q = query(grabsCol, where("grabberId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createDonation(params: { donorId: string; items: string[]; orgId: string; orgName: string; orgAddress: string; }) {
  return addDoc(donationsCol, {
    donorId: params.donorId,
    items: params.items,
    orgId: params.orgId,
    orgName: params.orgName,
    orgAddress: params.orgAddress,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}


