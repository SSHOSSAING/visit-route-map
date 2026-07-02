# 🗺️ Visit Route Map

A professional web application for visualizing visit routes on an interactive map with **real road routing**, **shareable links**, **PNG/PDF export with headers, numbered markers & disclaimers**.

![Visit Route Map](https://img.shields.io/badge/Leaflet-Map-green) ![OSRM-Routing](https://img.shields.io/badge/OSRM-Real%20Roads-blue) ![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-purple)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📁 **CSV Upload** | Drag & drop visit data |
| 🗺️ **Interactive Map** | Leaflet + OpenStreetMap with layer switcher |
| 🛣️ **Real Road Routes** | OSRM-powered actual road paths |
| 📍 **Numbered Markers** | Teal circles with **serial numbers** on both interactive map AND exports |
| 💬 **Rich Popups** | Click any marker for full activity details (time, duration, agency, coords) |
| 📊 **Sidebar Panel** | Full visit details + route mode toggle + hide sidebar button |
| 🔗 **Shareable Links** | Creator saves → shares `?route=xxx` URL |
| 💾 **Save Multiple Routes** | Browser localStorage |
| 📄 **PDF Export** | Title, subtitle, date, **map image with OSM tiles & numbered markers**, visit table, disclaimer, footer |
| 🖼️ **PNG Export** | Title, subtitle, date, **clean map with OSM tiles & numbered markers** (no distance labels), disclaimer, footer |
| 📱 **Responsive** | Desktop + mobile |
| 🛰️ **Map Layers** | Street / Satellite (now unobstructed by route mode toggle) |
| 👁️ **Hide Sidebar** | Toggle sidebar visibility to maximize map view |
| 🏷️ **CSV Metadata Rows** | Title/Subtitle/Date auto-detected from dedicated CSV rows |
| 🖼️ **Logo Upload** | Drop a logo image — shown on the map overlay, PNG, and PDF exports |

## 🎭 Two Modes

### Creator Mode
- Upload CSV, fill title/subtitle/date/source
- Route mode toggle in sidebar (Real Roads / Direct Lines)
- Hide sidebar button for full map view
- Save routes → browser storage
- Share button generates link
- Export PDF/PNG

### Viewer Mode (`?route=xxx`)
- Read-only view of specific route
- No upload/save buttons
- Clean presentation for stakeholders

## 📋 CSV Format

The first 3 rows are **metadata rows** (2 columns each: key, value). The app auto-detects and reads them to fill in the Route Title, Subtitle, and Visit Date fields. After the metadata rows, the normal header + data rows follow.

```
RouteTitle,"Bangladesh, Cox's Bazar: Rohingya Refugee Response"
Subtitle,RCP Field Monitoring Visit
VisitDate,2026-06-15
Sl,Time,Duration,Activity,Camp,Agency,lat,lon
1,10:30 - 11:15,(45 min),Hatimora Aggregation Center,Ukhiya,WFP,21.2526912,92.1724337
```

| Column | Example |
|--------|---------|
| `Sl` | `1` |
| `Time` | `10:30 - 11:15` |
| `Duration` | `(45 min)` |
| `Activity` | `Hatimora Aggregation Center` |
| `Camp` | `Ukhiya` |
| `Agency` | `WFP` |
| `lat` | `21.2526912` |
| `lon` | `92.1724337` |

> 💡 Metadata rows are optional — CSVs without them still work exactly as before (you just fill in Title/Subtitle/Date manually in the sidebar). Use the **"Download CSV template"** link in the sidebar to get a ready-made starting file.

## 🖼️ Logo Upload

Drop a logo image into the second drop zone in the sidebar (next to "Drop CSV file here"). The logo will appear:
- On the map overlay, to the right of the title
- In the top-right of the PNG export header
- In the top-right of the PDF export header

The logo is also saved along with a route when you click **Save Current** or **Download JSON**, so it's restored automatically when the route is reloaded or shared.

## 📖 User & Creator Guide

A separate `guide.html` page (linked from the "Guide" button in the app header) covers step-by-step instructions for both map creators and route viewers, plus troubleshooting for common GitHub publishing errors. It's a standalone HTML file — edit its content anytime without touching `app.js`.

## 🚀 Deploy to GitHub Pages

### Step 1: Create Repository
1. [github.com](https://github.com) → **New Repository**
2. Name: `visit-route-map`
3. Visibility: **Public**
4. Create

### Step 2: Upload Files
Upload to repo root:
- `index.html`
- `app.js`
- `guide.html`
- `README.md`

### Step 3: Enable Pages
Settings → Pages → Source: `main` branch → Save

### Step 4: Access
`https://YOUR_USERNAME.github.io/visit-route-map/`

## 🔗 Sharing Methods

### Method 1: Browser Link (Same Device)
1. Save route → click **Share**
2. Copy `?route=xxx` link
3. Works on same browser only

### Method 2: JSON File (Permanent / GitHub)
1. Save route → **Download JSON**
2. Add JSON to your GitHub repo in a `routes/` folder
3. Share the raw GitHub URL:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/visit-route-map/main/routes/your_route.json
   ```
4. Anyone can load this JSON file into the app

> ⚠️ **GitHub Pages is static** — no backend. For true multi-device sharing without manual JSON files, you'd need Firebase/Supabase backend.

## 📄 PNG Export Includes
- ✅ Teal gradient header with **title, subtitle, visit date**
- ✅ Clean map image with **OSM background tiles** and **numbered markers** (serial numbers visible)
- ✅ Footer: `Created on: date || Data source: RCP`
- ✅ UN **disclaimer**

## 📄 PDF Export Includes
- ✅ Teal gradient header with **title, subtitle, visit date**
- ✅ **Map image** with OSM tiles & **numbered markers** embedded
- ✅ Summary box (locations, distance, drive time)
- ✅ Visit schedule table
- ✅ Footer: `Created on: date || Data source: RCP`
- ✅ UN **disclaimer**

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| HTML5 + Tailwind CSS | UI |
| Leaflet.js | Maps |
| OpenStreetMap | Tiles |
| OSRM | Real road routing |
| PapaParse | CSV parsing |
| html2canvas | PNG + PDF capture |
| jsPDF | PDF generation |

## 📝 Changelog

### v7.1
- ✅ **Numbered markers on BOTH interactive and exported maps** — Uses `L.divIcon` for interactive (clear visible numbers) + manual Canvas draw for exports
- ✅ **OSM tiles render in exports** — html2canvas captures tiles via CORS
- ✅ **Popups restored** — clicking markers shows full activity information
- ✅ **Route mode moved to sidebar** — no longer blocks the layer switcher button
- ✅ **Hide sidebar button** — toggle sidebar visibility to maximize map view

## 📄 License

MIT License

---

**Built for humanitarian field visits and coordination.**
