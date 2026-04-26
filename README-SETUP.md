# Walkathon Check-in System

A smooth, static website for managing walkathon participant check-ins using Google Sheets as the database.

## Features

✨ **Fast Search** - Search participants by last name (first few letters)
👨‍👩‍👧‍👦 **Family Grouping** - Automatically groups participants by last name
✅ **Bulk Check-in** - Check-in multiple family members at once
📊 **Live Counter** - Real-time display of checked-in participants
🔄 **Auto-update** - Automatically updates your Google Sheet
📱 **Responsive** - Works on desktop, tablet, and mobile
🎨 **Modern UI** - Clean, intuitive interface for smooth check-ins

## Setup Instructions

### Step 1: Prepare Your Google Sheet

Your Google Sheet should have columns in this order:
- **Column A**: ID (unique identifier)
- **Column B**: First Name
- **Column C**: Last Name
- **Column D**: (optional) Additional info
- **Column E**: (optional) Additional info
- **Column F**: Check-in Status (will be auto-updated)

Example structure:
```
ID | First Name | Last Name | Phone | Email | Check-in Status
1  | John       | Doe      | ...   | ...   | 
2  | Jane       | Doe      | ...   | ...   | 
```

### Step 2: Get Google API Credentials

1. **Get your Sheet ID:**
   - Open your Google Sheet
   - The Sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Copy the part between `/d/` and `/edit`

2. **Create a Google API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the **Google Sheets API**
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy your API Key

3. **Share Your Sheet (IMPORTANT):**
   - Make sure your Sheet is publicly accessible or shared with the API service account
   - Go to Share button → Change "Restricted" to "Viewer (Anyone with the link)"
   - Or grant editor access to the service account email

### Step 3: Launch the Application

1. **Save this folder** somewhere accessible
2. **Open `index.html`** in your web browser
   - You can double-click the file or right-click → Open with browser
   - Or use a local server (see below for better experience)

3. **Enter Configuration:**
   - When you open the site, you'll see a setup form
   - Paste your **Google Sheet ID** 
   - Paste your **Google API Key**
   - Click **Save Configuration**
   - The data will load automatically

### Step 4: Use the Check-in System

1. **Search for participants:**
   - Type in the last name (first few letters)
   - Results will show grouped by family

2. **Check-in options:**
   - Click "Check-in" button for individual
   - Click "Select All" to select all family members
   - Click "Check-in Selected" to check-in multiple at once
   - Click "Undo Check-in" to reverse a check-in

3. **Live updates:**
   - The counter at the top updates in real-time
   - Google Sheet automatically updates with "Yes"

## Using a Local Server (Recommended)

For the best experience, run a local server:

### Python 3
```bash
cd /path/to/check-in
python -m http.server 8000
```
Then open: http://localhost:8000

### Python 2
```bash
python -m SimpleHTTPServer 8000
```

### Node.js
```bash
npx http-server
```

### Using VS Code
1. Install "Live Server" extension
2. Right-click on `index.html` → "Open with Live Server"

## Troubleshooting

### "No data found" error
- Check that your Google Sheet is shared/public
- Verify the API Key is correct
- Ensure Sheet ID is correct (no extra spaces)

### Check-ins not updating
- Make sure Column F is available for the Check-in Status
- Check browser console for detailed errors (F12)
- Verify API Key has Google Sheets API access

### Configuration not saving
- Clear browser cache (Ctrl+Shift+Del)
- Check that localStorage is enabled in browser
- Try a different browser

### CORS errors
- These are normal - the browser is protecting you
- Make sure your API Key is public (not restricted)
- The API should work despite the error message

## Storage & Privacy

- **Sheet ID and API Key** are stored in your browser's localStorage (not uploaded)
- **Data is fetched directly** from your Google Sheet in real-time
- **No server** needed - everything runs in your browser
- **No data collection** - this is a static website

## Architecture

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: Google Sheets API (no custom server needed)
- **Storage**: LocalStorage for configuration
- **Deployment**: Static files (can host on GitHub Pages, Vercel, Netlify, etc.)

## Tips for Smooth Experience

1. **Pre-load the sheet** before the event (5-10 minutes early)
2. **Verify the API Key works** by doing test check-ins
3. **Have the Sheet ID and API Key** written down for backup
4. **Use a stable internet connection** for reliable updates
5. **Mobile tip**: Bookmark the page for quick access
6. **Desktop tip**: Use a tablet or touchscreen for fastest check-ins

## Advanced: Hosting on the Web

You can host this for free on:

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to Settings → Pages
3. Select the branch and `/root` folder
4. Access at: `https://yourusername.github.io/repo-name`

### Vercel
1. Push to GitHub
2. Import project at vercel.com
3. Deploy with one click

### Netlify
1. Drag and drop the folder at netlify.com

## Security Notes

⚠️ **Public API Key**: Your API Key will be visible in the browser. This is okay because:
- It's restricted to Google Sheets API only
- You can rotate it anytime from Google Cloud Console
- Never commit credentials to public repos (use environment variables)

For production, consider:
- Restricting API Key to your domain
- Using OAuth 2.0 instead of API Key
- Running through a backend proxy

## Support

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Verify all three: Sheet ID, API Key, and Sheet permissions
3. Try refreshing the page
4. Clear browser cache
5. Test with a simple Google Sheet first

## License

Free to use and modify for your event!
