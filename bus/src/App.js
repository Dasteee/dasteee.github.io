import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Popup, Polyline, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import DriftMarker from 'react-leaflet-drift-marker';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Import JSON data ---
import linijeData from './linije_i_stanice.json';

// --- Fix Leaflet icons in React-Leaflet ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Depot polygon ---
const depotPolygon = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "coordinates": [[[20.932170293654366, 44.0153864359952], [20.93266686423732, 44.01548584728417], [20.93249285512971, 44.01567836851265], [20.932278690074526, 44.01606340909379], [20.9316897361725, 44.017112631989306], [20.930725993423522, 44.01692011541806], [20.928731581345517, 44.01613079093855], [20.928276480603614, 44.01549547336032], [20.928926918335264, 44.0147278437004], [20.930076209990858, 44.0141267308488], [20.932397927039034, 44.01503411701253], [20.932170293654366, 44.0153864359952]]],
            "type": "Polygon"
        }
    }]
};

// --- Helper functions ---
const cyrillicToLatinMap = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e', 'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č', 'џ': 'dž', 'ш': 'š', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ', 'Е': 'E', 'Ж': 'Ž', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'Р', 'С': 'S', 'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ч', 'Џ': 'Dž', 'Ш': 'Š' };
const toLatin = (text) => text ? text.split('').map(char => cyrillicToLatinMap[char] || char).join('') : '';

function getVehicleInfo(bus_id) {
    const busIdStr = String(bus_id);
    if (busIdStr.startsWith('30')) return ["Strela Obrenovac", busIdStr.substring(2)];
    if (busIdStr.startsWith('70')) return ["Vulović Transport", busIdStr.substring(2)];
    return ["Nepoznat prevoznik", busIdStr];
}

function getCleanLineNumber(routeCode) {
    if (!routeCode || typeof routeCode !== 'string') return "N/A";
    try {
        const codeInt = parseInt(routeCode, 10);
        const suburban = codeInt % 1000;
        if (suburban >= 600 && suburban <= 613) return String(suburban);
        const city = codeInt % 100;
        if (city >= 1 && city <= 30) return String(city);
        if ((codeInt >= 1 && codeInt <= 30) || (codeInt >= 600 && codeInt <= 613)) return String(codeInt);
        return routeCode;
    } catch (e) {
        return routeCode;
    }
}

function parseBusTime(timeString) {
    if (timeString instanceof Date) return timeString;
    const year = parseInt(timeString.substring(0, 4), 10);
    const month = parseInt(timeString.substring(4, 6), 10) - 1;
    const day = parseInt(timeString.substring(6, 8), 10);
    const hour = parseInt(timeString.substring(8, 10), 10);
    const minute = parseInt(timeString.substring(10, 12), 10);
    const second = parseInt(timeString.substring(12, 14), 10);
    return new Date(year, month, day, hour, minute, second);
}

function formatTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (seconds < 60) return `pre ${seconds} s`;
    if (minutes < 60) return `pre ${minutes} min`;
    if (hours < 24) return `pre ${hours} h ${minutes % 60} min`;
    return `pre više od 24h`;
}

function formatExactTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatExactDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year}. ${hours}:${minutes}:${seconds}`;
}

function getBusStatus(lastGpsTime) {
    const lastSeenDate = parseBusTime(lastGpsTime);
    const now = new Date();
    const diffMinutes = (now - lastSeenDate) / 60000;
    const archiveCutoff = new Date(2024, 0, 1);
    if (lastSeenDate < archiveCutoff) return { mainColor: '#343a40', signalColor: '#343a40', label: 'Arhiva', bars: 0, type: 'Arhiva' };
    if (diffMinutes <= 10) return { mainColor: '#007bff', signalColor: '#28a745', label: `Aktivan`, bars: 3, type: 'Aktivan' };
    if (diffMinutes <= 60) return { mainColor: '#007bff', signalColor: '#fd7e14', label: `Neaktivan`, bars: 2, type: 'Aktivan' };
    if (diffMinutes <= 1440) return { mainColor: '#6c757d', signalColor: '#6c757d', label: `Neaktivan`, bars: 1, type: 'Neaktivan' };
    return { mainColor: '#343a40', signalColor: '#343a40', label: `Neaktivan`, bars: 0, type: 'Neaktivan' };
}

function isBusInDepot(bus) {
    const lat = parseFloat(bus.LATITUDE.replace(',', '.'));
    const lon = parseFloat(bus.LONGITUDE.replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) return false;
    const busPoint = turf.point([lon, lat]);
    const polygonFeature = depotPolygon.features[0];
    return turf.booleanPointInPolygon(busPoint, polygonFeature);
}

const createBusIconWithSignal = (line_number, internal_id, status, shouldPulse = false) => {
    const barOpacities = { 3: [1, 1, 1], 2: [0.3, 1, 1], 1: [0.3, 0.3, 1], 0: [0.3, 0.3, 0.3] };
    const opacities = barOpacities[status.bars] || barOpacities[0];
    const pulseClass = shouldPulse ? ' pulse' : '';
    return L.divIcon({
        html: `<div class="bus-icon-wrapper"><div class="bus-icon-main${pulseClass}" style="background-color: ${status.mainColor};"><div class="bus-line-number">${line_number}</div><div class="bus-internal-id">#${internal_id}</div></div><div class="signal-badge"><svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1,9 A8,8 0 0 1 9,1" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[0]}"/><path d="M4,9 A4,4 0 0 1 9,4" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[1]}"/><circle cx="9" cy="9" r="1.5" fill="${status.signalColor}" style="opacity: ${opacities[2]}"/></svg></div></div>`,
        className: 'custom-bus-icon-wrapper',
        iconSize: [50, 50],
        iconAnchor: [25,0],
    });
};

const busIconStyles = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'); @keyframes pulse-icon { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); } 50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); } } .custom-bus-icon-wrapper { background: transparent; border: none; }.bus-icon-wrapper { position: relative; width: 56px; height: 56px; filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.4)); }.bus-icon-main { position: relative; width: 48px; height: 48px; border-radius: 10px; border: 2.5px solid white; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.2s ease, background-color 0.5s ease; padding: 3px; }.bus-icon-main.pulse { animation: pulse-icon 2s ease-in-out infinite; }.bus-icon-wrapper:hover .bus-icon-main { transform: scale(1.15); }.bus-line-number { color: white; font-size: 18px; font-weight: 700; line-height: 1; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); font-family: 'JetBrains Mono', monospace; letter-spacing: -0.5px; }.bus-internal-id { color: rgba(255,255,255,0.9); font-size: 10px; font-weight: 600; line-height: 1; margin-top: 2px; text-shadow: 1px 1px 1px rgba(0,0,0,0.4); font-family: 'JetBrains Mono', monospace; }.signal-badge { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background-color: white; border-radius: 50%; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; } .search-input-mono { font-family: 'JetBrains Mono', monospace; }`;

// --- Components ---
const BusMarker = React.memo(({ bus }) => {
    const [timeAgo, setTimeAgo] = useState('');
    const lastSeenDate = useMemo(() => parseBusTime(bus.LAST_GPS_TIME), [bus.LAST_GPS_TIME]);
    const cleanLine = useMemo(() => getCleanLineNumber(bus.ROUTE_CODE), [bus.ROUTE_CODE]);
    const [operator, internal] = useMemo(() => getVehicleInfo(bus.BUS_ID), [bus.BUS_ID]);
    const status = useMemo(() => getBusStatus(bus.LAST_GPS_TIME), [bus.LAST_GPS_TIME]);
    const inDepot = useMemo(() => isBusInDepot(bus), [bus]);
    const isInactive = useMemo(() => {
        const now = new Date();
        const diffMinutes = (now - lastSeenDate) / 60000;
        return diffMinutes > 60;
    }, [lastSeenDate]);
    const exactDateTime = useMemo(() => formatExactDateTime(lastSeenDate), [lastSeenDate]);
    const shouldPulse = useMemo(() => {
        const now = new Date();
        const diffSeconds = (now - lastSeenDate) / 1000;
        return diffSeconds <= 10; // Pulse if updated in last 10 seconds
    }, [lastSeenDate]);
    
    useEffect(() => {
        const updateTimer = () => setTimeAgo(formatTimeAgo(lastSeenDate));
        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [lastSeenDate]);

    const lat = parseFloat(bus.LATITUDE.replace(',', '.'));
    const lon = parseFloat(bus.LONGITUDE.replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) return null;

    return (
        <DriftMarker position={[lat, lon]} duration={4000} icon={createBusIconWithSignal(cleanLine, internal, status, shouldPulse)}>
            <Popup>
                <b>Linija: {cleanLine}</b> ({bus.ROUTE_CODE})<br />
                <b>Vozilo:</b> {bus.BUS_ID}<br />
                {operator} #{internal}<br />
                <b>Status:</b> {status.label} ({timeAgo})<br />
                {isInactive && <><b>Poslednji signal:</b> {exactDateTime}<br /></>}
                {inDepot && <span style={{color: '#dc2626', fontWeight: 'bold'}}>U depou</span>}
            </Popup>
        </DriftMarker>
    );
});

const ChangeView = ({ center, zoom, bounds }) => {
    const map = useMap();
    useEffect(() => { 
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (center) {
            map.flyTo(center, zoom);
        }
    }, [center, zoom, bounds, map]);
    return null;
};

const MapaComponent = ({ buses, mapCenter, mapZoom, selectedLineRoute, mapBounds }) => {
    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100vw' }} zoomControl={false}>
            <ChangeView center={mapCenter} zoom={mapZoom} bounds={mapBounds} />
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay checked name="Aktivni autobusi (< 1h)">
                    <LayerGroup>
                        {buses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type === 'Aktivan').map(bus => <BusMarker key={`active-${bus.BUS_ID}`} bus={bus} />)}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Neaktivni autobusi (> 1h)">
                    <LayerGroup>
                        {buses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type !== 'Aktivan' && getBusStatus(bus.LAST_GPS_TIME).type !== 'Arhiva').map(bus => <BusMarker key={`inactive-${bus.BUS_ID}`} bus={bus} />)}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Arhivirani autobusi (pre 2024)">
                    <LayerGroup>
                        {buses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type === 'Arhiva').map(bus => <BusMarker key={`archived-${bus.BUS_ID}`} bus={bus} />)}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
            {/* Selected Line Route */}
            {selectedLineRoute && (
                <Polyline 
                    positions={selectedLineRoute.positions} 
                    pathOptions={{ 
                        color: selectedLineRoute.color, 
                        weight: 5, 
                        opacity: 0.7
                    }} 
                />
            )}
        </MapContainer>
    );
};

const SearchComponent = ({ linije, buses, onResultSelect, searchTerm, setSearchTerm }) => {
    const [results, setResults] = useState([]);
    const [showAllBuses, setShowAllBuses] = useState(false);
    const searchInputRef = useRef(null);

    const uniqueLinije = useMemo(() => {
        const seen = new Set();
        return linije.filter(el => {
            const duplicate = seen.has(el.routeDisplayCode);
            seen.add(el.routeDisplayCode);
            return !duplicate;
        }).sort((a, b) => a.routeDisplayCode.localeCompare(b.routeDisplayCode, undefined, { numeric: true }));
    }, [linije]);

    // Memoize bus counts per line
    const busCountPerLine = useMemo(() => {
        const counts = {};
        buses.forEach(bus => {
            const line = getCleanLineNumber(bus.ROUTE_CODE);
            counts[line] = (counts[line] || 0) + 1;
        });
        return counts;
    }, [buses]);

    const handleSearchChange = useCallback((e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setShowAllBuses(false);

        if (newSearchTerm.trim() === '') {
            setResults([]);
            onResultSelect(null);
            return;
        }

        const lowerCaseSearchTerm = newSearchTerm.toLowerCase();
        const latinSearchTerm = toLatin(lowerCaseSearchTerm);
        let foundResults = [];

        // Filter out "Nepoznat prevoznik" buses from search
        const knownBuses = buses.filter(bus => {
            const [operator] = getVehicleInfo(bus.BUS_ID);
            return operator !== "Nepoznat prevoznik";
        });

        const exactBusMatch = knownBuses.filter(bus => {
            const [, internalId] = getVehicleInfo(bus.BUS_ID);
            return String(bus.BUS_ID) === newSearchTerm || String(internalId) === newSearchTerm;
        }).map(bus => {
            const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
            return { ...bus, type: 'bus', internalId, operator, score: 4 };
        });
        foundResults.push(...exactBusMatch);

        const exactLineMatch = uniqueLinije.filter(l => l.routeDisplayCode.toLowerCase() === lowerCaseSearchTerm).map(l => ({ ...l, type: 'linija', score: 3 }));
        foundResults.push(...exactLineMatch);

        const partialBusMatches = knownBuses.filter(bus => {
            if (foundResults.some(r => r.type === 'bus' && r.BUS_ID === bus.BUS_ID)) return false;
            const [, internalId] = getVehicleInfo(bus.BUS_ID);
            return String(bus.BUS_ID).includes(newSearchTerm) || String(internalId).includes(newSearchTerm);
        }).map(bus => {
            const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
            return { ...bus, type: 'bus', internalId, operator, score: 2 };
        });
        foundResults.push(...partialBusMatches);

        const partialLineMatches = uniqueLinije.filter(l => (l.routeDisplayCode.toLowerCase().includes(lowerCaseSearchTerm) || toLatin(l.routeName.toLowerCase()).includes(latinSearchTerm)) && !foundResults.some(r => r.type === 'linija' && r.routeCode === l.routeCode)).map(l => ({ ...l, type: 'linija', score: 1 }));
        foundResults.push(...partialLineMatches);

        foundResults.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            const typeOrder = { 'bus': 3, 'linija': 2 };
            if (typeOrder[a.type] !== typeOrder[b.type]) return typeOrder[b.type] - typeOrder[a.type];
            let nameA = a.type === 'bus' ? a.internalId : a.routeDisplayCode;
            let nameB = b.type === 'bus' ? b.internalId : b.routeDisplayCode;
            return String(nameA).localeCompare(String(nameB), undefined, { numeric: true });
        });

        setResults(foundResults);
    }, [buses, uniqueLinije, onResultSelect, setSearchTerm]);

    const handleResultClick = useCallback((result) => {
        onResultSelect(result);
        let displayValue = result.type === 'linija' ? `Linija: ${result.routeDisplayCode}` : `#${result.internalId} ${result.operator}`;
        setSearchTerm(displayValue);
        setResults([]);
        setShowAllBuses(false);
        searchInputRef.current?.blur();
    }, [onResultSelect, setSearchTerm]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setResults([]);
        onResultSelect(null);
        setShowAllBuses(false);
    }, [onResultSelect, setSearchTerm]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClearSearch();
            } else if (e.key === 'Enter' && results.length > 0) {
                handleResultClick(results[0]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [results, handleClearSearch, handleResultClick]);

    const busResults = results.filter(item => item.type === 'bus');
    const lineResults = results.filter(item => item.type === 'linija');
    const displayedBusResults = showAllBuses ? busResults : busResults.slice(0, 3);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-11/12 md:w-1/3">
            <div className="relative">
                <input ref={searchInputRef} type="text" placeholder="Pronađi liniju ili vozilo..." className="search-input-mono w-full p-3 pr-10 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={handleSearchChange} />
                {searchTerm && (<button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">&#x2715;</button>)}
            </div>
            {results.length > 0 && (
                <ul className="bg-white border rounded-lg mt-2 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                    {displayedBusResults.map(item => (
                        <li key={`bus-${item.BUS_ID}`} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">#{item.internalId} <span className="font-normal text-gray-600">{item.operator}</span></p>
                        </li>
                    ))}
                    {busResults.length > 3 && !showAllBuses && (
                        <li className="p-3 text-center text-blue-600 cursor-pointer hover:bg-gray-100 border-t" onClick={() => setShowAllBuses(true)}>Prikaži još autobusa ({busResults.length - 3})</li>
                    )}
                    {lineResults.map(item => (
                        <li key={item.routeCode} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">
                                Linija: {item.routeDisplayCode}
                                <span className="text-xs ml-2 text-gray-500">({busCountPerLine[item.routeDisplayCode] || 0} autobusa)</span>
                            </p>
                            <p className="text-sm text-gray-500">{item.routeName.replace(/ - /g, ' ↔ ')}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

function App() {
    const [buses, setBuses] = useState([]);
    const [linije] = useState(linijeData);
    const [mapCenter, setMapCenter] = useState([44.0165, 20.9114]);
    const [mapZoom, setMapZoom] = useState(13);
    const [mapBounds, setMapBounds] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLine, setSelectedLine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [showStats, setShowStats] = useState(() => {
        const saved = localStorage.getItem('showStats');
        return saved ? JSON.parse(saved) : true;
    });
    const [operatorFilter, setOperatorFilter] = useState(() => {
        const saved = localStorage.getItem('operatorFilter');
        return saved || 'all';
    });
    const [selectedLineRouteCode, setSelectedLineRouteCode] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : { buses: [], lines: [] };
    });

    // Memoize bus statistics
    const busStats = useMemo(() => {
        const stats = {
            total: buses.length,
            active: 0,
            inactive: 0,
            archived: 0,
            inDepot: 0,
            byOperator: {}
        };
        buses.forEach(bus => {
            const status = getBusStatus(bus.LAST_GPS_TIME);
            const [operator] = getVehicleInfo(bus.BUS_ID);
            const inDepot = isBusInDepot(bus);
            
            if (inDepot) {
                stats.inDepot++;
            } else if (status.type === 'Aktivan') {
                stats.active++;
            } else if (status.type === 'Arhiva') {
                stats.archived++;
            } else {
                stats.inactive++;
            }
            
            if (!stats.byOperator[operator]) {
                stats.byOperator[operator] = { active: 0, total: 0 };
            }
            stats.byOperator[operator].total++;
            if (status.type === 'Aktivan' && !inDepot) {
                stats.byOperator[operator].active++;
            }
        });
        return stats;
    }, [buses]);

    // Filtered buses by operator and selected line
    const filteredBuses = useMemo(() => {
        let filtered = buses;
        
        // Filter by operator
        if (operatorFilter !== 'all') {
            filtered = filtered.filter(bus => {
                const [operator] = getVehicleInfo(bus.BUS_ID);
                return operator === operatorFilter;
            });
        }
        
        // Filter by selected line
        if (selectedLine) {
            filtered = filtered.filter(bus => {
                const cleanLine = getCleanLineNumber(bus.ROUTE_CODE);
                return cleanLine === selectedLine;
            });
        }
        
        return filtered;
    }, [buses, operatorFilter, selectedLine]);

    useEffect(() => {
        localStorage.setItem('showStats', JSON.stringify(showStats));
    }, [showStats]);

    useEffect(() => {
        localStorage.setItem('operatorFilter', operatorFilter);
    }, [operatorFilter]);


    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Process route lines from JSON data
    const routeLines = useMemo(() => {
        const routesMap = {};
        linije.forEach(stop => {
            if (!routesMap[stop.routeCode]) {
                routesMap[stop.routeCode] = {
                    code: stop.routeCode,
                    displayCode: stop.routeDisplayCode,
                    name: stop.routeName,
                    positions: [],
                    color: `hsl(${(parseInt(stop.routeCode) * 137) % 360}, 70%, 50%)`
                };
            }
            routesMap[stop.routeCode].positions.push([parseFloat(stop.latitude), parseFloat(stop.longitude)]);
        });
        return Object.values(routesMap);
    }, [linije]);

    const fetchBuses = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch('https://kg-bus-proxy.dastegraphs.workers.dev/bus-data/location-tracking', {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfdHlwZSI6IkVLR19NT0JJTEVfQVBQIiwiaWF0IjoxNzQ0ODAwOTc0fQ.Ni2RKLQSSd2u1CBQv4yn2pNMXgRKJUmpMWR4qRSEQzw'
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            const parsedData = JSON.parse(responseData.data);
            const busesArray = parsedData?.ROOT?.BUSES?.BUS || [];
            console.log('Buses count:', busesArray.length);
            setBuses(busesArray);
            setLastUpdate(new Date());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching buses:', error);
            setError(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBuses();
        const interval = setInterval(fetchBuses, 10000);
        return () => clearInterval(interval);
    }, [fetchBuses]);

    const handleResultSelect = useCallback((result) => {
        if (!result) {
            setSelectedLine(null);
            setSelectedLineRouteCode(null);
            setMapBounds(null);
            return;
        }
        if (result.type === 'bus') {
            const lat = parseFloat(result.LATITUDE.replace(',', '.'));
            const lon = parseFloat(result.LONGITUDE.replace(',', '.'));
            if (!isNaN(lat) && !isNaN(lon)) {
                setMapCenter([lat, lon]);
                setMapZoom(16);
                setMapBounds(null);
                setSelectedLine(null);
                setSelectedLineRouteCode(null);
            }
        } else if (result.type === 'linija') {
            // Find all stops for this route to calculate bounds
            const routeStops = linije.filter(l => l.routeCode === result.routeCode);
            if (routeStops.length > 0) {
                const bounds = routeStops.map(stop => [parseFloat(stop.latitude), parseFloat(stop.longitude)]);
                setMapBounds(bounds);
                setMapCenter(null); // Clear center when using bounds
                setSelectedLine(result.routeDisplayCode);
                setSelectedLineRouteCode(result.routeCode);
            }
        }
    }, [linije]);

    // Favorites functionality - UI coming soon
    // eslint-disable-next-line no-unused-vars
    const toggleFavorite = useCallback((type, id) => {
        setFavorites(prev => {
            const key = type === 'bus' ? 'buses' : 'lines';
            const isFavorited = prev[key].includes(id);
            return {
                ...prev,
                [key]: isFavorited ? prev[key].filter(item => item !== id) : [...prev[key], id]
            };
        });
    }, []);

    // Get the selected line's route data
    const selectedLineRoute = useMemo(() => {
        if (!selectedLineRouteCode) return null;
        return routeLines.find(route => route.code === selectedLineRouteCode) || null;
    }, [selectedLineRouteCode, routeLines]);

    return (
        <div className="h-screen w-screen relative">
            <style>{busIconStyles}</style>
            <MapaComponent buses={filteredBuses} mapCenter={mapCenter} mapZoom={mapZoom} selectedLineRoute={selectedLineRoute} mapBounds={mapBounds} />
            <SearchComponent linije={linije} buses={filteredBuses} onResultSelect={handleResultSelect} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {/* Loading Indicator */}
            {loading && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Učitavanje podataka...</span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-md">
                    <div className="flex items-center gap-2">
                        <span>Greška: {error}</span>
                        <button onClick={fetchBuses} className="ml-2 underline">Pokušaj ponovo</button>
                    </div>
                </div>
            )}

            {/* Refresh Button & Connection Status */}
            <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
                <button 
                    onClick={fetchBuses}
                    disabled={loading}
                    className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Osveži podatke"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                </button>
                {lastUpdate && (
                    <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-xs text-gray-600">
                        <div>Poslednje ažuriranje:</div>
                        <div className="font-mono">{formatExactTime(lastUpdate)}</div>
                    </div>
                )}
            </div>

            {/* Statistics Panel */}
            {showStats && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Statistika</h3>
                        <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-800 text-xl leading-none">&times;</button>
                    </div>
                    
                    {/* Statistics */}
                    <div className="space-y-2 text-sm mb-4">
                        <h4 className="font-semibold text-gray-700"> </h4>
                        <div className="flex justify-between">
                            <span className="font-semibold">Ukupno autobusa:</span>
                            <span className="font-mono">{busStats.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Aktivni:</span>
                            <span className="font-mono text-green-600">{busStats.active}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">U depou:</span>
                            <span className="font-mono text-blue-600">{busStats.inDepot}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Neaktivni:</span>
                            <span className="font-mono text-gray-600">{busStats.inactive}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Arhiva:</span>
                            <span className="font-mono text-gray-400">{busStats.archived}</span>
                        </div>
                        <div className="space-y-1 mt-2">
                            <p className="font-semibold text-xs text-gray-600">Po prevoznicima:</p>
                            {Object.entries(busStats.byOperator)
                                .filter(([op]) => op !== "Nepoznat prevoznik")
                                .map(([operator, stats]) => (
                                    <div key={operator} className="flex justify-between text-xs">
                                        <span className="truncate mr-2">{operator}</span>
                                        <span className="font-mono">
                                            <span className="text-green-600">{stats.active}</span>
                                            <span className="text-gray-400"> ({stats.total})</span>
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                    
                    <hr className="my-3" />
                    
                    {/* Filters */}
                    <div className="space-y-2 text-sm mb-4">
                        <h4 className="font-semibold text-gray-700">Filteri</h4>
                        <div>
                            <label className="font-semibold text-xs block mb-1">Prevoznik:</label>
                            <select 
                                value={operatorFilter} 
                                onChange={(e) => setOperatorFilter(e.target.value)}
                                className="w-full text-xs border rounded px-2 py-1"
                            >
                                <option value="all">Svi prevoznici</option>
                                {Object.keys(busStats.byOperator)
                                    .filter(op => op !== "Nepoznat prevoznik")
                                    .map(operator => (
                                        <option key={operator} value={operator}>{operator}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    
                </div>
            )}

            {/* Toggle Stats Button */}
            {!showStats && (
                <button 
                    onClick={() => setShowStats(true)}
                    className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 hover:bg-gray-100 transition-colors"
                    title="Prikaži statistiku"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </button>
            )}
        </div>
    );
}

export default App;
