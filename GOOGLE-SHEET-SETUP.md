# Google Sheet Setup Guide

Follow this guide to prepare your Google Sheet for the check-in system.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New Spreadsheet"**
3. Name it: "Walkathon Participants" (or your preferred name)

## Step 2: Set Up Column Headers

In **Row 1**, create these columns:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| ID | First Name | Last Name | Phone | Email | Check-in Status |

**Important:** The column names can vary, but must contain:
- A column with "ID" or "id"
- A column with "first" or "first name" 
- A column with "last" or "last name"
- Column F (or the last column) will be for check-in status

## Step 3: Add Participant Data

Starting from **Row 2**, add your participant data:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| 1 | John | Doe | 555-0001 | john@example.com | |
| 2 | Jane | Doe | 555-0002 | jane@example.com | |
| 3 | Bob | Smith | 555-0003 | bob@example.com | |
| 4 | Alice | Smith | 555-0004 | alice@example.com | |
| 5 | Charlie | Brown | 555-0005 | charlie@example.com | |

**Notes:**
- ID must be unique (numbers or text)
- First Name and Last Name are required
- Phone and Email are optional (can be any column)
- Leave Check-in Status (Column F) empty for now

## Example Minimal Setup

If you only have basic info, this works too:

| A | B | C |
|---|---|---|
| ID | First Name | Last Name |
| 1 | John | Doe |
| 2 | Jane | Doe |

(Column D will be the check-in status column)

## Column Header Variations

The system is flexible with column names. These all work:

✅ **ID variations:** "id", "ID", "Participant ID", "member_id"
✅ **First name variations:** "first name", "firstName", "first_name", "fname"
✅ **Last name variations:** "last name", "lastName", "last_name", "lname"

**Rule:** Headers must contain the key words (case-insensitive)

## Step 4: Share Your Sheet

Make the sheet accessible:

### Option A: Public Link (Easiest)
1. Click **"Share"** button (top right)
2. Change from **"Restricted"** to **"Viewer"** (Anyone with the link)
3. Click **"Share"**
4. Copy the share link

### Option B: Anyone with Link
1. Click **"Share"**
2. Select **"Editor"** or **"Viewer"**
3. Click **"Share"**

### Option C: Specific Email (If using OAuth)
1. Click **"Share"**
2. Enter email address
3. Give **"Editor"** permissions
4. Click **"Share"**

## Step 5: Get Your Sheet ID

In your sheet URL, find the ID:

```
https://docs.google.com/spreadsheets/d/1abc123xyz456def/edit#gid=0
                                      ^^^^^^^^^^^^^^^^
                                      This is the Sheet ID
```

**Copy this ID** - you'll need it for the app!

## Testing Your Setup

1. Add 5-10 test participants
2. Make sure each row has ID, First Name, Last Name
3. Leave Check-in Status empty
4. Share the sheet and verify it's accessible

## Troubleshooting

### "No columns found" error
- Check that headers contain: "ID", "first", "last" (case doesn't matter)
- Header must be in Row 1
- No typos in header names

### "No data found" error
- Verify sheet is shared (public or with link)
- Check that data starts from Row 2 (after headers)
- Make sure there are no empty rows between header and data

### Data not updating
- Verify Column F is available
- Check that Sheet is not in "View only" mode
- Ensure API has edit permissions

## Column Structure Reference

The app expects:
- **Row 1:** Headers
- **Rows 2+:** Participant data
- **Column A-E:** Participant info (must include ID, First Name, Last Name)
- **Column F:** Will be auto-updated with "Yes"/"No" check-in status

### Supported Layouts

**Layout 1 - Minimal (3 columns)**
```
A: ID | B: First Name | C: Last Name
```
Check-in status will go to Column D

**Layout 2 - Standard (5 columns)**
```
A: ID | B: First Name | C: Last Name | D: Phone | E: Email
```
Check-in status will go to Column F

**Layout 3 - Extended (Any number)**
```
A: ID | B: First Name | C: Last Name | D: Phone | E: Email | F: Address | ...
```
Check-in status will go to the last column

## Tips

- **Keep names simple:** Avoid special characters in first/last names
- **ID consistency:** Use numbers (1, 2, 3...) or simple text (A1, B1, C1...)
- **Backup your sheet:** Make a copy before the event
- **Clean data:** Remove extra spaces at beginning/end of cells
- **Test first:** Add test data and verify check-ins update

## Example Complete Sheet

Here's a fully prepared example:

```
| ID | First Name | Last Name | Phone | Email | Address | Check-in Status |
|----|-----------|-----------|-------|-------|---------|-----------------|
| 1  | John      | Doe       | 555-0001 | john@example.com | 123 Main St | |
| 2  | Jane      | Doe       | 555-0002 | jane@example.com | 123 Main St | |
| 3  | Bob       | Smith     | 555-0003 | bob@example.com | 456 Oak Ave | |
| 4  | Alice     | Smith     | 555-0004 | alice@example.com | 456 Oak Ave | |
| 5  | Charlie   | Johnson   | 555-0005 | charlie@example.com | 789 Elm St | |
| 6  | Diana     | Johnson   | 555-0006 | diana@example.com | 789 Elm St | |
```

When someone checks in, the Check-in Status column will update to "Yes".

## Next Steps

1. ✅ Create your Google Sheet
2. ✅ Add participant data
3. ✅ Share the sheet
4. ✅ Copy your Sheet ID
5. 👉 Follow [QUICKSTART.md](QUICKSTART.md) to get your API Key and launch the app

Questions? Check [README-SETUP.md](README-SETUP.md) for detailed troubleshooting.
