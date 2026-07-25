"use client";

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  EmailAuthProvider,
GoogleAuthProvider,
reauthenticateWithCredential,
reauthenticateWithPopup,
signInWithPopup,
  type User,
} from "firebase/auth";

import {
  firebaseAuth,
} from "@/lib/firebase";

import type {
  AuthContextValue,
} from "@/types/auth";

export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

type AuthProviderProps = {
  children: ReactNode;
};

function getAuthErrorMessage(
  error: unknown,
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const errorCode = String(
      error.code,
    );

    if (
      errorCode ===
      "auth/email-already-in-use"
    ) {
      return "An account already exists with this email.";
    }

    if (
      errorCode ===
      "auth/invalid-email"
    ) {
      return "Enter a valid email address.";
    }

    if (
      errorCode ===
        "auth/invalid-credential" ||
      errorCode ===
        "auth/wrong-password" ||
      errorCode ===
        "auth/user-not-found"
    ) {
      return "The email or password is incorrect.";
    }

    if (
      errorCode ===
      "auth/weak-password"
    ) {
      return "Use a stronger password with at least six characters.";
    }

    if (
      errorCode ===
      "auth/too-many-requests"
    ) {
      return "Too many attempts were made. Wait a moment and try again.";
    }
  }

  return "Authentication could not be completed.";
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        firebaseAuth,
        (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        },
        (authError) => {
          console.error(
            "Authentication state error:",
            authError,
          );

          setError(
            "Your authentication state could not be loaded.",
          );

          setIsLoading(false);
        },
      );

    return unsubscribe;
  }, []);

  async function createAccount(
    name: string,
    email: string,
    password: string,
  ) {
    setError(null);

    try {
      const credential =
        await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password,
        );

      await updateProfile(
        credential.user,
        {
          displayName: name,
        },
      );

      await credential.user.reload();

      setUser(
        firebaseAuth.currentUser,
      );
    } catch (accountError) {
      console.error(
        "Could not create account:",
        accountError,
      );

      const message =
        getAuthErrorMessage(
          accountError,
        );

      setError(message);
      throw accountError;
    }
  }

  async function signIn(
    email: string,
    password: string,
  ) {
    setError(null);

    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
    } catch (signInError) {
      console.error(
        "Could not sign in:",
        signInError,
      );

      const message =
        getAuthErrorMessage(
          signInError,
        );

      setError(message);
      throw signInError;
    }
  }

  async function signOutUser() {
    setError(null);

    try {
      await signOut(firebaseAuth);
    } catch (signOutError) {
      console.error(
        "Could not sign out:",
        signOutError,
      );

      setError(
        "You could not be signed out.",
      );

      throw signOutError;
    }
  }

  async function sendPasswordReset(
  email: string,
) {
  setError(null);

  try {
    await sendPasswordResetEmail(
      firebaseAuth,
      email.trim(),
    );
  } catch (resetError) {
    console.error(
      "Could not send password reset email:",
      resetError,
    );

    const message =
      getAuthErrorMessage(
        resetError,
      );

    setError(message);

    throw resetError;
  }
}

async function sendVerificationEmail() {
  setError(null);

  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error(
      "No authenticated user.",
    );
  }

  try {
    await sendEmailVerification(
      currentUser,
    );
  } catch (verificationError) {
    console.error(
      "Could not send verification email:",
      verificationError,
    );

    setError(
      "The verification email could not be sent.",
    );

    throw verificationError;
  }
}

async function refreshUser() {
  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    return;
  }

  await currentUser.reload();

  setUser(
    firebaseAuth.currentUser,
  );
}

async function signInWithGoogle() {
  setError(null);

  try {
    const provider =
      new GoogleAuthProvider();

    await signInWithPopup(
      firebaseAuth,
      provider,
    );
  } catch (googleError) {
    console.error(
      "Could not sign in with Google:",
      googleError,
    );

    setError(
      "Google sign-in could not be completed.",
    );

    throw googleError;
  }
}

async function reauthenticatePassword(
  password: string,
) {
  setError(null);

  const currentUser =
    firebaseAuth.currentUser;

  if (
    !currentUser ||
    !currentUser.email
  ) {
    throw new Error(
      "Password reauthentication is unavailable.",
    );
  }

  const credential =
    EmailAuthProvider.credential(
      currentUser.email,
      password,
    );

  await reauthenticateWithCredential(
    currentUser,
    credential,
  );
}

async function reauthenticateGoogle() {
  setError(null);

  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error(
      "No authenticated user.",
    );
  }

  const provider =
    new GoogleAuthProvider();

  await reauthenticateWithPopup(
    currentUser,
    provider,
  );
}

  function clearAuthError() {
    setError(null);
  }

  async function deleteAccount() {
  setError(null);

  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error(
      "No authenticated user.",
    );
  }

  try {
    await deleteUser(
      currentUser,
    );

    setUser(null);
  } catch (deleteError) {
    console.error(
      "Could not delete account:",
      deleteError,
    );

    setError(
      "Your account could not be deleted. You may need to sign in again first.",
    );

    throw deleteError;
  }
}

  return (
    <AuthContext.Provider
      value={{
  user,
  isLoading,
  error,
  createAccount,
  signIn,
  signOutUser,
  sendPasswordReset,
  clearAuthError,
  sendVerificationEmail,
  refreshUser,
  deleteAccount,
  signInWithGoogle,
reauthenticatePassword,
reauthenticateGoogle,
}}
    >
      {children}
    </AuthContext.Provider>
  );
}

