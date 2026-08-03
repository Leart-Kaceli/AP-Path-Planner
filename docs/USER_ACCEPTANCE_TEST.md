# AP Path Planner User Acceptance Test

## Public experience

- [ ] Homepage opens
- [ ] Navigation links work
- [ ] Start Planning button works
- [ ] Privacy page opens
- [ ] Not-found page opens
- [ ] Mobile navigation works
- [ ] Homepage has no horizontal overflow

## Authentication

- [ ] New user can create an account
- [ ] Existing user can sign in
- [ ] Incorrect password shows an understandable error
- [ ] User can sign out
- [ ] Protected pages redirect signed-out users
- [ ] Authentication remains active after refresh

## Courses

- [ ] User can create a course
- [ ] Created course survives refresh
- [ ] User can edit a course
- [ ] Edited course survives refresh
- [ ] User can delete a course
- [ ] Deleted course remains deleted after refresh
- [ ] Invalid goal score is rejected

## Assignments

- [ ] User can create an assignment
- [ ] Course dropdown lists created courses
- [ ] Assignment survives refresh
- [ ] User can edit an assignment
- [ ] User can mark an assignment complete
- [ ] User can delete an assignment
- [ ] Due-date and priority filters work

## Study planner

- [ ] User can create a study session
- [ ] Study session appears in the planner
- [ ] Session survives refresh
- [ ] Session can be edited
- [ ] Session can be deleted

## Grades

- [ ] User can create a grade
- [ ] Point average calculates correctly
- [ ] Weighted average calculates correctly
- [ ] Empty grades display safely
- [ ] Grade settings survive refresh

## Calendar

- [ ] Assignments appear on correct dates
- [ ] Study sessions appear on correct dates
- [ ] Month navigation works
- [ ] Agenda view works
- [ ] Day selection works

## Profile

- [ ] Profile loads
- [ ] Name can be updated
- [ ] School can be updated
- [ ] Theme can be changed
- [ ] Theme survives refresh
- [ ] Reminder settings can be changed
- [ ] Notification permission behavior is understandable

## Data management

- [ ] Data export downloads
- [ ] Exported file contains expected records
- [ ] Export contains no authentication tokens
- [ ] Clear-data confirmation appears
- [ ] Canceling clear-data leaves records unchanged
- [ ] Clearing data removes application records
- [ ] Login remains active after clear-data
- [ ] Account deletion requires typing DELETE
- [ ] Account deletion handles recent-login errors
- [ ] Deleted account can no longer sign in

## Accessibility

- [ ] Keyboard navigation reaches interactive controls
- [ ] Visible focus styles appear
- [ ] Form fields have labels
- [ ] Buttons have understandable names
- [ ] Text contrast passes automated checks
- [ ] Status messages are announced
- [ ] No serious automated accessibility violations remain