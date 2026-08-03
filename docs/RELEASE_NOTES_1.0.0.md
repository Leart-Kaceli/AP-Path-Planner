# AP Path Planner 1.0.0

## Overview

AP Path Planner is a student planning application for organizing AP courses, assignments, study sessions, grades, goals, and reminders.

## Main features

- Firebase Authentication
- Private per-user Firestore data
- Course management
- Assignment management
- Study-session planning
- Calendar views
- Grade tracking
- Profile preferences
- Theme settings
- Browser notification controls
- Data export
- Clear application data
- Permanent account deletion
- Privacy documentation
- Accessibility checks
- Performance checks
- Security headers
- Automated unit, Rules, browser, and deployed tests

## Testing

The release includes:

- Vitest unit tests
- Coverage thresholds
- Firestore Security Rules tests
- Playwright public tests
- Playwright authenticated emulator tests
- Accessibility tests
- Performance tests
- Production-mode browser tests
- Deployed smoke tests

## Known limitations

- Account deletion is performed from the client and is intended for a limited number of known records.
- Large-scale recursive deletion should be moved to trusted server-side code.
- Browser notifications depend on browser permission and application availability.
- Visual baselines may differ across operating systems.
- A strict Content Security Policy requires additional Firebase and Vercel testing.