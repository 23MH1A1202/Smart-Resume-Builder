import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  // Using AI Studio auto-provisioned setup, we just need project ID and it will use default environment if hosted,
  // but for local dev with real auth we need full config. 
  // Wait, if AI Studio provisioned it, it's accessible. For now, since we only know project ID,
  // we can use a dummy config or prompt user. The tool set_up_firebase provisions it and usually
  // AI Studio injects the config at runtime for Firebase Hosting, but we are in Cloud Run.
  // We can just rely on the user to provide the config or mock the auth UI if config is missing.
  // Actually, we can use a placeholder and warn if it's not set.
  projectId: "gen-lang-client-0241781316",
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: `${"gen-lang-client-0241781316"}.firebaseapp.com`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
