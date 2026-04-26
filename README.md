# Walkathon Check-in System

A beautiful, responsive check-in system for walkathon participants using Google Sheets.

**✨ Features:**
- 🔍 Search by last name (first few letters)
- 👨‍👩‍👧‍👦 Automatic family grouping
- ✅ Bulk check-in for multiple family members
- 📊 Live check-in counter at the top
- 🔄 Auto-updates your Google Sheet
- 📱 Fully responsive (desktop, tablet, mobile)
- 🎨 Modern, intuitive UI
- ⚡ Fast and smooth experience

## Quick Start (5 Minutes)

1. **Prepare your Google Sheet** with columns: ID, First Name, Last Name, ..., Check-in Status
2. **Get Google API credentials** (Sheet ID and API Key)
3. **Open `index.html`** in your browser
4. **Enter your credentials** and you're ready!

👉 **Read [QUICKSTART.md](QUICKSTART.md) for step-by-step instructions**

## File Structure

```
check-in/
├── index.html              # Main page
├── style.css              # All styling
├── script.js              # All functionality
├── QUICKSTART.md          # 5-min setup guide
├── README-SETUP.md        # Detailed setup & troubleshooting
└── README.md              # This file
```

## How It Works

1. **Search** participants by last name
2. **Select** family members (multiple at once)
3. **Check-in** updates Google Sheet instantly
4. **Counter** shows progress in real-time
5. **Undo** if needed

## Architecture

- **100% Static** - No server needed
- **No Backend** - Direct Google Sheets API integration
- **Browser-based** - Runs entirely in your browser
- **LocalStorage** - Saves configuration locally
- **Real-time** - Updates Google Sheet on every check-in

## Setup Requirements

- Google Sheet with participant data
- Google API Key (free)
- Modern web browser
- Internet connection

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[README-SETUP.md](README-SETUP.md)** - Complete setup guide + troubleshooting
- **[LICENSE](LICENSE)** - License information

## Hosting

Host for free on:
- **GitHub Pages** - Perfect for events
- **Vercel** - Zero-config deployment
- **Netlify** - Drag & drop deployment
- **Any static hosting** - Just push the files

## Browser Support

Works on all modern browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Privacy & Security

- Configuration stored in **browser localStorage** (not sent to any server)
- Direct connection to Google Sheets API
- No data collection or analytics
- API Key can be rotated anytime
- Static site - no backend to compromise

## Tips for Success

- Test with sample data first
- Do a check-in before the event
- Use local server for best experience
- Keep Sheet ID and API Key handy
- Have stable internet during event

## License

Free to use and modify for your walkathon or event!