# Google Apps Script Setup Guide

This guide explains how to set up the Google Apps Script backend for the Walkathon Check-in system. This solves the CSP (Content Security Policy) issues when hosting on GitHub Pages.

## ✅ Why Google Apps Script?

- ✅ **No CSP issues** - Works on GitHub Pages, Netlify, anywhere
- ✅ **No authentication needed** - Users don't sign in
- ✅ **Still static** - Check-in app is fully static HTML/CSS/JS
- ✅ **Free** - Google Apps Script is always free
- ✅ **Secure** - Your API calls go directly through Google

## 🚀 Step 1: Copy the Google Apps Script Code

1. Open the file `apps-script.js` in your check-in folder
2. **Copy ALL the code** (Ctrl+A, Ctrl+C)

## 🔧 Step 2: Open Your Google Sheet

1. Go to your Google Sheet:
   ```
   https://docs.google.com/spreadsheets/d/1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms/
   ```

## 📝 Step 3: Create Google Apps Script

1. Click **Extensions** in the menu
2. Click **Apps Script**
3. A new tab will open with the Google Apps Script editor
4. **Delete** any existing code in the editor
5. **Paste** the code you copied from `apps-script.js`
6. Click **Save** (Ctrl+S or File > Save)
7. Name the project: `Walkathon Check-in Backend`
8. Click **Create**

You should see the code successfully saved.

## 🚀 Step 4: Deploy as Web App

1. Click the **Deploy** button (top right, blue button)
2. Select **"New Deployment"** (or create a new deployment)
3. Click the gear icon ⚙️
4. Select **Type** = `Web app`
5. Set **Execute as** = Your Google Account (the account that owns the sheet)
6. Set **Who has access** = `Anyone`
7. Click **Deploy**

**Important:** A popup will appear asking for permissions. Click "Review permissions" and allow it.

## 📋 Step 5: Copy the Deployment URL

1. After deployment, you'll see a modal with the URL
2. **Copy the entire URL** from the "Deployment" section
3. It looks like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
   ```

   Deployment ID
AKfycbyhwIdqNKoconoY2MhM6YJWb6ZSJvBhbLMOlHyQEXet5AocCmwGF9GZOlrsGLpKbKwPLA
Web app
URL
https://script.google.com/macros/s/AKfycbyhwIdqNKoconoY2MhM6YJWb6ZSJvBhbLMOlHyQEXet5AocCmwGF9GZOlrsGLpKbKwPLA/exec


4. Save this somewhere safe!

## ⚙️ Step 6: Configure the Check-in App

1. Open your check-in app: `index.html`
2. Refresh the page (if already open)
3. You'll see a configuration form asking for:
   - **Google Sheet ID:** `1hPqe8WZtfOKQqJLzIoS5QwpdFThXCdMrp_ymdhLy5Ms`
   - **Apps Script URL:** Paste the URL from Step 5

4. Click **"Save Configuration"**

✅ **Done!** The app is now configured and ready to use.

## 🧪 Test It

1. Search for a participant by last name
2. Click "Check-in"
3. Go back to your Google Sheet
4. Verify that Column F updated to "Yes"

If it works, you're all set! 🎉

## 🔄 Redeployment (if needed)

If you need to update the Google Apps Script:

1. Go back to the Apps Script editor
2. Make your changes
3. Click **Deploy** > **Deployments**
4. Find your Web app deployment
5. Click the pencil icon to edit
6. Click **"Deploy"** to redeploy
7. Use the same URL (no changes needed in the check-in app)

## ❌ Troubleshooting

### "Failed to load data" Error
- Verify the Apps Script URL is correct
- Make sure the deployment was successful
- Try refreshing the page
- Check browser console (F12) for detailed errors

### "Sheet not accessible" Error
- Verify your Sheet ID is correct
- Make sure the Google Apps Script is from the same Google account that owns the sheet
- Redeploy the Apps Script (might help)

### Check-ins not updating
- Make sure the Apps Script was deployed successfully
- Check that Column F exists in your sheet
- Try refreshing the check-in app
- Check the browser console for errors

### "This app isn't verified" warning
- This is normal when using a personal Google account
- Click "Advanced" → "Go to Walkathon Check-in Backend (unsafe)"
- This is safe - it's just your own code

## 📚 How It Works

1. **Check-in app** (static HTML/CSS/JS) runs in your browser
2. **User searches** and clicks "Check-in"
3. **Browser calls** the Google Apps Script URL
4. **Apps Script** receives the request
5. **Apps Script** reads/writes to your Google Sheet
6. **Data returns** to the browser
7. **App displays** the result

This architecture avoids CSP issues because:
- ✅ No direct API calls from browser
- ✅ All CORS-sensitive operations happen on Google's servers
- ✅ Static site can be hosted anywhere
- ✅ Google's own service has proper headers

## 🔐 Security Notes

- ✅ Only authenticated Google account can deploy
- ✅ Sheet is readable/writable only by your account
- ✅ Web app is public (anyone can call it)
- ⚠️ Your data is public once shared via the web app
- ✅ Google Apps Script runs on Google's infrastructure

## 📖 Related Files

- `apps-script.js` - The backend code (deploy this)
- `script.js` - The frontend (no changes needed)
- `index.html` - The HTML (no changes needed)

---

**All set!** Your walkathon check-in system is ready to go! 🎉
