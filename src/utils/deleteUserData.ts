import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

const userDataCollections = [
  "assignments",
  "courses",
  "grades",
  "studySessions",
] as const;

const maximumBatchSize = 400;

async function deleteCollectionDocuments(
  userId: string,
  collectionName: string,
) {
  const snapshot =
    await getDocs(
      collection(
        firestoreDatabase,
        "users",
        userId,
        collectionName,
      ),
    );

  for (
    let index = 0;
    index < snapshot.docs.length;
    index += maximumBatchSize
  ) {
    const batch =
      writeBatch(
        firestoreDatabase,
      );

    const batchDocuments =
      snapshot.docs.slice(
        index,
        index + maximumBatchSize,
      );

    for (
      const documentSnapshot
      of batchDocuments
    ) {
      batch.delete(
        documentSnapshot.ref,
      );
    }

    await batch.commit();
  }
}

export async function deleteUserApplicationData(
  userId: string,
) {
  for (
    const collectionName
    of userDataCollections
  ) {
    await deleteCollectionDocuments(
      userId,
      collectionName,
    );
  }

  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "gradeWeights",
    ),
  ).catch(() => undefined);

  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
    ),
  ).catch(() => undefined);
}