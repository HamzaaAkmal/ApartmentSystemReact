"use client";

import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  Timestamp,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { Apartment, Building, Client } from "../types";

// Firestore collection names
const APARTMENTS_COLLECTION = 'apartments';
const BUILDINGS_COLLECTION = 'buildings';

// Minimal local fromFirestore helper for Apartment
const fromFirestoreApartment = (snapshot: DocumentSnapshot<DocumentData>): Apartment => {
  const data = snapshot.data() as DocumentData;
  return {
    id: snapshot.id,
    buildingId: data.buildingId,
    number: data.number,
    floor: data.floor,
    type: data.type,
    size: data.size,
    price: data.price,
    status: data.status,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Apartment;
};

// Minimal local fromFirestore helper for Building
const fromFirestoreBuilding = (snapshot: DocumentSnapshot<DocumentData>): Building => {
  const data = snapshot.data() as DocumentData;
  return {
    id: snapshot.id,
    name: data.name,
    address: data.address,
    floors: data.floors,
    units: data.units,
    status: data.status,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Building;
};

interface ApartmentDetails {
  apartment: Apartment | null;
  building: Building | null;
}

interface UseMyApartmentDetailsReturn {
  apartmentDetails: ApartmentDetails;
  loading: boolean;
  error: string | null;
}

export function useMyApartmentDetails(clientProfile: Client | null): UseMyApartmentDetailsReturn {
  const [apartmentDetails, setApartmentDetails] = useState<ApartmentDetails>({ apartment: null, building: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let apartmentUnsubscribe: (() => void) | undefined;
    let buildingUnsubscribe: (() => void) | undefined;

    const resetState = () => {
      setApartmentDetails({ apartment: null, building: null });
      setLoading(false);
      setError(null);
    };

    if (!clientProfile || !clientProfile.apartmentId) {
      resetState();
      if (clientProfile && !clientProfile.apartmentId) {
         // Client profile exists but no apartmentId, not necessarily an error, but no details to fetch.
        console.log("Client profile does not have an apartmentId.");
      }
      return;
    }

    setLoading(true);
    setError(null);
    const apartmentId = clientProfile.apartmentId;
    const apartmentDocRef = doc(firestore, APARTMENTS_COLLECTION, apartmentId);

    apartmentUnsubscribe = onSnapshot(apartmentDocRef, 
      async (aptDocSnap) => {
        if (aptDocSnap.exists()) {
          const apartmentData = fromFirestoreApartment(aptDocSnap);
          setApartmentDetails(prev => ({ ...prev, apartment: apartmentData }));

          if (apartmentData.buildingId) {
            const buildingDocRef = doc(firestore, BUILDINGS_COLLECTION, apartmentData.buildingId);
            buildingUnsubscribe = onSnapshot(buildingDocRef, 
              (bldDocSnap) => {
                if (bldDocSnap.exists()) {
                  setApartmentDetails(prev => ({ ...prev, building: fromFirestoreBuilding(bldDocSnap) }));
                  setError(null);
                } else {
                  console.warn(`Building document with ID ${apartmentData.buildingId} does not exist.`);
                  setApartmentDetails(prev => ({ ...prev, building: null }));
                  // Optionally set error if building is strictly expected
                  // setError("Building details not found for the apartment.");
                }
                setLoading(false); // Loading finished after attempting to fetch building
              },
              (bldError) => {
                console.error(`Error fetching building ${apartmentData.buildingId}:`, bldError);
                setError(`Failed to fetch building details: ${bldError.message}`);
                setApartmentDetails(prev => ({ ...prev, building: null }));
                setLoading(false);
              }
            );
          } else {
            console.warn(`Apartment ${apartmentId} does not have a buildingId.`);
            setApartmentDetails(prev => ({ ...prev, building: null }));
            setLoading(false); // No buildingId to fetch, so loading ends here
          }
        } else {
          console.warn(`Apartment document with ID ${apartmentId} does not exist.`);
          resetState(); // Reset all details if apartment not found
          // Optionally set an error if apartment is strictly expected
          // setError("Apartment details not found.");
        }
      }, 
      (aptError) => {
        console.error(`Error fetching apartment ${apartmentId}:`, aptError);
        setError(`Failed to fetch apartment details: ${aptError.message}`);
        resetState();
        setLoading(false);
      }
    );

    return () => {
      if (apartmentUnsubscribe) apartmentUnsubscribe();
      if (buildingUnsubscribe) buildingUnsubscribe();
    };
  }, [clientProfile]);

  return { apartmentDetails, loading, error };
}
