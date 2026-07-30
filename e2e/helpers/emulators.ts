const projectId =
  "demo-ap-path-planner";

const firestoreBaseUrl =
  `http://127.0.0.1:8085/emulator/v1/projects/${projectId}/databases/(default)/documents`;

export async function clearFirestoreEmulator() {
  const response =
    await fetch(
      firestoreBaseUrl,
      {
        method:
          "DELETE",
      },
    );

  if (
    !response.ok
  ) {
    const responseText =
      await response.text();

    throw new Error(
      `Could not clear the Firestore Emulator: ${response.status} ${responseText}`,
    );
  }
}