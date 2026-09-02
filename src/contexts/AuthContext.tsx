import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Guest mode
 * ----------
 * The dashboard can run on preview/staging domains that are NOT in the
 * Firebase Console "Authorized domains" list. When that happens, every
 * Firebase auth call throws `auth/unauthorized-domain`.
 *
 * To keep the dashboard usable in those environments, we expose a
 * `signInAsGuest()` method that creates an in-memory synthetic user
 * WITHOUT touching Firebase. All UI gates check `user` (real or guest),
 * so once a guest signs in, the dashboard renders normally.
 *
 * Optional features that genuinely require a Firebase user (e.g. writing
 * to Firestore with security rules requiring auth) will simply fail
 * gracefully for guest users — the dashboard's read-only views still work.
 */

const GUEST_STORAGE_KEY = 'hrvl_guest_user';

interface GuestUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest: true;
}

// AuthContext exposes a union type — callers shouldn't care whether
// the user is real or guest for UI gating purposes.
type AnyUser = User | GuestUser;

function isGuestUser(u: AnyUser | null): u is GuestUser {
  return !!u && (u as GuestUser).isGuest === true;
}

function loadGuestFromStorage(): GuestUser | null {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.isGuest === true && parsed.uid) {
      return parsed as GuestUser;
    }
  } catch {
    // ignore corrupted storage
  }
  return null;
}

function saveGuestToStorage(g: GuestUser | null) {
  try {
    if (g) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(g));
    } else {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

interface AuthContextType {
  user: AnyUser | null;
  loading: boolean;
  accessToken: string | null;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<string | null>;
  signInAsGuest: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AnyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // First, restore any previously signed-in guest from localStorage so
    // a refresh doesn't kick the user back to the sign-in screen.
    const restoredGuest = loadGuestFromStorage();
    if (restoredGuest) {
      setUser(restoredGuest);
      setLoading(false);
      // We still subscribe to Firebase auth changes below — if a real
      // Firebase user exists, it will override the guest.
    }

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // Real Firebase user wins over guest.
          setUser(fbUser);
          saveGuestToStorage(null);
        } else if (!restoredGuest) {
          // No Firebase user and no cached guest — stay signed out.
          setUser(null);
        }
        // Note: if restoredGuest exists and no Firebase user, we keep the guest.
        if (!fbUser) {
          setAccessToken(null);
        }
        setLoading(false);
      });
    } catch (err) {
      // Firebase auth itself can throw on misconfigured environments —
      // swallow and just drop out of loading state.
      console.warn('Firebase onAuthStateChanged unavailable, continuing in guest-only mode:', err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    // Clear guest regardless of Firebase state.
    saveGuestToStorage(null);
    setAccessToken(null);
    try {
      await signOut(auth);
    } catch (err) {
      // signOut may throw if auth is unavailable — that's fine, we've
      // already cleared local state.
      console.warn('Firebase signOut skipped:', err);
    }
    setUser(null);
  };

  const signInWithGoogle = async (): Promise<string | null> => {
    const provider = new GoogleAuthProvider();
    // Removed Drive scopes to prevent unverified app warning

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    if (token) {
      setAccessToken(token);
    }
    // onAuthStateChanged will set the real user; clear any guest.
    saveGuestToStorage(null);
    return token;
  };

  const signInAsGuest = () => {
    const guest: GuestUser = {
      uid: `guest-${Math.random().toString(36).slice(2, 10)}`,
      email: 'guest@hrvl-dashboard.local',
      displayName: 'Guest User',
      photoURL: null,
      isGuest: true,
    };
    saveGuestToStorage(guest);
    setUser(guest);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        logout,
        signInWithGoogle,
        signInAsGuest,
        isGuest: isGuestUser(user),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
