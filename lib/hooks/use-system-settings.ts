"use client";

import { useState, useCallback, useEffect } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { SystemSettings, Currency } from "../types"; // Assuming Currency is needed for defaultCurrency

// Firestore collection and document ID
const SETTINGS_COLLECTION = 'settings';
const GLOBAL_SETTINGS_DOC_ID = 'global_app_settings';

// Helper to convert Firestore doc data to SystemSettings type
const fromFirestore = (snapshot: DocumentSnapshot<DocumentData>): SystemSettings => {
  const data = snapshot.data() as DocumentData; // Ensure data is treated as DocumentData
  return {
    id: snapshot.id,
    companyName: data.companyName || "", // Default to empty string if not set
    companyEmail: data.companyEmail || "",
    companyPhone: data.companyPhone || "",
    companyAddress: data.companyAddress || "",
    defaultCurrency: data.defaultCurrency || "USD" as Currency, // Default currency
    language: data.language || "en",
    timezone: data.timezone || "UTC",
    dateFormat: data.dateFormat || "MM/DD/YYYY",
    logoUrl: data.logoUrl,
    
    // Notification Preferences
    enableEmailNotifications: data.enableEmailNotifications === undefined ? true : data.enableEmailNotifications, // Default to true if undefined
    enableSmsNotifications: data.enableSmsNotifications === undefined ? false : data.enableSmsNotifications, // Default to false
    enableBrowserNotifications: data.enableBrowserNotifications === undefined ? true : data.enableBrowserNotifications, // Default to true

    // Email SMTP Configuration
    smtpHost: data.smtpHost,
    smtpPort: data.smtpPort,
    smtpUsername: data.smtpUsername,
    smtpPassword: data.smtpPassword,
    smtpEncryption: data.smtpEncryption,
    useSmtpAuth: data.useSmtpAuth === undefined ? false : data.useSmtpAuth,

    // Security Settings
    minPasswordLength: data.minPasswordLength === undefined ? 8 : data.minPasswordLength,
    requireUppercasePassword: data.requireUppercasePassword === undefined ? true : data.requireUppercasePassword,
    requireNumbersInPassword: data.requireNumbersInPassword === undefined ? true : data.requireNumbersInPassword,
    requireSymbolsInPassword: data.requireSymbolsInPassword === undefined ? true : data.requireSymbolsInPassword,
    passwordExpiryDays: data.passwordExpiryDays === undefined ? 0 : data.passwordExpiryDays, // 0 for never
    enableTwoFactorAuth: data.enableTwoFactorAuth === undefined ? false : data.enableTwoFactorAuth,
    twoFactorAuthMethod: data.twoFactorAuthMethod || "app",
    sessionTimeoutMinutes: data.sessionTimeoutMinutes === undefined ? 30 : data.sessionTimeoutMinutes,

    // Backup Settings
    enableAutoBackups: data.enableAutoBackups === undefined ? true : data.enableAutoBackups,
    backupFrequency: data.backupFrequency || "daily",
    backupRetentionDays: data.backupRetentionDays === undefined ? 30 : data.backupRetentionDays,

    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as SystemSettings;
};

interface UseSystemSettingsReturn {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<Omit<SystemSettings, 'id' | 'updatedAt'>>) => Promise<void>;
}

export function useSystemSettings(): UseSystemSettingsReturn {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for system settings
  useEffect(() => {
    setLoading(true);
    const settingsDocRef = doc(firestore, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC_ID);
    
    const unsubscribe = onSnapshot(settingsDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          try {
            setSettings(fromFirestore(docSnap));
            setError(null);
          } catch (e: any) {
            console.error("Error processing system settings document data:", e);
            setError(`Failed to process settings data: ${e.message}`);
            // Keep previous settings or set to null/default? For now, keeping previous.
            // setSettings(null); 
          }
        } else {
          console.warn(`Settings document "${GLOBAL_SETTINGS_DOC_ID}" does not exist. Using client-side defaults or null.`);
          // If document doesn't exist, you could initialize with client-side defaults
          // For example: setSettings(createDefaultSettings());
          // For now, setting to null as per subtask description.
          setSettings(null); 
        }
        setLoading(false);
      }, 
      (err) => {
        console.error("Error fetching system settings with onSnapshot: ", err);
        setError(`Failed to subscribe to settings updates: ${err.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Update settings operation
  const updateSettings = useCallback(async (
    newSettings: Partial<Omit<SystemSettings, 'id' | 'updatedAt'>>
  ) => {
    // setLoading(true); // Consider specific loading state for update operation
    setError(null);
    try {
      const settingsDocRef = doc(firestore, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC_ID);
      const dataToSave = {
        ...newSettings,
        updatedAt: Timestamp.now(),
        // id is implicitly GLOBAL_SETTINGS_DOC_ID due to docRef
      };
      
      await setDoc(settingsDocRef, dataToSave, { merge: true });
      // setLoading(false);
      // onSnapshot will update the local state
    } catch (err: any) {
      console.error("Error updating system settings: ", err);
      setError(`Failed to update settings: ${err.message}`);
      // setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}
