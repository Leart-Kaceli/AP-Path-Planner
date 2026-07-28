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
      "prevents saving an empty course",
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
                /add course/i,
            },
          ),
        );

        expect(
          onSaveCourse,
        ).not.toHaveBeenCalled();
      },
    );
  },
);