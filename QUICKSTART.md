# Quick Start Guide

Get up and running in 5 minutes!

## 1️⃣ Google Sheet Preparation (1 min)

Ensure your Google Sheet has these columns:
```
ID | First Name | Last Name | [Any columns...] | Check-in Status
```

The last column (Column F if you only have 5 columns) will auto-update.

**Example data:**
```
ID | First Name | Last Name
1  | John       | Doe
2  | Jane       | Doe
3  | Bob        | Smith
```

## 2️⃣ Get API Credentials (2 min)

### Sheet ID
Open your Google Sheet → Copy the ID from URL
```
https://docs.google.com/spreadsheets/d/1abc123xyz.../edit
                                      ^^^^^^^^^^ This part
```

### API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (or use existing)
3. Search for "Google Sheets API" → Enable it
4. Click "Create Credentials" → "API Key"
5. Copy your API Key

### Make Sheet Public
Click Share button → Change to "Viewer (Anyone with the link)" 

**Note:** If this doesn't work, try:
- Remove all domain restrictions from API key
- Share sheet with the service account email from Cloud Console

## 3️⃣ Launch the App (30 sec)

1. Download/copy all files to a folder
2. Open `index.html` in your browser
3. Enter your Sheet ID and API Key
4. Click "Save Configuration"
5. Done! 🎉

## 4️⃣ Using the App

### Search
- Type last name (first 2+ letters)
- Results appear instantly

### Check-in
- **Single person**: Click "Check-in" button
- **Multiple family**: 
  1. Click "Select All"
  2. Click "Check-in Selected"
- **Undo**: Click "Undo Check-in" button

### Monitor
- Counter at top shows: `5 of 20 checked in`
- Google Sheet updates in real-time

## 🚀 Pro Tips

- **First-time use**: Test with 5-10 fake participants
- **Before event**: Verify API Key works (do test check-in)
- **During event**: Keep browser window open
- **Mobile**: Bookmark the page for quick access
- **Troubleshooting**: Press F12 to see console errors

## ⚙️ Local Server (Optional but Better)

For smoother experience, run a local server:

**Windows (PowerShell):**
```powershell
cd C:\path\to\check-in
python -m http.server 8000
```

**Mac/Linux:**
```bash
cd /path/to/check-in
python -m http.server 8000
```

**VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

Then visit: http://localhost:8000

## 📋 Checklist Before Event

- [ ] Google Sheet created with ID, First Name, Last Name columns
- [ ] Sheet shared publicly (or with service account)
- [ ] Google API Key created and API enabled
- [ ] Configuration saved in the app
- [ ] Test check-in works and updates sheet
- [ ] Counter displays correctly
- [ ] Search works (try searching for a participant)
- [ ] Undo check-in works
- [ ] Bulk check-in works
- [ ] Internet connection is stable

## 🎯 Expected Workflow

```
Event Staff →  Open App → Search Last Name → Find Family → Select All → Check-in
                          ↓
                     Google Sheet Updates Automatically
                          ↓
                      Counter Increments
```

## ❌ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No data found" | Check API key, Sheet ID, and sheet is shared |
| "Checked-in not updating" | Refresh page, check column F is available |
| "Can't find participants" | Verify First/Last name columns exist |
| "API error" | Check Google Cloud API is enabled |
| Slow performance | Use local server instead of file:// |

## 📞 Need Help?

1. Check browser console: Press F12 → Console tab
2. Read full setup guide: Open `README-SETUP.md`
3. Verify all credentials are correct
4. Try with a new, simple Google Sheet

---

**Ready?** Open `index.html` and get started! 🚀
