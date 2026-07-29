import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import CourseForm from "@/components/courses/CourseForm";

describe(
  "CourseForm",
  () => {
    it(
      "does not save an empty form",
      async () => {
        const user =
          userEvent.setup();

        const onSaveCourse =
          vi.fn();

        render(
          <CourseForm
            courseToEdit={
              null
            }
            onSaveCourse={
              onSaveCourse
            }
            onCancelEdit={
              vi.fn()
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /add course|save course/i,
            },
          ),
        );

        expect(
          onSaveCourse,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "allows a user to enter a course name",
      async () => {
        const user =
          userEvent.setup();

        render(
          <CourseForm
            courseToEdit={
              null
            }
            onSaveCourse={
              vi.fn()
            }
            onCancelEdit={
              vi.fn()
            }
          />,
        );

        const courseInput =
          screen.getByLabelText(
            /course name/i,
          );

        await user.type(
          courseInput,
          "AP Computer Science A",
        );

        expect(
          courseInput,
        ).toHaveValue(
          "AP Computer Science A",
        );
      },
    );

    it(
      "loads the course being edited",
      () => {
        render(
          <CourseForm
            courseToEdit={{
              id: "course-1",
              name:
                "AP Physics C",
              teacher:
                "Mr. Smith",
              goalScore: 5,
              progress: 50,
            }}
            onSaveCourse={
              vi.fn()
            }
            onCancelEdit={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByLabelText(
            /course name/i,
          ),
        ).toHaveValue(
          "AP Physics C",
        );
      },
    );

    it(
      "calls the cancel callback while editing",
      async () => {
        const user =
          userEvent.setup();

        const onCancelEdit =
          vi.fn();

        render(
          <CourseForm
            courseToEdit={{
              id: "course-1",
              name:
                "AP Physics C",
              teacher:
                "Mr. Smith",
              goalScore: 5,
              progress: 50,
            }}
            onSaveCourse={
              vi.fn()
            }
            onCancelEdit={
              onCancelEdit
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name: /cancel/i,
            },
          ),
        );

        expect(
          onCancelEdit,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);