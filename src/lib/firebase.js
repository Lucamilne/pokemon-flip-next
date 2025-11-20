import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInAnonymously, signInWithPopup, linkWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client-side
let app;
let auth;
let db;
let analytics;
let googleProvider;

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  googleProvider = new GoogleAuthProvider();
}

// Export with fallbacks for server-side rendering
export { auth, db, analytics, googleProvider, signInAnonymously, signInWithPopup, linkWithPopup };
export default app;
