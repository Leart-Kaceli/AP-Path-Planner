# AP Path Planner Development Notes

---

# Day 1 Completed

## Development Environment

- Installed Node.js
- Installed Git
- Installed VS Code
- Installed required extensions
- Created GitHub repository
- Connected GitHub to local project

## Next.js Setup

- Created a Next.js project using TypeScript
- Installed project dependencies
- Configured Tailwind CSS
- Started local development server
- Verified website runs on localhost:3000

## Git & GitHub

- Learned basic Git workflow
- Configured Git username and email
- Learned:
  - git status
  - git add
  - git commit
  - git push
- Successfully pushed the first version of the project to GitHub

## Website

- Explored the project structure
- Learned the purpose of:
  - src/app
  - page.tsx
  - layout.tsx
  - globals.css
  - package.json
- Replaced the default Next.js homepage with an AP Path Planner homepage

## React Concepts Learned

- React Components
- JSX
- Imports & Exports
- Project structure
- Basic TypeScript

## Challenges Solved

- npm ENOENT errors
- Incorrect project directory
- Multiple package-lock.json files
- Git remote setup
- GitHub connection
- Next.js workspace warning

## Next Steps

- Build the navigation bar
- Create landing page
- Design hero section
- Build reusable components
- Learn more React

---

# Day 2 Completed

## Landing Page

Built the first complete version of the homepage.

### Navigation

Created a reusable Navbar component with:
- Logo
- Features link
- About link
- Get Started button

### Hero Section

Created:
- Main headline
- Tagline
- Call-to-action buttons
- Responsive layout

### Features Section

Created six feature cards:

- Course Management
- Assignment Tracking
- Study Planning
- Grade Tracking
- AP Score Predictor
- Progress Dashboard

Learned how to use arrays and `.map()` to generate reusable cards.

### About Section

Added an overview explaining the purpose of AP Path Planner and its mission.

### Footer

Created a footer containing:
- Copyright
- Independent project disclaimer
- College Board disclaimer

### Dashboard

Created a placeholder Dashboard page that will later contain:
- Courses
- Assignments
- Calendar
- Analytics

### Branding

- Added custom favicon
- Updated browser metadata
- Improved project branding

## React Concepts Learned

- Creating reusable components
- Component organization
- Importing and exporting components
- Next.js Link component
- Tailwind utility classes
- Flexbox layouts
- Responsive design
- Component-based architecture

## Problems Solved

- Component folder placed in the wrong location
- Import path errors
- Duplicate PROJECT_NOTES.md
- Git staging mistakes
- Next.js module resolution errors

## Git Progress

Learned how to:
- Stage files
- Commit changes
- Push updates
- Resolve Git merge issues
- Keep the repository organized

## Current Website Features

✅ Responsive Navbar

✅ Hero Section

✅ Feature Cards

✅ About Section

✅ Footer

✅ Dashboard Placeholder

✅ Branding

## Next Steps (Day 3)

- Improve landing page visuals
- Build sidebar navigation
- Create dashboard layout
- Build reusable dashboard cards
- Learn React state (`useState`)
- Connect Firebase
- Begin implementing real functionality


# Day 3 Completed

## Dashboard Development

- Created the main dashboard layout
- Built a responsive sidebar
- Added dashboard navigation
- Created a dashboard header
- Created four summary statistic cards
- Added AP course cards
- Added progress bars
- Created an upcoming assignments section
- Created a weekly progress section
- Added placeholder pages for future features

## React Concepts Learned

- React state with useState
- Client components with "use client"
- Props
- TypeScript prop types
- Arrays and map()
- Conditional styling
- Dynamic inline styles
- Reusable components

## Next.js Concepts Learned

- App Router page structure
- Creating routes using folders
- Navigating with Link
- Client and server components
- Import aliases

## Day 4 Goals

- Build the course management interface
- Add a form for creating courses
- Learn controlled form inputs
- Learn event handling
- Allow courses to be added and removed


# Day 4 Completed

## Course Management

- Replaced the Courses placeholder with an interactive course manager
- Created a form for adding AP courses
- Added course name, teacher, goal score, and progress inputs
- Added form validation
- Created reusable course cards
- Added course deletion
- Added an empty-state message
- Added automatically updating course statistics
- Added average progress calculations
- Added goal-score statistics

## React Concepts Learned

- Controlled form inputs
- React form submission
- Event handling
- useState with arrays
- Adding items with the spread operator
- Removing items with filter()
- Conditional rendering
- Lifting state up
- Passing callback functions through props
- Derived values
- Resetting form state

## TypeScript Concepts Learned

- Custom object types
- Union types
- Function prop types
- Typed React form events
- Arrays containing typed objects

## Current Limitation

- Course data resets when the browser refreshes
- Firebase will later store course data permanently

## Day 5 Goals

- Save course data in browser storage
- Edit existing courses
- Improve course navigation
- Begin building the assignment management feature