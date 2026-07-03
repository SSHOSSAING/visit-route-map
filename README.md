# Visit Route Map

Interactive route map application for field missions, site visits, and travel itineraries. Create, view, and share route maps directly in the browser.

## Features

- **CSV Upload** — Drag-and-drop route data with automatic map rendering
- **Custom Logo** — Upload organization logos for branded exports
- **Interactive Map** — Numbered markers, pop-up details, OSRM real-road routing
- **Live Location** — GPS tracking for field navigation (viewer mode)
- **Export PNG** — High-resolution map images with branded headers
- **Export PDF** — Single-page A4 PDF with intelligent dynamic scaling
- **Browser Sharing** — Save routes to local storage with shareable links
- **GitHub Publishing** — Permanent shareable URLs via GitHub Pages

## Documentation

| Guide | Audience | File |
|-------|----------|------|
| [Creator Guide](guide-creator.html) | Map creators, administrators | `guide-creator.html` |
| [Visitor Guide](guide-viewer.html) | Route viewers, field staff | `guide-viewer.html` |

## Quick Start

1. Open `index.html` in any modern browser
2. Download the CSV template from the sidebar
3. Fill in your route data (title, subtitle, date in first 3 rows)
4. Drag CSV into the upload zone
5. Add a logo (optional)
6. Export as PNG/PDF or share via browser link

## PDF Export

The PDF export uses intelligent dynamic scaling to fit all content on a single A4 page:

- **Row heights** shrink automatically as visit count increases (9mm → 4.5mm floor)
- **Font sizes** scale proportionally (7px minimum for readability)
- **Map image** fills available space after header/footer/table
- **Table layout** uses fixed columns for alignment stability
- **Content never overflows** or gets clipped

## Mobile Support

Fully responsive design tested on:
- iPhone SE (320px), iPhone 12/13/14 (390px)
- iPhone 14 Pro Max (430px), Android (360px–480px)

Mobile features:
- Sidebar completely hidden on mobile (≤768px)
- Title never wraps — uses ellipsis with responsive font sizing
- Export buttons hidden on mobile for clean viewing
- "Track My Location" as square Leaflet control below layer switcher
- Collapsible title overlay in viewer mode
- Floating info button for route summary on mobile
- No horizontal scroll — map fills viewport width

## File Structure

```
├── index.html          # Main application
├── app.js              # Core logic (map, export, sharing, mobile)
├── guide-creator.html  # Creator documentation
├── guide-viewer.html   # Visitor documentation
└── README.md           # This file
```

## Technical

- **Frontend**: Vanilla JavaScript, Leaflet.js, Tailwind CSS
- **Routing**: OSRM (Open Source Routing Machine) API
- **Export**: html2canvas + jsPDF with dynamic scaling
- **Storage**: Browser localStorage
- **No server required** — runs entirely client-side

## License

Developed by Sabbir Hossain
