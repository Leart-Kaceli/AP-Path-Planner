import type {
  User,
} from "firebase/auth";

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  createAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;

  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;

  signOutUser: () => Promise<void>;

  clearAuthError: () => void;
};