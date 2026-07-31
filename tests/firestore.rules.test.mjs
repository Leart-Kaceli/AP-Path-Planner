import fs from "node:fs";
import {
  after,
  before,
  beforeEach,
  test,
} from "node:test";


import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

let testEnv;

before(async () => {
  testEnv =
    await initializeTestEnvironment({
      projectId:
        "demo-ap-path-planner",

      firestore: {
        rules:
          fs.readFileSync(
            "firestore.rules",
            "utf8",
          ),
      },
    });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv.cleanup();
});

test(
  "user can write own assignment",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "assignments",
          "assignment-1",
        ),
        {
          id: "assignment-1",
          title: "Practice FRQ",
          course:
            "AP Calculus BC",
          dueDate: "2026-08-10",
          priority: "Medium",
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "user cannot write another user's assignment",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-b",
          "assignments",
          "assignment-1",
        ),
        {
          id: "assignment-1",
          title: "Practice FRQ",
          course:
            "AP Calculus BC",
          dueDate: "2026-08-10",
          priority: "Medium",
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "invalid assignment priority is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "assignments",
          "assignment-1",
        ),
        {
          id: "assignment-1",
          title: "Practice FRQ",
          course:
            "AP Calculus BC",
          dueDate: "2026-08-10",
          priority: "Extreme",
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "signed-out user cannot access private data",
  async () => {
    const database =
      testEnv
        .unauthenticatedContext()
        .firestore();

    await assertFails(
      getDoc(
        doc(
          database,
          "users",
          "user-a",
          "assignments",
          "assignment-1",
        ),
      ),
    );
  },
);

test(
  "user cannot read another user's assignment",
  async () => {
    await testEnv
      .withSecurityRulesDisabled(
        async (context) => {
          await setDoc(
            doc(
              context.firestore(),
              "users",
              "user-b",
              "assignments",
              "assignment-1",
            ),
            {
              id: "assignment-1",
              title: "Private",
              course:
                "AP Calculus BC",
              dueDate:
                "2026-08-10",
              priority:
                "Medium",
              completed: false,
              completedAt: null,
              notes: "",
            },
          );
        },
      );

          const database =
      testEnv
        .authenticatedContext("user-a")
        .firestore();

    await assertFails(
      getDoc(
        doc(
          database,
          "users",
          "user-b",
          "assignments",
          "assignment-1",
        ),
      ),
    );
  },
);

      test(
  "user can write own course",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "courses",
          "course-1",
        ),
        {
          id: "course-1",
          name: "AP Physics C",
          teacher: "Ms. Velasco",
          goalScore: 5,
          progress: 25,
        },
      ),
    );
  },
);

test(
  "user cannot write another user's course",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-b",
          "courses",
          "course-1",
        ),
        {
          id: "course-1",
          name: "AP Physics C",
          teacher: "Ms. Velasco",
          goalScore: 5,
          progress: 25,
        },
      ),
    );
  },
);

test(
  "invalid course goal score is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "courses",
          "course-1",
        ),
        {
          id: "course-1",
          name: "AP Physics C",
          teacher: "Ms. Velasco",
          goalScore: 7,
          progress: 25,
        },
      ),
    );
  },
);

test(
  "user can write own valid study session",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "studySessions",
          "session-1",
        ),
        {
          id: "session-1",
          course: "AP Physics C",
          topic: "Momentum review",
          date: "2026-08-01",
          startTime: "16:00",
          durationMinutes: 45,
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "another user cannot read a study session",
  async () => {
    const ownerDatabase =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    const otherUserDatabase =
      testEnv
        .authenticatedContext(
          "user-b",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          ownerDatabase,
          "users",
          "user-a",
          "studySessions",
          "session-1",
        ),
        {
          id: "session-1",
          course: "AP Physics C",
          topic: "Momentum review",
          date: "2026-08-01",
          startTime: "16:00",
          durationMinutes: 45,
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );

    await assertFails(
      getDoc(
        doc(
          otherUserDatabase,
          "users",
          "user-a",
          "studySessions",
          "session-1",
        ),
      ),
    );
  },
);

test(
  "another user cannot write a study session",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-b",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "studySessions",
          "session-1",
        ),
        {
          id: "session-1",
          course: "AP Physics C",
          topic: "Momentum review",
          date: "2026-08-01",
          startTime: "16:00",
          durationMinutes: 45,
          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "invalid study-session duration type is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "studySessions",
          "session-1",
        ),
        {
          id: "session-1",
          course: "AP Physics C",
          topic: "Momentum review",
          date: "2026-08-01",
          startTime: "16:00",

          // Invalid: must be a number.
          durationMinutes: "45",

          completed: false,
          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "invalid study-session completed type is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "studySessions",
          "session-2",
        ),
        {
          id: "session-2",
          course: "AP Physics C",
          topic: "Momentum review",
          date: "2026-08-02",
          startTime: "16:00",
          durationMinutes: 45,

          // Invalid: must be Boolean.
          completed: "false",

          completedAt: null,
          notes: "",
        },
      ),
    );
  },
);

test(
  "user can write own valid grade",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "grades",
          "grade-1",
        ),
        {
          id: "grade-1",
          course: "AP Physics C",
          title: "Unit Test",
          category: "Test",
          earnedPoints: 92,
          possiblePoints: 100,
          date: "2026-08-01",
        },
      ),
    );
  },
);

test(
  "another user cannot read a grade",
  async () => {
    const ownerDatabase =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    const otherUserDatabase =
      testEnv
        .authenticatedContext(
          "user-b",
        )
        .firestore();

    await assertSucceeds(
      setDoc(
        doc(
          ownerDatabase,
          "users",
          "user-a",
          "grades",
          "grade-1",
        ),
        {
          id: "grade-1",
          course: "AP Physics C",
          title: "Unit Test",
          category: "Test",
          earnedPoints: 92,
          possiblePoints: 100,
          date: "2026-08-01",
        },
      ),
    );

    await assertFails(
      getDoc(
        doc(
          otherUserDatabase,
          "users",
          "user-a",
          "grades",
          "grade-1",
        ),
      ),
    );
  },
);

test(
  "another user cannot write a grade",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-b",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "grades",
          "grade-1",
        ),
        {
          id: "grade-1",
          course: "AP Physics C",
          title: "Unit Test",
          category: "Test",
          earnedPoints: 92,
          possiblePoints: 100,
          date: "2026-08-01",
        },
      ),
    );
  },
);

test(
  "invalid grade category is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "grades",
          "grade-2",
        ),
        {
          id: "grade-2",
          course: "AP Physics C",
          title: "Unit Exam",

          // Invalid enum value.
          category: "Exam",

          earnedPoints: 92,
          possiblePoints: 100,
          date: "2026-08-01",
        },
      ),
    );
  },
);

test(
  "invalid grade points type is rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "grades",
          "grade-3",
        ),
        {
          id: "grade-3",
          course: "AP Physics C",
          title: "Unit Test",
          category: "Test",

          // Invalid: must be numeric.
          earnedPoints: "92",

          possiblePoints: 100,
          date: "2026-08-01",
        },
      ),
    );
  },
);

test(
  "nonpositive possible grade points are rejected",
  async () => {
    const database =
      testEnv
        .authenticatedContext(
          "user-a",
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          database,
          "users",
          "user-a",
          "grades",
          "grade-4",
        ),
        {
          id: "grade-4",
          course: "AP Physics C",
          title: "Unit Test",
          category: "Test",
          earnedPoints: 0,

          // Invalid: must be greater than zero.
          possiblePoints: 0,

          date: "2026-08-01",
        },
      ),
    );
  },
);
