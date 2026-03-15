# Indane Dashboard & Stock Stabilization

I've performed a comprehensive cleanup and stabilization of the Indane Agency Dashboard and the global Stock Panel to resolve the "issue" reported during login.

## Changes Made

### 1. Agency Dashboard (Front-end)
- **Defensive Rendering**: Added safety checks for all data mapping (complaints and stock history).
- **Date Safety**: Implemented a robust `formatSafeDate` utility to prevent crashes on invalid/missing server timestamps.
- **Improved Logging**: Added console logging for `agencyCode` and `rawRole` to aid in future debugging of local storage states.
- **Empty State UX**: Enhanced the empty states for SOS tickets and stock reports to be more informative.

### 2. Stock Panel (Global View)
- **Multi-Location Support**: Fixed a logic error that only showed the "latest" location per OMC. The panel now correctly sums up metrics or lists all registered locations to give a true operational picture.
- **Visual Consistency**: Standardized the use of `kerala-green` and other agency-specific brand colors.

### 3. Backend Verification
- **Indane Profile Fix**: Corrected the `indane_agency` user profile in the database, ensuring its `agency_type` is explicitly set to `INDANE`.
- **API Robustness**: Verified that all GET/POST requests for the Indane role are returning 200 OK and correctly filtering data by agency.

## Results
The Indane Agency Portal now consistently loads data, displays all bottling plant locations, and safely handles edge cases. SOS reporting and Stock MT metrics are fully synchronized.
