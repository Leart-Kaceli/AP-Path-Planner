import {
  FirebaseError,
} from "firebase/app";

export function getAccountDeletionErrorMessage(
  error: unknown,
) {
  if (
    error instanceof
    FirebaseError
  ) {
    if (
      error.code ===
      "auth/requires-recent-login"
    ) {
      return "For security, please sign out, sign back in, and try deleting the account again.";
    }

    if (
      error.code ===
      "auth/network-request-failed"
    ) {
      return "The account could not be deleted because the network request failed.";
    }
  }

  return "The account could not be deleted. Please try again.";
}