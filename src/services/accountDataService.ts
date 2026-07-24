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

  if (snapshot.empty) {
    return;
  }

  const batch =
    writeBatch(
      firestoreDatabase,
    );

  snapshot.docs.forEach(
    (documentSnapshot) => {
      batch.delete(
        documentSnapshot.ref,
      );
    },
  );

  await batch.commit();
}

export async function deleteUserCloudData(
  userId: string,
) {
  await Promise.all([
    deleteCollectionDocuments(
      userId,
      "assignments",
    ),

    deleteCollectionDocuments(
      userId,
      "studySessions",
    ),

    deleteCollectionDocuments(
      userId,
      "courses",
    ),

    deleteCollectionDocuments(
      userId,
      "grades",
    ),

    deleteCollectionDocuments(
      userId,
      "settings",
    ),
  ]);

  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
    ),
  );
}