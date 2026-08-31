# cohort-9-mern-14111-sarhan
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Sarhan Ahmed

# Notes Management Application

A full-stack notes management application built with React, Node.js, Express, and MongoDB.

## Technologies

- React
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Pino
- Mocha
- Chai
- Jest
- SonarQube
- Git


Ran command: `git push -u origin feat/backend-tests`
Ran command: `git push -u origin feat/frontend-tests`

Perfect! Your branches have been successfully pushed to GitHub. 

You can now go ahead and click these links one by one to create your Pull Requests. They are set up to target the **`develop`** branch on the upstream repository:

1. **Create PR 1: Frontend Logo Update**
   [Open PR on Upstream (Target: develop)](https://github.com/10pshine-cohort-9/cohort-9-mern-14111-sarhan/compare/develop...SarhanCoderOfTheCentury:cohort-9-mern-14111-sarhan:feat/frontend-logo-update)

2. **Create PR 2: Backend Tests**
   [Open PR on Upstream (Target: develop)](https://github.com/10pshine-cohort-9/cohort-9-mern-14111-sarhan/compare/develop...SarhanCoderOfTheCentury:cohort-9-mern-14111-sarhan:feat/backend-tests)

3. **Create PR 3: Frontend Tests**
   [Open PR on Upstream (Target: develop)](https://github.com/10pshine-cohort-9/cohort-9-mern-14111-sarhan/compare/develop...SarhanCoderOfTheCentury:cohort-9-mern-14111-sarhan:feat/frontend-tests)

Clicking each of those should now take you directly to a screen where you can add a title and description, and you won't see that "nothing to compare" error anymore. Great job!

Viewed ConfirmDialog.jsx:20-31
Ran command: `git push -u origin feat/ui-ux-refinements`

The branch was pushed successfully! 

You can create the Pull Request right now by clicking this direct link:

👉 **[Create Pull Request for UI/UX Refinements](https://github.com/SarhanCoderOfTheCentury/cohort-9-mern-14111-sarhan/pull/new/feat/ui-ux-refinements)**

### Recommended PR Details

**Title:**
`feat: UI/UX Refinements, Editor Upgrades, & Favorites Fixes`

**Description:**
```markdown
### Summary
This PR bundles several UI/UX polishes and critical bug fixes that complete the recent interface redesign and features.

### Key Changes
- **Backend CORS Fix**: Added `PATCH` to the allowed origins so the `toggleFavorite` endpoint successfully triggers and saves the favorite state.
- **Rich Text Editor Upgrades**: 
  - Added new functional buttons: Strikethrough, Code, H1/H3, Blockquote, Divider, Undo, and Redo.
  - Fixed a Tailwind CSS conflict that was making text selection invisible inside the editor block.
  - Added specific ProseMirror styles so blockquotes, code, and horizontal rules render properly.
- **Star Icons Overhaul**: Replaced the broken `LineIcons` stars with reliable native inline SVGs across the `Sidebar`, `NoteCard`, `Dashboard`, and `NoteEditorPage`. They now fill solid black when toggled.
- **Confirm Dialog Transparency**: Fixed an invalid CSS variable that made the "Discard Changes" modal transparent and overlap illegibly with the editor content.
- **Dashboard Pagination**: Corrected the frontend data mapping so the "Notes found" text now accurately reads the count from `pagination.total`.
```

Commands:
cd backend
npm run coverage

cd frontend
npm run test -- --coverage

cd frontend
npm install --save-dev @vitest/coverage-v8
npx vitest run --coverage