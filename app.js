// Visit Route Map - Final v7.1 (Fixed: Numbered markers in both interactive and export)
// ================================================================================================
// FIX: Use L.divIcon markers for interactive (visible numbers) + manual canvas draw for export

let map = null;
let markers = [];
let routeLines = [];
let routeLabels = [];
let visitData = [];
let useRealRoute = true;
let currentRouteId = null;
let isViewerMode = false;
let sidebarVisible = true;
let logoDataUrl = null;

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving/';
const MARKER_COLOR = '#0d9488';
const STORAGE_KEY = 'visit_route_maps';

// ============================================
// LOCAL STORAGE
// ============================================

function getSavedRoutes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
}

function saveRouteToStorage(routeId, routeData) {
    const routes = getSavedRoutes();
    routes[routeId] = routeData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

function getRouteFromStorage(routeId) {
    return getSavedRoutes()[routeId] || null;
}

function deleteRouteFromStorage(routeId) {
    const routes = getSavedRoutes();
    delete routes[routeId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

function generateRouteId() {
    return 'route_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

// ============================================
// URL PARAMS
// ============================================

function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function buildShareLink(routeId) {
    return window.location.origin + window.location.pathname + '?route=' + encodeURIComponent(routeId);
}

// ============================================
// MAP
// ============================================

function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true
    }).setView([21.26, 92.12], 13);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ position: 'bottomright', metric: true, imperial: false }).addTo(map);

    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    });
    const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri', maxZoom: 19
    });
    L.control.layers({ 'Street Map': street, 'Satellite': sat }, null, { position: 'topright' }).addTo(map);
    street.addTo(map);
}

// ============================================
// MARKERS - L.divIcon for interactive (visible numbers), NOT captured by html2canvas
// ============================================

function createNumberedMarker(lat, lng, number, activity) {
    // Use L.divIcon for interactive map - numbers are clearly visible
    const icon = L.divIcon({
        html: `<div class="custom-marker" style="background: ${MARKER_COLOR};">${number}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    const m = L.marker([lat, lng], { icon: icon });

    // Activity tooltip on hover
    m.bindTooltip(`<strong>${number}. ${activity || 'Visit ' + number}</strong>`, {
        permanent: false, direction: 'top', offset: [0, -18], className: 'leaflet-tooltip'
    });

    return m;
}

// ============================================
// OSRM ROUTING
// ============================================

async function fetchOSRMRoute(sLat, sLon, eLat, eLon) {
    const url = `${OSRM_BASE}${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('fail');
        const data = await res.json();
        if (data.code !== 'Ok' || !data.routes?.length) throw new Error('no route');
        return {
            coords: data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]),
            dist: data.routes[0].distance,
            dur: data.routes[0].duration
        };
    } catch (e) { return null; }
}

function directDist(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function parseDur(s) {
    const m = String(s || '').match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
}

function clean(v) {
    return v === undefined || v === null ? '' : String(v).trim();
}

// ============================================
// CLEAR & RENDER
// ============================================

function clearMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    routeLines.forEach(l => map.removeLayer(l));
    routeLines = [];
    routeLabels.forEach(l => map.removeLayer(l));
    routeLabels = [];
}

async function renderRoute(data, showDistLabels = true) {
    clearMap();
    visitData = data;
    if (data.length === 0) return;

    const allLL = [];
    let totalDist = 0, totalDur = 0, osrmOk = 0;

    // Markers - using divIcon (visible numbers on interactive map)
    data.forEach((item, i) => {
        const lat = parseFloat(item.lat), lon = parseFloat(item.lon);
        const num = parseInt(item.Sl) || (i + 1);
        const act = clean(item.Activity) || ('Visit ' + num);
        allLL.push([lat, lon]);

        const m = createNumberedMarker(lat, lon, num, act);

        // Full popup with all activity information
        const popup = `
            <div style="min-width:260px;font-family:Inter,sans-serif;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e2e8f0;">
                    <span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:700;background:${MARKER_COLOR}">${num}</span>
                    <div>
                        <div style="font-weight:700;font-size:14px;color:#1e293b;line-height:1.3;">${act}</div>
                        <div style="font-size:11px;color:#64748b;margin-top:2px;">${clean(item.Camp)}</div>
                    </div>
                </div>
                <div style="font-size:12px;color:#475569;line-height:1.8;">
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Time:</span><span style="font-weight:600;color:#334155;">${clean(item.Time)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Duration:</span><span style="font-weight:600;color:#334155;">${clean(item.Duration)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Agency:</span><span style="font-weight:600;color:#334155;">${clean(item.Agency)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Coords:</span><span style="font-weight:500;color:#334155;font-size:11px;">${lat.toFixed(6)}, ${lon.toFixed(6)}</span></div>
                </div>
            </div>`;
        m.bindPopup(popup, { closeButton: true, maxWidth: 300 });
        m.on('click', () => highlightCard(i));
        m.addTo(map);
        markers.push(m);
    });

    // Route lines
    if (data.length > 1) {
        showOSRMLoading(true);
        for (let i = 0; i < data.length - 1; i++) {
            const sLat = parseFloat(data[i].lat), sLon = parseFloat(data[i].lon);
            const eLat = parseFloat(data[i+1].lat), eLon = parseFloat(data[i+1].lon);

            let segCoords = [], segDist = 0, segDur = 0, isReal = false;

            if (useRealRoute) {
                const r = await fetchOSRMRoute(sLat, sLon, eLat, eLon);
                if (r) { segCoords = r.coords; segDist = r.dist/1000; segDur = r.dur; isReal = true; osrmOk++; }
            }
            if (!isReal) {
                segCoords = [[sLat,sLon],[eLat,eLon]];
                segDist = directDist(sLat, sLon, eLat, eLon);
                segDur = (segDist/30)*3600;
            }
            totalDist += segDist; totalDur += segDur;

            const line = L.polyline(segCoords, {
                color: isReal ? '#0d9488' : '#94a3b8',
                weight: isReal ? 4 : 2, opacity: 0.9,
                dashArray: isReal ? null : '8,6',
                lineCap: 'round', lineJoin: 'round'
            }).addTo(map);
            routeLines.push(line);

            // Distance labels
            if (showDistLabels && segCoords.length > 0) {
                const mp = segCoords[Math.floor(segCoords.length/2)];
                const li = L.divIcon({
                    html: `<div class="route-label">${segDist.toFixed(1)} km</div>`,
                    className: '', iconSize: [60,20], iconAnchor: [30,10]
                });
                const lm = L.marker(mp, { icon: li, interactive: false, zIndexOffset: 1000 });
                lm.addTo(map); routeLabels.push(lm);
            }

            // Arrow dots along route
            if (segCoords.length > 2) {
                for (let j = 1; j < segCoords.length - 1; j += Math.max(1, Math.floor(segCoords.length / 5))) {
                    const arrowIcon = L.divIcon({
                        html: `<div style="width:6px;height:6px;background:${isReal?'#0d9488':'#94a3b8'};border-radius:50%;border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
                        className: '', iconSize: [6,6], iconAnchor: [3,3]
                    });
                    const am = L.marker(segCoords[j], { icon: arrowIcon, interactive: false });
                    am.addTo(map); routeLabels.push(am);
                }
            }
        }
        showOSRMLoading(false);
    }

    if (allLL.length > 0) map.fitBounds(L.latLngBounds(allLL), { padding: [100,100], maxZoom: 16 });
    updateStats(data, totalDist, totalDur, osrmOk);
    updateRouteStatus(data, osrmOk);
}

function updateStats(data, totalDist, totalDur, osrmCount) {
    const totalMins = data.reduce((s, it) => s + parseDur(it.Duration), 0);
    const driveMin = Math.round(totalDur/60);
    const countEl = isViewerMode ? document.getElementById('viewerVisitCount') : document.getElementById('visitCount');
    const durEl = isViewerMode ? document.getElementById('viewerTotalDuration') : document.getElementById('totalDuration');
    if (countEl) countEl.textContent = `${data.length} visit${data.length!==1?'s':''}`;
    if (durEl) durEl.textContent = `${totalMins} min total visit time`;
    document.getElementById('totalDistance').textContent = totalDist > 0 ? `${totalDist.toFixed(2)} km` : '--';
    document.getElementById('locationCount').textContent = data.length;
    document.getElementById('estDriveTime').textContent = driveMin > 0 ? `~${driveMin} min` : '--';
}

function updateRouteStatus(data, osrmCount) {
    const el = document.getElementById('routeStatus');
    if (!el) return;
    if (useRealRoute && data.length > 1) {
        const total = data.length - 1;
        if (osrmCount === total) { el.textContent = '✓ All routes use real roads'; el.className = 'text-[10px] text-teal-600 mt-2 font-medium'; }
        else if (osrmCount > 0) { el.textContent = `⚠ ${osrmCount}/${total} real roads`; el.className = 'text-[10px] text-amber-600 mt-2 font-medium'; }
        else { el.textContent = '✗ Using direct lines'; el.className = 'text-[10px] text-red-500 mt-2 font-medium'; }
    } else { el.textContent = 'Using direct lines'; el.className = 'text-[10px] text-slate-400 mt-2'; }
}

// ============================================
// SIDEBAR
// ============================================

function renderSidebar(data, containerId) {
    const c = document.getElementById(containerId);
    if (!c) return; c.innerHTML = '';
    if (data.length === 0) {
        c.innerHTML = `<div class="text-center py-12 text-slate-400"><p class="text-sm">No visits to display</p></div>`;
        return;
    }
    data.forEach((item, i) => {
        const num = parseInt(item.Sl) || (i+1);
        const act = clean(item.Activity) || ('Visit '+num);
        const time = clean(item.Time);
        const dur = clean(item.Duration);
        const camp = clean(item.Camp);
        const agency = clean(item.Agency);

        const card = document.createElement('div');
        card.className = 'visit-card bg-white rounded-xl p-4 mb-2 cursor-pointer border border-slate-100';
        card.dataset.index = i;
        card.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style="background:${MARKER_COLOR}">${num}</div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-slate-800 text-sm leading-tight mb-1">${act}</p>
                    <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${time||'--'}
                        </span>
                        <span class="text-slate-300">|</span>
                        <span>${dur||'--'}</span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">${camp||'--'}</span>
                        ${agency?`<span class="px-2 py-0.5 rounded text-[10px] font-medium text-white" style="background:${MARKER_COLOR}">${agency}</span>`:''}
                    </div>
                </div>
            </div>`;
        card.addEventListener('click', () => {
            highlightCard(i);
            map.setView([parseFloat(item.lat), parseFloat(item.lon)], 16);
            markers[i].openPopup();
        });
        card.addEventListener('mouseenter', () => {
            const el = markers[i]?.getElement();
            if (el) el.querySelector('.custom-marker')?.classList.add('marker-pulse');
        });
        card.addEventListener('mouseleave', () => {
            const el = markers[i]?.getElement();
            if (el) el.querySelector('.custom-marker')?.classList.remove('marker-pulse');
        });
        c.appendChild(card);
    });
}

function highlightCard(idx) {
    const cid = isViewerMode ? 'viewerVisitList' : 'visitList';
    document.querySelectorAll(`#${cid} .visit-card`).forEach((c, i) => {
        if (i === idx) { c.classList.add('active'); c.scrollIntoView({behavior:'smooth',block:'center'}); }
        else c.classList.remove('active');
    });
    markers.forEach((m, i) => {
        const el = m.getElement()?.querySelector('.custom-marker');
        if (el) {
            if (i === idx) el.classList.add('active','marker-pulse');
            else el.classList.remove('active','marker-pulse');
        }
    });
}

// ============================================
// SIDEBAR TOGGLE
// ============================================

function toggleSidebar() {
    sidebarVisible = !sidebarVisible;
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');

    if (sidebarVisible) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('flex');
        toggleBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>`;
        toggleBtn.title = 'Hide Sidebar';
    } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('flex');
        toggleBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>`;
        toggleBtn.title = 'Show Sidebar';
    }

    setTimeout(() => {
        map.invalidateSize({ animate: false });
    }, 300);
}

// ============================================
// MAP OVERLAY
// ============================================

function updateMapOverlay(title, subtitle, date, source) {
    document.getElementById('mapTitle').textContent = title || 'Untitled Route';
    document.getElementById('mapSubtitle').textContent = subtitle || '';
    document.getElementById('mapDate').textContent = date ? fmtDate(date) : '--';
    document.getElementById('mapSource').textContent = source ? `Data source: ${source}` : '--';
}

function fmtDate(d) {
    if (!d) return '--';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});
}

// ============================================
// LOGO UPLOAD
// ============================================

function processLogoFile(file) {
    if (!file || !file.type.startsWith('image/')) { alert('Please upload a valid image file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { logoDataUrl = e.target.result; updateLogoDisplay(); };
    reader.onerror = () => alert('Failed to read the logo image.');
    reader.readAsDataURL(file);
}

function updateLogoDisplay() {
    const mapLogo = document.getElementById('mapLogoImg');
    const zoneEmpty = document.getElementById('logoZoneEmpty');
    const zonePreview = document.getElementById('logoZonePreview');
    const removeBtn = document.getElementById('btnRemoveLogo');
    if (logoDataUrl) {
        mapLogo.src = logoDataUrl; mapLogo.classList.remove('hidden');
        zonePreview.src = logoDataUrl; zonePreview.classList.remove('hidden');
        zoneEmpty.classList.add('hidden');
        removeBtn.classList.remove('hidden');
    } else {
        mapLogo.src = ''; mapLogo.classList.add('hidden');
        zonePreview.src = ''; zonePreview.classList.add('hidden');
        zoneEmpty.classList.remove('hidden');
        removeBtn.classList.add('hidden');
    }
}

function removeLogo() {
    logoDataUrl = null;
    updateLogoDisplay();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// ============================================
// SAVED ROUTES UI
// ============================================

function renderSavedRoutes() {
    const c = document.getElementById('savedRoutesList');
    const routes = getSavedRoutes();
    const ids = Object.keys(routes);
    if (ids.length === 0) {
        c.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">No saved routes yet.<br>Upload data and save to create shareable links.</p>`;
        return;
    }
    c.innerHTML = '';
    ids.forEach(id => {
        const r = routes[id];
        const div = document.createElement('div');
        div.className = 'saved-route-card bg-white rounded-xl p-3 border border-slate-200 cursor-pointer';
        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0" onclick="window.loadSavedRoute('${id}')">
                    <p class="font-semibold text-slate-800 text-sm truncate">${r.title||'Untitled'}</p>
                    <p class="text-xs text-slate-500 truncate">${r.subtitle||''}</p>
                    <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>${fmtDate(r.date)}</span>
                        <span>${r.visits?.length||0} visits</span>
                    </div>
                </div>
                <div class="flex flex-col gap-1 ml-2">
                    <button onclick="event.stopPropagation(); window.shareRoute('${id}')" class="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition" title="Share">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                    <button onclick="event.stopPropagation(); window.downloadRouteJSON('${id}')" class="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition" title="Download JSON">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                    <button onclick="event.stopPropagation(); window.deleteRoute('${id}')" class="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </div>`;
        c.appendChild(div);
    });
}

window.loadSavedRoute = function(routeId) {
    const r = getRouteFromStorage(routeId);
    if (!r) return;
    currentRouteId = routeId; visitData = r.visits || [];
    document.getElementById('routeTitle').value = r.title || '';
    document.getElementById('routeSubtitle').value = r.subtitle || '';
    document.getElementById('routeDate').value = r.date || '';
    document.getElementById('routeSource').value = r.source || 'RCP';
    logoDataUrl = r.logo || null;
    updateLogoDisplay();
    updateMapOverlay(r.title, r.subtitle, r.date, r.source);
    renderRoute(visitData);
    renderSidebar(visitData, 'visitList');
};

window.shareRoute = function(routeId) {
    const link = buildShareLink(routeId);
    document.getElementById('shareLinkBox').textContent = link;
    document.getElementById('shareModal').classList.remove('hidden');
};

window.downloadRouteJSON = function(routeId) {
    const r = getRouteFromStorage(routeId);
    if (!r) return;
    const blob = new Blob([JSON.stringify(r, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `route_${routeId}.json`; a.click();
    URL.revokeObjectURL(url);
};

window.deleteRoute = function(routeId) {
    if (!confirm('Delete this saved route?')) return;
    deleteRouteFromStorage(routeId); renderSavedRoutes();
};

// ============================================
// SAVE ROUTE
// ============================================

function openSaveModal() {
    if (visitData.length === 0) { alert('Please upload a CSV file first.'); return; }
    document.getElementById('saveModal').classList.remove('hidden');
}

function closeSaveModal() { document.getElementById('saveModal').classList.add('hidden'); }

function confirmSaveRoute() {
    const title = document.getElementById('routeTitle').value.trim();
    if (!title) { alert('Please enter a title.'); return; }
    const routeId = currentRouteId || generateRouteId();
    currentRouteId = routeId;
    const routeData = {
        id: routeId, title: title,
        subtitle: document.getElementById('routeSubtitle').value.trim(),
        date: document.getElementById('routeDate').value,
        source: document.getElementById('routeSource').value.trim() || 'RCP',
        createdAt: new Date().toISOString(),
        visits: visitData,
        logo: logoDataUrl || null
    };
    saveRouteToStorage(routeId, routeData);
    renderSavedRoutes(); closeSaveModal(); updateMapOverlay(title, routeData.subtitle, routeData.date, routeData.source);
    setTimeout(() => window.shareRoute(routeId), 300);
}

function downloadCurrentJSON() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }
    const title = document.getElementById('routeTitle').value.trim() || 'route';
    const routeData = {
        id: generateRouteId(),
        title: title,
        subtitle: document.getElementById('routeSubtitle').value.trim(),
        date: document.getElementById('routeDate').value,
        source: document.getElementById('routeSource').value.trim() || 'RCP',
        createdAt: new Date().toISOString(),
        visits: visitData,
        logo: logoDataUrl || null
    };
    const blob = new Blob([JSON.stringify(routeData, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g,'_').toLowerCase()}_route.json`; a.click();
    URL.revokeObjectURL(url); closeSaveModal();
}

// ============================================
// VIEWER MODE
// ============================================

function enterViewerMode(routeId) {
    isViewerMode = true; currentRouteId = routeId;
    const r = getRouteFromStorage(routeId);
    if (!r) { alert('Route not found. It may have been deleted or the link is invalid.'); return; }

    document.getElementById('creatorPanel').classList.add('hidden');
    document.getElementById('creatorPanel').classList.remove('flex');
    document.getElementById('viewerPanel').classList.remove('hidden');
    document.getElementById('viewerPanel').classList.add('flex');
    document.getElementById('btnViewMode').classList.remove('hidden');
    document.getElementById('btnLoadSample').classList.add('hidden');

    document.getElementById('viewerTitle').textContent = r.title || 'Untitled Route';
    document.getElementById('viewerSubtitle').textContent = r.subtitle || '';
    document.getElementById('viewerDate').textContent = fmtDate(r.date);
    document.getElementById('viewerSource').textContent = r.source ? `Data source: ${r.source}` : 'Data source: RCP';

    logoDataUrl = r.logo || null;
    updateLogoDisplay();
    updateMapOverlay(r.title, r.subtitle, r.date, r.source);
    visitData = r.visits || [];
    renderRoute(visitData);
    renderSidebar(visitData, 'viewerVisitList');
}

function exitViewerMode() {
    isViewerMode = false; currentRouteId = null;
    window.history.replaceState({}, document.title, window.location.pathname);
    document.getElementById('viewerPanel').classList.add('hidden');
    document.getElementById('viewerPanel').classList.remove('flex');
    document.getElementById('creatorPanel').classList.remove('hidden');
    document.getElementById('creatorPanel').classList.add('flex');
    document.getElementById('btnViewMode').classList.add('hidden');
    document.getElementById('btnLoadSample').classList.remove('hidden');
    clearMap();
    document.getElementById('visitList').innerHTML = `
        <div class="text-center py-12 text-slate-400">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7"/>
            </svg>
            <p class="text-sm">Upload a CSV file to see<br>your visit route</p>
        </div>`;
    updateMapOverlay('', '', '', '');
}

// ============================================
// CSV PROCESSING
// ============================================

// Recognized metadata row keys (case/space-insensitive) -> route field
const CSV_METADATA_KEYS = {
    'routetitle': 'title', 'title': 'title',
    'subtitle': 'subtitle',
    'visitdate': 'date', 'date': 'date',
    'source': 'source', 'datasource': 'source'
};

function normalizeDateForInput(d) {
    if (!d) return '';
    d = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const dt = new Date(d);
    if (!isNaN(dt.getTime())) {
        const y = dt.getFullYear(), m = String(dt.getMonth()+1).padStart(2,'0'), day = String(dt.getDate()).padStart(2,'0');
        return `${y}-${m}-${day}`;
    }
    return d;
}

function processCSV(file) {
    showLoading(true);
    // Parse raw (no header) first so we can detect leading metadata rows
    // (RouteTitle / Subtitle / VisitDate) before the real header + data rows.
    Papa.parse(file, {
        header: false, skipEmptyLines: true,
        complete: async function(results) {
            try {
                const rows = results.data;
                const meta = { title: '', subtitle: '', date: '', source: '' };
                let dataStartIdx = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || row.length < 2) break;
                    const key = clean(row[0]).toLowerCase().replace(/\s+/g, '');
                    if (CSV_METADATA_KEYS[key]) {
                        meta[CSV_METADATA_KEYS[key]] = clean(row[1]);
                        dataStartIdx = i + 1;
                    } else {
                        break;
                    }
                }

                const dataRows = rows.slice(dataStartIdx);
                if (dataRows.length < 2) {
                    alert('No visit data rows found in this CSV.');
                    showLoading(false);
                    return;
                }

                const headers = dataRows[0].map(h => clean(h));
                const dataObjs = dataRows.slice(1).map(r => {
                    const obj = {};
                    headers.forEach((h, idx) => obj[h] = r[idx]);
                    return obj;
                });

                let data = dataObjs
                    .filter(r => { const lat=parseFloat(r.lat), lon=parseFloat(r.lon); return !isNaN(lat)&&!isNaN(lon)&&lat!==0&&lon!==0; })
                    .map(r => ({Sl:clean(r.Sl), Time:clean(r.Time), Duration:clean(r.Duration), Activity:clean(r.Activity), Camp:clean(r.Camp), Agency:clean(r.Agency), lat:parseFloat(r.lat), lon:parseFloat(r.lon)}));
                data.sort((a,b) => (parseInt(a.Sl)||0)-(parseInt(b.Sl)||0));
                visitData = data; currentRouteId = null;

                // Auto-fill Route Information fields from metadata rows, if present
                if (meta.title) document.getElementById('routeTitle').value = meta.title;
                if (meta.subtitle) document.getElementById('routeSubtitle').value = meta.subtitle;
                if (meta.date) document.getElementById('routeDate').value = normalizeDateForInput(meta.date);
                if (meta.source) document.getElementById('routeSource').value = meta.source;
                if (meta.title || meta.subtitle || meta.date || meta.source) {
                    updateMapOverlay(
                        document.getElementById('routeTitle').value,
                        document.getElementById('routeSubtitle').value,
                        document.getElementById('routeDate').value,
                        document.getElementById('routeSource').value
                    );
                }

                await renderRoute(data); renderSidebar(data, 'visitList'); showLoading(false);
            } catch (err) {
                console.error(err);
                alert('Error parsing CSV: ' + err.message);
                showLoading(false);
            }
        },
        error: function(err) { alert('Error: '+err.message); showLoading(false); }
    });
}

function downloadCSVTemplate() {
    const csv = [
        'RouteTitle,"Bangladesh, Cox\'s Bazar: Rohingya Refugee Response"',
        'Subtitle,Canadian High Commissioner Visit',
        'VisitDate,2025-01-08',
        'Sl,Time,Duration,Activity,Camp,Agency,lat,lon',
        '1,10:30 - 11:15,(45 min),Hatimora Aggregation Center,Ukhiya,WFP-FAO,21.2526912,92.1724337',
        '2,11:20 - 11:40,(20 min),Homestead Gardening Egg Plant Cultivation,Rajapalong Ukhiya,WFP,21.254092,92.154327',
        '3,11:50 - 12:10,(20 min),Homestead Gardening Long Bean Cultivation,Rajapalong Ukhiya,WFP,21.254807,92.158063'
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'visit_route_template.csv'; a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// MAP CAPTURE - Use Canvas-native markers for perfect export
// ============================================

let exportMarkers = []; // Temporary canvas markers for export

function hideOverlaysForExport() {
    // Hide route labels (distance labels, arrow dots)
    routeLabels.forEach(l => { if (l.getElement()) l.getElement().style.display = 'none'; });
    // Hide tooltips, popups, controls
    document.querySelectorAll('.leaflet-tooltip').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.leaflet-popup').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.leaflet-control').forEach(el => el.style.display = 'none');
}

function showOverlaysAfterExport() {
    routeLabels.forEach(l => { if (l.getElement()) l.getElement().style.display = ''; });
    document.querySelectorAll('.leaflet-tooltip').forEach(el => el.style.display = '');
    document.querySelectorAll('.leaflet-popup').forEach(el => el.style.display = '');
    document.querySelectorAll('.leaflet-control').forEach(el => el.style.display = '');
}

function waitForTilesToLoad() {
    return new Promise((resolve) => {
        const check = () => {
            const tiles = document.querySelectorAll('.leaflet-tile');
            const loaded = Array.from(tiles).every(t => t.complete && t.naturalWidth !== 0);
            if (loaded && tiles.length > 0) setTimeout(resolve, 800);
            else setTimeout(check, 100);
        };
        setTimeout(check, 300);
    });
}

// Create Canvas-native circleMarker with permanent number tooltip for export
function createExportMarker(lat, lng, number) {
    const marker = L.circleMarker([lat, lng], {
        radius: 16,
        fillColor: MARKER_COLOR,
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
        renderer: L.canvas()
    });
    // Permanent number label - Canvas rendered, captured by html2canvas
    marker.bindTooltip(String(number), {
        permanent: true,
        direction: 'center',
        className: 'marker-number-label',
        offset: [0, 0]
    });
    return marker;
}

async function captureMapForExport() {
    // 1. Hide interactive divIcon markers and overlays
    markers.forEach(m => { if (m.getElement()) m.getElement().style.display = 'none'; });
    hideOverlaysForExport();

    // 2. Add Canvas-native markers for export (Leaflet renders these to Canvas)
    exportMarkers = [];
    visitData.forEach((item, i) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const num = parseInt(item.Sl) || (i + 1);
        const em = createExportMarker(lat, lon, num);
        em.addTo(map);
        exportMarkers.push(em);
    });

    // 3. Wait for tiles and render
    await waitForTilesToLoad();
    map.invalidateSize({ animate: false });
    await new Promise(r => setTimeout(r, 600));

    // 4. Capture - Canvas markers are part of the Leaflet Canvas, captured by html2canvas
    const mapEl = document.getElementById('map');
    const canvas = await html2canvas(mapEl, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#f1f5f9',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            const clonedMap = clonedDoc.getElementById('map');
            if (clonedMap) {
                clonedMap.style.width = mapEl.offsetWidth + 'px';
                clonedMap.style.height = mapEl.offsetHeight + 'px';
            }
        }
    });

    // 5. Remove export markers and restore interactive markers
    exportMarkers.forEach(m => map.removeLayer(m));
    exportMarkers = [];
    markers.forEach(m => { if (m.getElement()) m.getElement().style.display = ''; });
    showOverlaysAfterExport();

    return canvas;
}

// ============================================
// PNG EXPORT
// ============================================

async function exportPNG() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }

    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const subtitle = document.getElementById('routeSubtitle').value.trim();
    const date = document.getElementById('routeDate').value;
    const source = document.getElementById('routeSource').value.trim() || 'RCP';
    const created = new Date().toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});

    showLoading(true);

    try {
        const mapCanvas = await captureMapForExport();

        const pad = 40;
        const headerH = subtitle ? 120 : 90;
        const footerH = 100;
        const totalW = mapCanvas.width;
        const totalH = headerH + mapCanvas.height + footerH;

        const canvas = document.createElement('canvas');
        canvas.width = totalW; canvas.height = totalH;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, totalW, totalH);

        const grad = ctx.createLinearGradient(0, 0, totalW, 0);
        grad.addColorStop(0, '#0f766e'); grad.addColorStop(1, '#115e59');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, totalW, headerH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillText(title, pad, 50);

        if (subtitle) {
            ctx.font = '18px Inter, sans-serif';
            ctx.globalAlpha = 0.9;
            ctx.fillText(subtitle, pad, 80);
            ctx.globalAlpha = 1;
        }

        ctx.font = '14px Inter, sans-serif';
        ctx.globalAlpha = 0.7;
        ctx.fillText(fmtDate(date), pad, subtitle ? 108 : 78);
        ctx.globalAlpha = 1;

        if (logoDataUrl) {
            try {
                const logoImg = await loadImage(logoDataUrl);
                const maxLogoH = headerH - 30;
                const maxLogoW = 180;
                const scale = Math.min(maxLogoH / logoImg.height, maxLogoW / logoImg.width, 1);
                const lw = logoImg.width * scale, lh = logoImg.height * scale;
                ctx.drawImage(logoImg, totalW - pad - lw, (headerH - lh) / 2, lw, lh);
            } catch (e) { console.warn('Logo failed to render in PNG export', e); }
        }

        ctx.drawImage(mapCanvas, 0, headerH);

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, headerH + mapCanvas.height, totalW, footerH);
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, headerH + mapCanvas.height); ctx.lineTo(totalW, headerH + mapCanvas.height); ctx.stroke();

        const fy = headerH + mapCanvas.height + 28;
        ctx.fillStyle = '#64748b'; ctx.font = '13px Inter, sans-serif';
        ctx.fillText(`Created on: ${created}  ||  Data source: ${source}`, pad, fy);

        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Developed by Sabbir Hossain', totalW - pad, fy);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#475569'; ctx.font = '11px Inter, sans-serif';
        const discText = 'Disclaimer: The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.';
        wrapText(ctx, discText, pad, fy + 32, totalW - pad * 2, 18);

        const link = document.createElement('a');
        link.download = `${title.replace(/\s+/g,'_').toLowerCase()}_map.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('PNG export error:', err);
        alert('Export failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y); line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.fillText(line, x, y);
}

// ============================================
// PDF EXPORT
// ============================================

async function exportPDF() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }

    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const subtitle = document.getElementById('routeSubtitle').value.trim();
    const date = document.getElementById('routeDate').value;
    const source = document.getElementById('routeSource').value.trim() || 'RCP';
    const created = new Date().toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});

    const totalDist = document.getElementById('totalDistance').textContent;
    const locCount = document.getElementById('locationCount').textContent;
    const driveTime = document.getElementById('estDriveTime').textContent;

    showLoading(true);

    try {
        const mapCanvas = await captureMapForExport();

        let visitsHTML = '';
        visitData.forEach((item, i) => {
            const num = parseInt(item.Sl) || (i+1);
            visitsHTML += `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 8px;font-size:12px;font-weight:700;color:#0d9488;width:30px;">${num}</td>
                    <td style="padding:10px 8px;font-size:12px;color:#1e293b;font-weight:600;">${clean(item.Activity)||'--'}</td>
                    <td style="padding:10px 8px;font-size:11px;color:#475569;">${clean(item.Time)||'--'}</td>
                    <td style="padding:10px 8px;font-size:11px;color:#475569;">${clean(item.Duration)||'--'}</td>
                    <td style="padding:10px 8px;font-size:11px;color:#475569;">${clean(item.Camp)||'--'}</td>
                    <td style="padding:10px 8px;font-size:11px;color:#475569;">${clean(item.Agency)||'--'}</td>
                </tr>`;
        });

        const previewHTML = `
            <div style="padding:0;font-family:Inter,sans-serif;color:#1e293b;width:210mm;">
                <div style="background:linear-gradient(135deg,#0f766e 0%,#115e59 100%);color:white;padding:24px 30px;position:relative;">
                    ${logoDataUrl?`<img src="${logoDataUrl}" style="position:absolute;top:18px;right:30px;max-height:50px;max-width:120px;object-fit:contain;background:white;padding:4px;border-radius:6px;">`:''}
                    <h1 style="font-size:22px;font-weight:800;margin:0;letter-spacing:-0.5px;${logoDataUrl?'max-width:70%;':''}">${title}</h1>
                    ${subtitle?`<p style="font-size:14px;margin:6px 0 0 0;opacity:0.9;${logoDataUrl?'max-width:70%;':''}">${subtitle}</p>`:''}
                    <p style="font-size:12px;margin:8px 0 0 0;opacity:0.7;">${fmtDate(date)}</p>
                </div>

                <div style="padding:20px 30px;background:#f8fafc;">
                    <img src="${mapCanvas.toDataURL('image/png')}" style="width:100%;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:block;">
                </div>

                <div style="display:flex;gap:16px;margin:0 30px 20px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <div style="flex:1;text-align:center;">
                        <p style="font-size:20px;font-weight:700;color:#0d9488;margin:0;">${locCount}</p>
                        <p style="font-size:11px;color:#64748b;margin:4px 0 0 0;">Locations</p>
                    </div>
                    <div style="flex:1;text-align:center;border-left:1px solid #e2e8f0;">
                        <p style="font-size:20px;font-weight:700;color:#0d9488;margin:0;">${totalDist}</p>
                        <p style="font-size:11px;color:#64748b;margin:4px 0 0 0;">Total Distance</p>
                    </div>
                    <div style="flex:1;text-align:center;border-left:1px solid #e2e8f0;">
                        <p style="font-size:20px;font-weight:700;color:#0d9488;margin:0;">${driveTime}</p>
                        <p style="font-size:11px;color:#64748b;margin:4px 0 0 0;">Est. Drive Time</p>
                    </div>
                </div>

                <div style="padding:0 30px 20px;">
                    <h2 style="font-size:16px;font-weight:700;color:#0f766e;margin:0 0 12px 0;padding-bottom:8px;border-bottom:2px solid #0d9488;">Visit Schedule</h2>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f0fdfa;">
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">#</th>
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">Activity</th>
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">Time</th>
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">Duration</th>
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">Camp</th>
                                <th style="padding:10px 8px;font-size:11px;font-weight:700;color:#0f766e;text-align:left;text-transform:uppercase;">Agency</th>
                            </tr>
                        </thead>
                        <tbody>${visitsHTML}</tbody>
                    </table>
                </div>

                <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 30px;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin:0 0 8px 0;">
                        <p style="font-size:10px;color:#94a3b8;margin:0;">Created on: ${created}  ||  Data source: ${source}</p>
                        <p style="font-size:9px;color:#94a3b8;margin:0;">Developed by Sabbir Hossain</p>
                    </div>
                    <div style="font-size:9px;color:#64748b;line-height:1.5;border-left:3px solid #0d9488;padding-left:10px;background:#f0fdfa;padding:8px 12px;border-radius:0 6px 6px 0;">
                        <strong>Disclaimer:</strong> The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.
                    </div>
                </div>
            </div>`;

        document.getElementById('pdfPreviewContainer').innerHTML = previewHTML;
        document.getElementById('pdfModal').classList.remove('hidden');
    } catch (err) {
        console.error('PDF export error:', err);
        alert('PDF export failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const element = document.getElementById('pdfPreviewContainer');

    html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgW = 210;
        const pageH = 297;
        const imgH = (canvas.height * imgW) / canvas.width;
        let hLeft = imgH, pos = 0;

        pdf.addImage(imgData, 'PNG', 0, pos, imgW, imgH);
        hLeft -= pageH;
        while (hLeft > 0) {
            pos = hLeft - imgH;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, pos, imgW, imgH);
            hLeft -= pageH;
        }
        pdf.save(`${title.replace(/\s+/g,'_').toLowerCase()}_route.pdf`);
        document.getElementById('pdfModal').classList.add('hidden');
    });
}

// ============================================
// SAMPLE DATA
// ============================================

async function loadSampleData() {
    const sample = [
        {Sl:'1',Time:'10:30 - 11:15',Duration:'(45 min)',Activity:'Hatimora Aggregation Center',Camp:'Ukhiya',Agency:'WFP-FAO',lat:21.2526912,lon:92.1724337},
        {Sl:'2',Time:'11:20 - 11:40',Duration:'(20 min)',Activity:'Homestead Gardening Egg Plant Cultivation',Camp:'Rajapalong Ukhiya',Agency:'WFP',lat:21.254092,lon:92.154327},
        {Sl:'3',Time:'11:50 - 12:10',Duration:'(20 min)',Activity:'Homestead Gardening Long Beam Cultivation',Camp:'Rajapalong Ukhiya',Agency:'WFP',lat:21.254807,lon:92.158063},
        {Sl:'4',Time:'12:35 - 13:15',Duration:'(40 min)',Activity:'WGSS Meeting with Women Support Group',Camp:'Ratnapalong Ukhiya',Agency:'IOM',lat:21.272312,lon:92.108057},
        {Sl:'5',Time:'13:25 - 13:45',Duration:'(20 min)',Activity:'Small Infrastructure Construction Site',Camp:'Ratnapalong Ukhiya',Agency:'IOM',lat:21.27532,lon:92.10466},
        {Sl:'6',Time:'14:05 - 14:50',Duration:'(45 min)',Activity:'Self-help Group Shop',Camp:'Jaliapalong Ukhiya',Agency:'IOM',lat:21.286516,lon:92.05388}
    ];
    document.getElementById('routeTitle').value = "Bangladesh, Cox's Bazar: Rohingya Refugee Response";
    document.getElementById('routeSubtitle').value = "Canadian High Commissioner Visit";
    document.getElementById('routeDate').value = "2025-01-08";
    document.getElementById('routeSource').value = "RCP";
    showLoading(true);
    visitData = sample; currentRouteId = null;
    updateMapOverlay("Bangladesh, Cox's Bazar: Rohingya Refugee Response", "Canadian High Commissioner Visit", "2025-01-08", "RCP");
    await renderRoute(sample); renderSidebar(sample, 'visitList'); showLoading(false);
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(show) { document.getElementById('loadingOverlay').classList.toggle('hidden', !show); }
function showOSRMLoading(show) { document.getElementById('osrmLoading').classList.toggle('hidden', !show); }

function setRouteMode(realRoute) {
    useRealRoute = realRoute;
    const br = document.getElementById('btnRealRoute'), bd = document.getElementById('btnDirectRoute');
    if (realRoute) {
        br.className = 'flex-1 px-3 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5';
        bd.className = 'flex-1 px-3 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition flex items-center justify-center gap-1.5';
    } else {
        br.className = 'flex-1 px-3 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition flex items-center justify-center gap-1.5';
        bd.className = 'flex-1 px-3 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5';
    }
    if (visitData.length > 0) renderRoute(visitData);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMap(); renderSavedRoutes();

    const sharedRouteId = getUrlParam('route');
    if (sharedRouteId) enterViewerMode(sharedRouteId);

    // File upload
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', e => {
        e.preventDefault(); uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processCSV(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', e => { if (e.target.files.length > 0) processCSV(e.target.files[0]); });

    // Logo upload
    const logoInput = document.getElementById('logoInput');
    const logoUploadZone = document.getElementById('logoUploadZone');
    logoUploadZone.addEventListener('click', e => { if (e.target.id !== 'btnRemoveLogo') logoInput.click(); });
    logoUploadZone.addEventListener('dragover', e => { e.preventDefault(); logoUploadZone.classList.add('dragover'); });
    logoUploadZone.addEventListener('dragleave', () => logoUploadZone.classList.remove('dragover'));
    logoUploadZone.addEventListener('drop', e => {
        e.preventDefault(); logoUploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processLogoFile(e.dataTransfer.files[0]);
    });
    logoInput.addEventListener('change', e => { if (e.target.files.length > 0) processLogoFile(e.target.files[0]); });
    document.getElementById('btnRemoveLogo').addEventListener('click', e => { e.stopPropagation(); removeLogo(); });

    // CSV template download
    document.getElementById('btnDownloadTemplate').addEventListener('click', downloadCSVTemplate);

    // Metadata updates
    ['routeTitle','routeSubtitle','routeDate','routeSource'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            if (!isViewerMode) updateMapOverlay(
                document.getElementById('routeTitle').value,
                document.getElementById('routeSubtitle').value,
                document.getElementById('routeDate').value,
                document.getElementById('routeSource').value
            );
        });
    });

    // Buttons
    document.getElementById('btnExportPNG').addEventListener('click', exportPNG);
    document.getElementById('btnExportPDF').addEventListener('click', exportPDF);
    document.getElementById('btnLoadSample').addEventListener('click', loadSampleData);
    document.getElementById('btnRealRoute').addEventListener('click', () => setRouteMode(true));
    document.getElementById('btnDirectRoute').addEventListener('click', () => setRouteMode(false));
    document.getElementById('btnViewMode').addEventListener('click', exitViewerMode);
    document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebar);

    // Save modal
    document.getElementById('btnSaveRoute').addEventListener('click', openSaveModal);
    document.getElementById('btnCloseSaveModal').addEventListener('click', closeSaveModal);
    document.getElementById('btnConfirmSave').addEventListener('click', confirmSaveRoute);
    document.getElementById('btnDownloadJSON').addEventListener('click', downloadCurrentJSON);

    // Share modal
    document.getElementById('btnCloseShareModal').addEventListener('click', () => document.getElementById('shareModal').classList.add('hidden'));
    document.getElementById('btnCopyLink').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('shareLinkBox').textContent).then(() => {
            const btn = document.getElementById('btnCopyLink');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!';
            setTimeout(() => btn.innerHTML = orig, 2000);
        });
    });
    document.getElementById('btnDownloadShareJSON').addEventListener('click', downloadCurrentJSON);

    // PDF modal
    document.getElementById('btnClosePDFModal').addEventListener('click', () => document.getElementById('pdfModal').classList.add('hidden'));
    document.getElementById('btnCancelPDF').addEventListener('click', () => document.getElementById('pdfModal').classList.add('hidden'));
    document.getElementById('btnDownloadPDF').addEventListener('click', downloadPDF);

    // Modal overlay clicks
    ['saveModal','shareModal','pdfModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
        });
    });

    setTimeout(loadSampleData, 500);
});
