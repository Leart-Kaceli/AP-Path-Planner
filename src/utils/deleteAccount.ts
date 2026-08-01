import {
  deleteUser,
} from "firebase/auth";

import type {
  User,
} from "firebase/auth";

import {
  deleteUserApplicationData,
} from "@/utils/deleteUserData";

export async function permanentlyDeleteAccount(
  user: User,
) {
  await deleteUserApplicationData(
    user.uid,
  );

  await deleteUser(
    user,
  );
}
