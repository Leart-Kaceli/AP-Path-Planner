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

# Day 5 Completed

## Course Persistence

- Added browser storage using localStorage
- Courses now remain after browser refreshes
- Converted course arrays to and from JSON
- Added safe error handling for saved data
- Prevented initial state from overwriting stored courses

## Course Editing

- Added an Edit Course button
- Allowed course information to be loaded into the form
- Added Save Changes functionality
- Added Cancel editing functionality
- Preserved course IDs while editing
- Added automatic scrolling to the form

## Course Management Improvements

- Added confirmation before deletion
- Added Clear All Courses functionality
- Added confirmation before clearing all courses
- Updated course statistics after edits and deletions
- Preserved changes after refreshing the browser

## React Concepts Learned

- useEffect
- Synchronizing React with browser storage
- Editing items in state with map()
- Finding items with find()
- Checking arrays with some()
- Conditional form modes
- Immutable state updates
- Loading and saving JSON
- Optional chaining
- Nullish coalescing

## Current Limitation

- Course data is only stored in the current browser
- Data does not yet sync between devices
- User authentication and Firebase will solve this later

## Day 6 Goals

- Build interactive assignment management
- Create assignment types
- Add assignment forms
- Add completion tracking
- Add priority and due-date filtering
- Save assignments in localStorage

# Day 6 Completed

## Assignment Management

- Replaced the Assignments placeholder page
- Created an interactive assignment form
- Connected assignments to saved AP courses
- Added title, course, due date, priority, and notes fields
- Added form validation
- Created reusable assignment cards
- Added assignment editing
- Added assignment deletion
- Added assignment completion tracking
- Added confirmation before deletion
- Added Clear Completed functionality

## Filtering and Search

- Added assignment search
- Added status filtering
- Added priority filtering
- Added combined filtering
- Sorted assignments by due date
- Added a filtered-results count
- Added an empty filtered-results state

## Statistics

- Added total assignment count
- Added active assignment count
- Added completed assignment count
- Added active high-priority count
- Made statistics update automatically

## Persistence

- Saved assignments using localStorage
- Loaded assignments after browser refresh
- Converted assignment arrays with JSON.stringify()
- Restored assignment arrays with JSON.parse()
- Loaded course names from saved course data

## React Concepts Learned

- Controlled assignment forms
- Updating objects inside arrays
- Immutable state updates
- Search and filter logic
- Chained filter() and sort()
- Derived state
- Checkbox event handling
- Conditional styling
- Resetting component state with a key
- Sharing state through a parent component

## Current Limitations

- Data remains limited to one browser
- Course changes require the Assignments page to reload
- Firebase and authentication will later sync data across devices

## Day 7 Goals

- Improve dashboard data accuracy
- Connect dashboard statistics to saved courses and assignments
- Display real upcoming assignments
- Calculate completion percentages
- Add overdue and due-soon indicators

# Day 7 Completed

## Live Dashboard Data

- Replaced hard-coded dashboard data with saved user data
- Loaded courses from localStorage
- Loaded assignments from localStorage
- Added shared storage-key constants
- Added safe loading and error handling
- Added a dashboard loading state
- Added dashboard empty states

## Dashboard Statistics

- Connected the AP course count to saved courses
- Added active assignment count
- Added active high-priority count
- Calculated average course progress
- Calculated assignment completion percentage
- Made statistics update based on saved data

## Course Dashboard

- Displayed saved course cards
- Displayed real course progress
- Limited the dashboard preview to four courses
- Added a Manage Courses link
- Added a no-courses empty state

## Assignment Dashboard

- Displayed real upcoming assignments
- Sorted assignments by due date
- Limited the dashboard preview to five assignments
- Excluded completed assignments from the upcoming list
- Added overdue, due-today, due-soon, and upcoming labels
- Added a Manage Assignments link
- Added a no-active-assignments state

## Date Utilities

- Created reusable date parsing functions
- Added date-only comparison
- Added due-date timing calculations
- Added readable date formatting
- Updated the dashboard header to show the current date

## React and Next.js Concepts Learned

- Loading shared browser data
- Derived statistics
- Reusable utility functions
- Loading states
- Empty states
- Sorting and limiting arrays
- Separating client and server components
- Sharing constants across features
- Avoiding duplicated state

## Current Limitations

- The dashboard updates after refreshing the page
- Data remains stored only in the current browser
- Firebase will later provide live synchronization and user accounts

## Day 8 Goals

- Build the study planner interface
- Create study sessions
- Connect study sessions to courses
- Track study duration
- Add weekly study statistics
- Save study sessions in localStorage

# Day 8 Completed

## Study Planner

- Replaced the Study Planner placeholder page
- Created an interactive study-session form
- Connected study sessions to saved AP courses
- Added topic, date, time, duration, and notes fields
- Added form validation
- Created reusable study-session cards
- Added session editing
- Added session deletion
- Added completion tracking
- Added confirmation before deletion
- Added Clear Completed functionality

## Study Statistics

- Added total study-session count
- Added scheduled-session count
- Added completed-session count
- Calculated total completed study time
- Calculated total planned study time
- Added a study-time completion progress bar
- Made all statistics update automatically

## Search and Filtering

- Added course filtering
- Added completion-status filtering
- Added topic and notes search
- Added combined filtering
- Sorted sessions by date and start time
- Added an empty filtered-results state

## Persistence

- Added a shared study-session storage key
- Saved sessions using localStorage
- Restored sessions after browser refresh
- Loaded saved AP courses into the planner
- Used JSON.stringify() and JSON.parse()

## React Concepts Learned

- Controlled study-planning forms
- Form validation
- Reusing add and edit forms
- Updating array objects with map()
- Removing array items with filter()
- Derived statistics
- Filtering and sorting data
- Resetting component state with a key
- Formatting times and durations
- Synchronizing state with browser storage

## Current Limitations

- Sessions are stored only in the current browser
- Course changes require the Planner page to refresh
- There are no notifications or calendar synchronization yet
- Firebase will later provide accounts and device synchronization

## Day 9 Goals

- Connect study-session data to the dashboard
- Display upcoming study sessions
- Add weekly study-time summaries
- Build the initial grade tracker
- Create weighted grade categories

# Day 9 Completed

## Grade Tracker

- Replaced the Grades placeholder page
- Created an interactive grade-entry form
- Connected grades to saved AP courses
- Added title, category, points, and date fields
- Added form validation
- Created reusable grade cards
- Added grade editing
- Added grade deletion
- Added Clear All Grades functionality
- Saved grades using localStorage

## Grade Calculations

- Calculated percentages from earned and possible points
- Added overall point-based average
- Added test average
- Added grade-entry count
- Added number of courses being tracked
- Made calculations update automatically

## Grade Search and Filtering

- Added course filtering
- Added category filtering
- Added grade search
- Added combined filtering
- Sorted grades by date
- Added an empty filtered-results state

## Dashboard Study Integration

- Loaded study sessions into the dashboard
- Added completed study-time statistics
- Added upcoming study-session previews
- Sorted study sessions by date and time
- Excluded completed sessions from upcoming sessions
- Added a Study Planner dashboard link
- Added an empty study-session state

## React Concepts Learned

- Calculating values from saved state
- Building point-based grade averages
- Reusing add and edit forms
- Filtering data by several conditions
- Loading multiple localStorage data sources
- Integrating one feature into another feature
- Avoiding duplicated derived state
- Formatting saved times and dates

## Current Limitations

- Grade calculations are currently point-based
- Category weighting is not yet customizable
- Data remains limited to the current browser
- Dashboard changes may require a refresh
- Firebase will later provide account-based synchronization

## Day 10 Goals

- Add customizable grade-category weights
- Calculate weighted course averages
- Add letter-grade labels
- Display grade summaries by course
- Improve dashboard navigation consistency

# Day 10 Completed

## Weighted Grade System

- Added customizable category weights
- Added default grade weights
- Added separate weights for each course
- Saved course weights using localStorage
- Added Reset Defaults functionality
- Added a warning when weights do not total 100%
- Calculated weighted course averages
- Skipped empty grade categories during weighted calculations

## Grade Summaries

- Added point-based course averages
- Added weighted course averages
- Added category averages
- Added course-specific grade summary cards
- Added grade-entry counts by course
- Added overall point average
- Added overall weighted average
- Added letter-grade labels

## Grade Utilities

- Created reusable grade calculation functions
- Created category-average calculations
- Created weighted-average calculations
- Created a reusable letter-grade function
- Avoided storing duplicated calculated values

## Navigation Improvements

- Replaced sidebar click state with usePathname
- Highlighted the active route automatically
- Preserved the correct active link after refreshing
- Improved navigation consistency across pages

## React and TypeScript Concepts Learned

- Nested state objects
- Updating nested objects immutably
- Record utility types
- Per-course settings
- Weighted calculations
- Reusable calculation utilities
- Route-aware navigation
- Derived data
- Mapping course data into summary components

## Current Limitations

- Letter-grade boundaries use a general default scale
- Schools may use different category weights
- Category weights are stored only in the current browser
- Firebase will later synchronize data across devices

## Day 11 Goals

- Add grade data to the dashboard
- Show overall and course averages on the dashboard
- Build the profile/settings page
- Allow the student name to be customized
- Add theme and preference settings

# Day 11 Completed

## Profile and Settings

- Replaced the Profile placeholder page
- Added customizable student name
- Added school information
- Added graduation year
- Added weekly study-time goal
- Added appearance preference
- Added profile preview
- Added profile validation
- Added Reset Profile functionality
- Saved profile information in localStorage

## Dashboard Personalization

- Loaded the saved student name
- Displayed the saved name in the dashboard greeting
- Preserved profile information after refresh
- Added profile defaults and reusable profile types

## Dashboard Grade Integration

- Loaded saved grades into the dashboard
- Loaded saved grade weights
- Added overall point average
- Added overall weighted average
- Added letter-grade labels
- Added course-specific weighted averages
- Added a Manage Grades link
- Added a no-grades empty state

## Appearance Settings

- Added light, dark, and system preferences
- Applied the theme preference to the root HTML element
- Added Tailwind class-based dark-mode support
- Began adding dark-mode styles

## React and TypeScript Concepts Learned

- Generic object-update functions
- Saving settings objects
- Loading partial saved objects safely
- Merging saved data with defaults
- Synchronizing state with the DOM
- Formatting profile information
- Sharing saved settings across pages
- Loading several data types into one dashboard

## Current Limitations

- Dark-mode styles are not yet applied to every component
- Dashboard updates may require a refresh
- Profile data remains stored in the current browser
- Firebase will later synchronize profiles across devices

## Day 12 Goals

- Apply dark mode throughout the application
- Improve responsive mobile navigation
- Build a mobile sidebar menu
- Add dashboard weekly-study-goal progress
- Improve accessibility and keyboard navigation

# Day 12 Completed

## Global Theme System

- Moved theme logic into a reusable utility
- Created a global theme initializer
- Applied saved appearance preferences on every page
- Added light, dark, and system theme support
- Added system-theme change detection
- Added browser color-scheme synchronization
- Added app-wide dark-mode styling
- Added dark styling for cards, text, borders, and form controls

## Mobile Navigation

- Rebuilt the dashboard sidebar for mobile screens
- Added a hamburger navigation button
- Added an off-screen sliding sidebar
- Added a mobile overlay
- Added automatic closing after navigation
- Preserved route-aware active-link highlighting
- Added keyboard-accessible menu controls

## Weekly Study Goal

- Loaded the saved weekly study goal
- Calculated completed study minutes for the current week
- Added a weekly study progress percentage
- Added weekly study time to the dashboard statistics
- Added weekly study progress to Overall Progress
- Limited progress bars to a maximum visual width of 100%

## Accessibility

- Added aria-expanded to the mobile-menu button
- Added aria-controls to connect the button and navigation
- Added aria-current to the active navigation link
- Added an accessible navigation label
- Added progress-bar roles and values
- Added a skip-to-content link
- Added global keyboard focus styling
- Added reduced-motion support
- Tested keyboard-only navigation

## React and Next.js Concepts Learned

- Creating reusable browser utilities
- Initializing app-wide client preferences
- Listening for system media-query changes
- Building responsive controlled navigation
- Route-aware mobile navigation
- Calculating date ranges
- Deriving weekly progress from saved data
- Improving semantic HTML and ARIA attributes

## Current Limitations

- Weekly completion is based on the scheduled session date
- Study sessions do not yet store a completedAt timestamp
- Some dark-mode styling uses a temporary global CSS bridge
- Feature pages do not yet share one complete application layout

## Day 13 Goals

- Create a shared authenticated-style application layout
- Display the sidebar on Courses, Assignments, Planner, Grades, and Profile
- Add a completedAt timestamp to study sessions
- Add assignment and study-session overdue indicators
- Improve confirmation dialogs

# Day 13 Completed

## Shared Application Layout

- Created a shared application route group
- Moved Dashboard, Courses, Assignments, Planner, Grades, and Profile into the shared group
- Added one shared sidebar layout
- Preserved all existing URLs
- Removed duplicate Dashboard sidebar code
- Removed unnecessary Return to Dashboard buttons
- Improved navigation consistency across the application

## Study Completion Tracking

- Added completedAt to study sessions
- Recorded the exact completion timestamp
- Cleared completedAt when sessions are marked incomplete
- Added migration support for older saved sessions
- Updated weekly study calculations to use completion time
- Improved the accuracy of weekly study-goal progress

## Deadline Indicators

- Added assignment timing labels
- Added Overdue, Due Today, Due Soon, Upcoming, and Completed states
- Added study-session timing labels
- Added Overdue, Today, Upcoming, and Completed states
- Added reusable timing styles

## Confirmation Dialogs

- Created a reusable native confirmation dialog
- Replaced assignment deletion browser confirmations
- Replaced study-session deletion browser confirmations
- Added Escape-key dismissal
- Added dark-mode dialog styling
- Added destructive-action styling
- Improved mobile confirmation behavior

## React and Next.js Concepts Learned

- Route groups
- Nested shared layouts
- Shared route UI
- Data migration for existing localStorage records
- ISO timestamps
- Derived deadline status
- Native dialog integration
- Synchronizing React with browser-controlled elements
- Reusable destructive-action components

## Current Limitations

- Older completed study sessions use their scheduled time as an estimated completion time
- Courses and grades still use basic browser confirmation boxes
- Assignment completion does not yet store completedAt
- Data remains limited to the current browser

## Day 14 Goals

- Replace all remaining browser confirmation boxes
- Add assignment completedAt timestamps
- Add notification and reminder settings
- Add data export and import
- Add a settings-based danger zone

# Day 14 Completed

## Assignment Completion History

- Added completedAt timestamps to assignments
- Recorded the exact assignment completion time
- Cleared completedAt when assignments were marked incomplete
- Added migration support for older saved assignments
- Normalized assignments in the Assignment Manager
- Normalized assignments on the dashboard
- Added assignments-completed-today dashboard information

## Confirmation Dialog Improvements

- Replaced Clear Completed assignment browser confirmations
- Replaced Clear Completed study-session browser confirmations
- Reused the custom ConfirmDialog component
- Added destructive confirmation language
- Improved keyboard and dark-mode behavior

## Reminder Preferences

- Added assignment reminder preferences
- Added study-session reminder preferences
- Added reminder timing options
- Added same-day, one-day, and two-day settings
- Saved reminder settings with the profile
- Merged older profile data with new defaults

## Data Backup

- Added a versioned application backup format
- Exported all local app data to JSON
- Added dated backup filenames
- Added backup validation
- Added JSON backup importing
- Restored courses, assignments, sessions, grades, weights, and profile
- Added confirmation before replacing existing data

## Danger Zone

- Added a Profile Danger Zone
- Added Delete All App Data
- Removed all app storage keys safely
- Added a destructive confirmation dialog
- Recommended exporting a backup before deletion

## React and TypeScript Concepts Learned

- Data schema versioning
- Generic localStorage reading functions
- JSON file creation
- Browser Blob and object URLs
- Hidden file inputs
- File text parsing
- Type guards for imported data
- Safe restoration of application state
- Reusable destructive confirmation patterns

## Current Limitations

- Reminder preferences do not create browser notifications yet
- Backup validation checks structure but not every nested property
- Data remains stored locally in the current browser
- Imported data requires a page refresh
- Firebase will later provide cloud synchronization

## Day 15 Goals

- Display reminder alerts in the dashboard
- Add a notification center
- Add assignment and session reminder calculations
- Add dismissible alerts
- Add a backup version migration system

# Day 15 Completed

## Reminder Calculations

- Created assignment reminder calculations
- Created study-session reminder calculations
- Added overdue, today, and upcoming reminder states
- Used Profile reminder preferences
- Added same-day, one-day, and two-day reminder windows
- Excluded completed assignments and sessions
- Sorted reminders by event date and time

## Notification Center

- Added a global notification bell
- Added notification-count badges
- Added a notification center panel
- Added assignment reminder links
- Added study-session reminder links
- Added urgency badges
- Added mobile and dark-mode styling
- Added close-overlay behavior
- Added accessible labels and expanded state

## Dismissible Notifications

- Added individual notification dismissal
- Added Dismiss All
- Saved dismissed notification IDs
- Preserved dismissed reminders after refresh
- Used date-based notification IDs
- Allowed rescheduled items to create new reminders

## Backup Migration

- Updated the backup schema to version 2
- Added dismissed notification IDs to backups
- Added migration support for version-1 backups
- Updated backup restoration
- Updated backup import handling
- Preserved older backup compatibility

## Data Management

- Included dismissed reminders in exports
- Included dismissed reminders in imports
- Cleared notification data in the Danger Zone
- Kept application backups versioned

## React and TypeScript Concepts Learned

- Derived notification data
- Reminder-window calculations
- Calendar-day differences
- Global client controllers
- Dismissed-item persistence
- Versioned data migrations
- Legacy-data compatibility
- Accessible floating controls
- Overlay notification panels

## Current Limitations

- Notifications appear only inside the app
- Browser push notifications are not enabled
- Notification data updates after refresh
- Dismissed IDs may accumulate over time
- Reminder timing is shared across assignments and sessions

## Day 16 Goals

- Refresh notifications without reloading
- Add a notification refresh event
- Add separate assignment and session reminder timing
- Clean old dismissed notification IDs
- Add notification grouping
- Add dashboard reminder cards

# Day 16 Completed

## Live Notification Refresh

- Created a reusable app-data-change event
- Refreshed notifications without reloading
- Triggered updates after assignment changes
- Triggered updates after study-session changes
- Triggered updates after profile changes
- Updated notification counts immediately
- Updated dashboard reminders immediately

## Separate Reminder Settings

- Added assignment-specific reminder timing
- Added study-session-specific reminder timing
- Added separate Profile selectors
- Disabled timing selectors when reminders are off
- Preserved compatibility with the older shared reminder setting
- Updated assignment reminder calculations
- Updated study-session reminder calculations

## Notification Cleanup

- Removed outdated dismissed notification IDs
- Kept only dismissals belonging to active generated reminders
- Saved the cleaned dismissal list
- Prevented old dismissal data from accumulating indefinitely

## Notification Grouping

- Grouped reminders into Overdue, Today, and Upcoming
- Added notification-group headings
- Preserved reminder links and dismissal controls
- Improved notification scanning and organization

## Dashboard Reminder Summary

- Added reminder counts to the dashboard
- Added Overdue, Today, and Upcoming totals
- Displayed the first three reminders
- Added direct links to assignment and planner pages
- Added an all-caught-up state
- Added live dashboard reminder updates

## React and TypeScript Concepts Learned

- Custom browser events
- Event-driven component synchronization
- Reusable localStorage loaders
- Backward-compatible profile fields
- Derived notification groups
- Cleaning persistent application data
- Reusing notification data in multiple components
- Effect cleanup for custom event listeners

## Current Limitations

- Notification state still relies on browser localStorage
- Changes from another browser tab may need a storage-event listener
- The dashboard and notification controller each maintain their own notification state
- Browser push notifications are not enabled
- Old reminder profile fields remain in saved JSON until the profile is saved again

## Day 17 Goals

- Add cross-tab synchronization
- Add browser notification permission controls
- Add optional browser notifications
- Add notification timestamps
- Add a notification snooze feature
- Improve notification state sharing

# Day 17 Completed

## Shared Notification State

- Created a global NotificationProvider
- Moved reminder state out of NotificationController
- Shared the same notification state with the dashboard
- Removed duplicate notification-loading logic
- Added a reusable useNotifications hook
- Kept dismissal and refresh behavior centralized

## Cross-Tab Synchronization

- Added browser storage-event support
- Synced reminders between multiple tabs
- Updated the dashboard after changes in another tab
- Updated the notification bell across tabs
- Preserved custom same-tab app events

## Notification Snoozing

- Added one-hour snoozing
- Added one-day snoozing
- Saved snoozed reminder timestamps
- Hid reminders while snoozed
- Restored reminders after snooze expiration
- Removed expired snooze records during loading

## Browser Notifications

- Added browser-notification settings
- Added assignment browser-alert settings
- Added study-session browser-alert settings
- Added notification-permission controls
- Sent optional system notifications
- Prevented duplicate browser alerts
- Preserved in-app reminders when browser permission was denied

## Notification Timestamps

- Added formatted assignment due dates
- Added formatted session times
- Added safe timestamp parsing
- Displayed notification timing in the notification center

## Backup Version 3

- Added snoozed reminders to backups
- Added sent browser-notification IDs to backups
- Migrated version-2 backups to version 3
- Migrated version-1 backups to version 3
- Updated backup validation and restoration

## Current Limitations

- Browser notifications only work while the app is open
- Browser permission must be granted manually
- Snooze options are currently limited to one hour and one day
- Browser notification clicks do not yet navigate to the related page
- Sent notification IDs may need periodic cleanup

## Day 18 Goals

- Add browser-notification click navigation
- Add custom snooze date and time
- Add notification-settings status information
- Add calendar views
- Add assignment and study-session calendar integration

# Day 18 Completed

## Browser Notification Navigation

- Added click handling to browser notifications
- Closed system notifications after clicking
- Focused the AP Path Planner browser window
- Navigated assignment alerts to the Assignments page
- Navigated study-session alerts to the Study Planner
- Reused the existing notification href field

## Custom Notification Snoozing

- Created a reusable SnoozeDialog component
- Added custom date-and-time snoozing
- Kept the existing one-hour snooze option
- Kept the existing one-day snooze option
- Added validation for invalid dates
- Prevented snoozing to a past time
- Saved custom snooze timestamps in localStorage
- Restored reminders after the custom snooze expires

## Notification Status Information

- Added browser-notification support status
- Added browser-permission status
- Displayed granted, blocked, and not-requested states
- Added assignment browser-alert status
- Added study-session browser-alert status
- Updated permission status immediately after a permission request

## Calendar Types and Utilities

- Created a shared CalendarEvent type
- Converted assignments into calendar events
- Converted study sessions into calendar events
- Used assignment dueDate values
- Used study-session date and startTime values
- Added local date-key formatting
- Added month-grid generation
- Added current-day detection
- Added month comparison helpers
- Added readable time formatting
- Sorted calendar events by date and time

## Calendar Interface

- Created the Calendar page
- Created the main Calendar component
- Created CalendarHeader
- Created CalendarDay
- Created CalendarEvent
- Added previous-month navigation
- Added next-month navigation
- Added a Today button
- Added weekday headings
- Added assignment and study-session legends
- Added responsive horizontal scrolling
- Added dark-mode styling
- Added completed-event styling

## Calendar Integration

- Loaded assignments from localStorage
- Loaded study sessions from localStorage
- Normalized stored assignment data
- Normalized stored study-session data
- Added same-tab app-data event support
- Added cross-tab storage-event support
- Linked assignment events to Assignments
- Linked study-session events to Study Planner
- Added Calendar to the dashboard sidebar

## New Files

- src/types/calendar.ts
- src/utils/calendar.ts
- src/components/notifications/SnoozeDialog.tsx
- src/components/calendar/Calendar.tsx
- src/components/calendar/CalendarHeader.tsx
- src/components/calendar/CalendarDay.tsx
- src/components/calendar/CalendarEvent.tsx
- src/app/(app)/calendar/page.tsx

## Updated Files

- src/utils/browserNotifications.ts
- src/components/notifications/NotificationCenter.tsx
- src/components/profile/ProfileSettings.tsx
- src/components/dashboard/DashboardSidebar.tsx
- PROJECT_NOTES.md

## React and TypeScript Concepts Learned

- Modal dialog state
- datetime-local form inputs
- Date validation
- Shared calendar event types
- Adapting multiple data types into one interface
- Month-grid date calculations
- Local-date formatting
- Calendar event filtering
- Browser Notification click handlers
- Window focus and navigation
- Reusable status rows
- Responsive calendar layouts

## Current Limitations

- Browser notifications still require the app to be open
- Browser notification permission may need to be changed through browser settings after it is blocked
- Calendar events currently open their general feature pages rather than a specific item editor
- Calendar currently provides a month view only
- Events cannot be created directly from a calendar day
- Large numbers of events may make calendar cells tall
- Calendar filters are not yet available

## Day 19 Goals

- Add calendar event filters
- Add selected-day details
- Add calendar event counts and summaries
- Add direct event editing from the calendar
- Add dashboard calendar preview
- Improve browser-notification sent-ID cleanup

# Day 19 Completed

## Calendar Event Filters

- Added All, Assignments, and Study Sessions filters
- Added accessible pressed-state filter buttons
- Added event totals to each calendar filter
- Preserved the complete event collection while filtering displayed events

## Selected-Day Details

- Added selectable calendar dates
- Added selected-day highlighting
- Created a selected-day detail panel
- Displayed assignments and study sessions for the selected day
- Added selected-day event counts
- Added completed-event indicators
- Added direct editing links

## Calendar Event Summaries

- Added monthly total event count
- Added monthly assignment count
- Added monthly study-session count
- Added active and completed event summaries
- Updated summaries when navigating between months

## Direct Calendar Editing

- Added item IDs to calendar event URLs
- Opened assignment events directly in the assignment editor
- Opened study-session events directly in the study-session editor
- Added query-parameter handling to feature managers
- Preserved general Assignments and Planner routes

## Dashboard Calendar Preview

- Created a dashboard calendar-preview component
- Displayed the next five upcoming events
- Combined assignment and study-session events
- Added event type, course, date, and time information
- Added direct editing links
- Added an Open Calendar link
- Added an empty calendar-preview state

## Browser Notification Cleanup

- Cleaned inactive sent browser-notification IDs
- Preserved IDs for current notifications
- Preserved IDs for dismissed notifications
- Preserved IDs for snoozed notifications
- Prevented stale sent IDs from accumulating
- Continued preventing duplicate browser alerts

## New Files

- src/components/calendar/SelectedDayPanel.tsx
- src/components/dashboard/DashboardCalendarPreview.tsx

## Updated Files

- src/types/calendar.ts
- src/utils/calendar.ts
- src/components/calendar/Calendar.tsx
- src/components/calendar/CalendarDay.tsx
- src/components/assignments/AssignmentManager.tsx
- src/components/planner/StudyPlannerManager.tsx
- src/components/dashboard/DashboardOverview.tsx
- src/components/notifications/NotificationProvider.tsx
- PROJECT_NOTES.md

## React and TypeScript Concepts Learned

- Typed calendar filter state
- Selected-date state
- Derived selected-day event data
- Query-parameter navigation
- Next.js useSearchParams
- useRef for one-time URL handling
- Direct deep-link editing
- Combining multiple data types into dashboard previews
- Set-based persistent-data cleanup
- Accessible pressed-state controls

## Current Limitations

- Calendar currently provides only a month view
- Events cannot be created directly from a calendar day
- Direct editing depends on URL query parameters
- Browser notifications still require the app to be open
- Calendar cells may grow tall when many events share one date

## Day 20 Goals

- Add event creation from selected calendar dates
- Add week and agenda calendar views
- Add calendar search
- Add calendar event overflow handling
- Improve direct-edit URL cleanup
- Begin preparing data services for Firebase

# Day 20 Completed

## Event Creation from Calendar Dates

- Added assignment creation links to selected calendar dates
- Added study-session creation links to selected calendar dates
- Pre-filled assignment due dates from calendar selections
- Pre-filled study-session dates from calendar selections
- Preserved existing dates while editing events

## Calendar Views

- Added Month, Week, and Agenda views
- Added accessible calendar-view controls
- Added seven-day week rendering
- Added grouped agenda rendering
- Added view-aware previous and next navigation

## Calendar Search

- Added calendar event search
- Added title matching
- Added course matching
- Added event-type matching
- Applied search across Month, Week, and Agenda views

## Calendar Overflow

- Limited month cells to three visible events
- Added remaining-event counts
- Added selected-day access to hidden events
- Prevented busy calendar rows from growing excessively

## Direct-Edit URL Cleanup

- Removed edit query parameters after opening forms
- Removed date query parameters after pre-filling forms
- Preserved form state during URL cleanup
- Prevented stale query parameters from reopening editors

## Data-Service Preparation

- Added a generic local-storage service
- Added an assignment data service
- Added a study-session data service
- Moved calendar data loading behind service functions
- Began separating data access from React components
- Prepared the project for a future Firebase implementation

## New Files

- src/components/calendar/CalendarViewControls.tsx
- src/components/calendar/CalendarWeekView.tsx
- src/components/calendar/CalendarAgendaView.tsx
- src/services/localStorageService.ts
- src/services/assignmentService.ts
- src/services/studySessionService.ts

## Updated Files

- src/types/calendar.ts
- src/utils/calendar.ts
- src/components/calendar/Calendar.tsx
- src/components/calendar/CalendarDay.tsx
- src/components/calendar/SelectedDayPanel.tsx
- src/components/assignments/AssignmentForm.tsx
- src/components/assignments/AssignmentManager.tsx
- src/components/planner/StudySessionForm.tsx
- src/components/planner/StudyPlannerManager.tsx
- PROJECT_NOTES.md

## Day 21 Goals

- Create data-service interfaces
- Add Firebase project configuration
- Add Firebase Authentication
- Replace local-only profile state with authenticated-user state
- Begin Firestore assignment storage
- Add loading and error states for asynchronous services

# Day 21 Completed

## Data-Service Interfaces

- Created a generic asynchronous DataService interface
- Added shared loadAll and saveAll service methods
- Converted assignment data access to an asynchronous service contract
- Preserved localStorage as a supported data source
- Separated React components from storage implementation details

## Firebase Configuration

- Installed the modular Firebase JavaScript SDK
- Created Firebase project environment variables
- Added centralized Firebase application initialization
- Added Firebase Authentication initialization
- Added Cloud Firestore initialization
- Prevented duplicate Firebase initialization during development reloads

## Firebase Authentication

- Enabled email-and-password authentication
- Created a shared AuthProvider
- Added authenticated-user state
- Added authentication loading and error states
- Added account creation
- Added sign-in
- Added sign-out
- Added Firebase display-name support
- Added a reusable useAuth hook
- Added an authentication panel to the Profile page

## Authenticated Profile State

- Added Firebase account identity to profile settings
- Displayed the authenticated email address
- Synchronized profile names with Firebase Authentication
- Preserved local planning preferences
- Separated account identity from device-specific preferences

## Firestore Assignment Storage

- Created a Firestore assignment data service
- Added per-user assignment collections
- Loaded assignments using authenticated user IDs
- Saved assignments using authenticated user IDs
- Added first-sign-in migration from localStorage to Firestore
- Preserved localStorage assignments for signed-out users
- Added Firestore batch synchronization
- Added user-specific Firestore Security Rules

## Async Loading and Errors

- Added authentication loading state
- Added assignment loading state
- Added assignment saving state
- Added cloud data error messages
- Added device-storage error messages
- Added cancellation protection for asynchronous effects
- Added accessible live status messaging

## New Files

- src/lib/firebase.ts
- src/types/auth.ts
- src/services/dataService.ts
- src/services/firestoreAssignmentService.ts
- src/components/auth/AuthProvider.tsx
- src/components/auth/AuthPanel.tsx
- src/hooks/useAuth.ts
- .env.local

## Updated Files

- package.json
- package-lock.json
- src/app/(app)/layout.tsx
- src/app/(app)/profile/page.tsx
- src/components/profile/ProfileSettings.tsx
- src/components/assignments/AssignmentManager.tsx
- src/services/assignmentService.ts
- PROJECT_NOTES.md

## React, TypeScript, and Firebase Concepts Learned

- Firebase modular SDK imports
- Environment-variable configuration
- Firebase Authentication
- Authentication state observers
- React Context providers
- Custom context hooks
- Authenticated user objects
- Firebase display profiles
- Cloud Firestore collections and documents
- User-owned nested collections
- Firestore batch writes
- Firestore Security Rules
- Asynchronous service interfaces
- Promise-based data access
- Storage implementation selection
- First-login data migration
- Loading and saving states
- Async effect cancellation

## Current Limitations

- Only assignments have been migrated to Firestore
- Courses remain in localStorage
- Study sessions remain in localStorage
- Grades remain in localStorage
- Profile preferences remain mostly local
- Assignment saving currently synchronizes the entire collection
- Authentication currently supports email and password only
- Password reset and email verification are not yet implemented
- Signed-out data remains tied to one browser

## Day 22 Goals

- Move study sessions to Firestore
- Move courses to Firestore
- Create user profile documents
- Store profile preferences in Firestore
- Add password-reset support
- Add email-verification status
- Improve individual Firestore create, update, and delete operations
- Add authentication-aware dashboard loading
- Add Firestore error retry controls