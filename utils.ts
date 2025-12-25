import { GOOGLE_SHEET_API_URL } from "./constants";

export const calculateMultipliers = (poolA: number, poolB: number) => {
  const total = poolA + poolB;
  const multA = poolA === 0 ? 2.0 : parseFloat((total / poolA).toFixed(1));
  const multB = poolB === 0 ? 2.0 : parseFloat((total / poolB).toFixed(1));
  const percentA = total === 0 ? 50 : Math.round((poolA / total) * 100);
  return { multA, multB, total, percentA, percentB: 100 - percentA };
};

// Fix: Adding calculateOdds as it's required by BettingDrawer and Profile components to fix missing export errors
export const calculateOdds = (poolA: number, poolB: number) => {
  const { multA, multB } = calculateMultipliers(poolA, poolB);
  return { oddsA: multA, oddsB: multB };
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Simple Taptic simulation
export const triggerFeedback = () => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

/**
 * Sends email data to Google Sheet via App Script
 * FALLBACK: Also saves to LocalStorage so the MVP works without a backend.
 */
export const saveToWaitlist = async (email: string, source: string, points: number) => {
  // 1. ALWAYS Save to LocalStorage (MVP Persistence)
  try {
    localStorage.setItem('battle_waitlist_joined', 'true');
    localStorage.setItem('battle_waitlist_email', email);
    console.log(`[Local Mock] Saved to browser storage: ${email}`);
  } catch (e) {
    console.error("Local storage failed", e);
  }

  // Debug: Check if URL looks like a dev URL which often fails for external users
  if (GOOGLE_SHEET_API_URL.includes('/dev')) {
    console.warn("WARNING: You are using a Google Script '/dev' URL. This usually only works if you are logged into the script owner's Google account in the same browser. For public access, deploy as Web App with 'Anyone' access and use the '/exec' URL.");
  }

  // 2. Try sending to Google Sheet (Real Backend)
  if (GOOGLE_SHEET_API_URL.includes('YOUR_SCRIPT_ID_HERE')) {
    console.warn("Google Sheet API not configured. Data saved locally only.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return true; 
  }

  try {
    const data = { email, source, points };
    console.log("Attempting to send data to Sheet:", data, "URL:", GOOGLE_SHEET_API_URL);
    
    // Using fetch with no-cors mode for Google Apps Script Web App
    // Note: In no-cors mode, you CANNOT read the response status (it will always be opaque/0)
    // But the request will be sent.
    await fetch(GOOGLE_SHEET_API_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    console.log("Request sent (no-cors mode). Check Google Script Executions log.");
    return true;
  } catch (error) {
    console.error("Error saving to sheet:", error);
    // Return true anyway because we saved to LocalStorage, so from UX perspective it succeeded
    return true;
  }
};