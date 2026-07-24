import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

import {
  DEFAULT_STUDENT_PROFILE,
} from "@/constants/profile";

import {
  PROFILE_STORAGE_KEY,
} from "@/constants/storage";

import type {
  StudentProfile,
} from "@/types/profile";

function normalizeProfile(
  profile:
    Partial<StudentProfile>,
): StudentProfile {
  return {
    ...DEFAULT_STUDENT_PROFILE,
    ...profile,
  };
}

export async function loadLocalProfile() {
  try {
    const storedProfile =
      localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!storedProfile) {
      return DEFAULT_STUDENT_PROFILE;
    }

    return normalizeProfile(
      JSON.parse(
        storedProfile,
      ) as Partial<StudentProfile>,
    );
  } catch {
    return DEFAULT_STUDENT_PROFILE;
  }
}

export async function saveLocalProfile(
  profile: StudentProfile,
) {
  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );
}

export async function loadProfile(
  userId?: string | null,
) {
  if (!userId) {
    return loadLocalProfile();
  }

  const profileReference =
    doc(
      firestoreDatabase,
      "users",
      userId,
    );

  const snapshot =
    await getDoc(
      profileReference,
    );

  if (snapshot.exists()) {
    return normalizeProfile(
      snapshot.data() as
        Partial<StudentProfile>,
    );
  }

  const localProfile =
    await loadLocalProfile();

  await setDoc(
    profileReference,
    localProfile,
    {
      merge: true,
    },
  );

  return localProfile;
}

export async function saveProfile(
  profile: StudentProfile,
  userId?: string | null,
) {
  if (!userId) {
    await saveLocalProfile(
      profile,
    );

    return;
  }

  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
    ),
    profile,
    {
      merge: true,
    },
  );

  // Keep a local copy so the theme can
  // be applied before Firebase finishes.
  await saveLocalProfile(
    profile,
  );
}