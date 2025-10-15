import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl, LayerGroup, useMap, Polyline } from 'react-leaflet';
import DriftMarker from 'react-leaflet-drift-marker';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polylineUtil from '@mapbox/polyline';

// --- Importujemo JSON podatke direktno ---
import staniceData from './stanice.json';
import linijeData from './linije_i_stanice.json';
import redVoznjeData from './red_voznje.json';
import etaData from './eta_data_popravljen.json'; // Učitavamo dobavljene ETA podatke

// --- Rešavanje problema sa ikonicama u React-Leaflet ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------------

// --- GeoJSON za depot (koordinate su longitude, latitude) ---
const depotPolygon = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    [
                        [20.932170293654366, 44.0153864359952],
                        [20.93266686423732, 44.01548584728417],
                        [20.93249285512971, 44.01567836851265],
                        [20.932278690074526, 44.01606340909379],
                        [20.9316897361725, 44.017112631989306],
                        [20.930725993423522, 44.01692011541806],
                        [20.928731581345517, 44.01613079093855],
                        [20.928276480603614, 44.01549547336032],
                        [20.928926918335264, 44.0147278437004],
                        [20.930076209990858, 44.0141267308488],
                        [20.932397927039034, 44.01503411701253],
                        [20.932170293654366, 44.0153864359952]
                    ]
                ],
                "type": "Polygon"
            }
        }
    ]
};

// --- Helper funkcije (Global Scope) ---
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
    // Proverava da li je već Date objekat
    if (timeString instanceof Date) return timeString;
    // Ako je string u "HH:MM" formatu (za vreme dolaska), kreira Date objekat za danas
    if (timeString && timeString.length === 5 && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    // Standardni format "YYYYMMDDHHMMSS"
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
    if (minutes < 60) return `pre ${minutes} min ${seconds % 60} s`;
    if (hours < 24) return `pre ${hours} h ${minutes % 60} min`;
    return `pre više od 24h`;
}

function addMinutesToTime(timeString, minutesToAdd) {
    if (!timeString) return '';
    const date = parseBusTime(timeString); // Koristimo parseBusTime za inicijalizaciju Date objekta
    if (isNaN(date.getTime())) return ''; // Provera da li je validan datum

    date.setMinutes(date.getMinutes() + minutesToAdd);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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

// Funkcija za proveru da li je autobus u depou
function isBusInDepot(bus) {
    const lat = parseFloat(bus.LATITUDE.replace(',', '.'));
    const lon = parseFloat(bus.LONGITUDE.replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) return false;

    const busPoint = turf.point([lon, lat]); // turf koristi [longitude, latitude]
    const polygonFeature = depotPolygon.features[0];
    return turf.booleanPointInPolygon(busPoint, polygonFeature);
}


const createBusIconWithSignal = (line_number, status) => {
    const barOpacities = { 3: [1, 1, 1], 2: [0.3, 1, 1], 1: [0.3, 0.3, 1], 0: [0.3, 0.3, 0.3] };
    const opacities = barOpacities[status.bars] || barOpacities[0];

    return L.divIcon({
        html: `<div class="bus-icon-wrapper">
<div class="bus-icon-main" style="background-color: ${status.mainColor};">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="bus-icon-svg">
<path d="M18.5,3H5.5C4.67,3,4,3.67,4,4.5v12C4,17.33,4.67,18,5.5,18H6v2h2v-2h8v2h2v-2h0.5c0.83,0,1.5-0.67,1.5-1.5v-12 C20,3.67,19.33,3,18.5,3z M7,15c-0.83,0-1.5-0.67-1.5-1.5S6.17,12,7,12s1.5,0.67,1.5,1.5S7.83,15,7,15z M17,15 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S17.83,15,17,15z M18,10H6V5h12V10z"/>
</svg>
<div class="bus-icon-line-text">${line_number}</div>
</div>
<div class="signal-badge">
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1,9 A8,8 0 0 1 9,1" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[0]}"/>
<path d="M4,9 A4,4 0 0 1 9,4" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[1]}"/>
<circle cx="9" cy="9" r="1.5" fill="${status.signalColor}" style="opacity: ${opacities[2]}"/>
</svg>
</div>
</div>`,
        className: 'custom-bus-icon-wrapper',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const busIconStyles = `
.custom-bus-icon-wrapper { background: transparent; border: none; }
.bus-icon-wrapper { position: relative; width: 40px; height: 40px; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.4)); }
.bus-icon-main { position: relative; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, background-color 0.5s ease; }
.bus-icon-wrapper:hover .bus-icon-main { transform: scale(1.1); }
.bus-icon-svg { width: 18px; height: 18px; color: white; }
.bus-icon-line-text { position: absolute; bottom: -1px; color: white; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 1px #000; }
.signal-badge { position: absolute; top: -2px; left: -2px; width: 16px; height: 16px; background-color: white; border-radius: 50%; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; }
`;

// --- Komponente ---

const BusMarker = ({ bus }) => {
    const [timeAgo, setTimeAgo] = useState('');
    useEffect(() => {
        const lastSeenDate = parseBusTime(bus.LAST_GPS_TIME);
        const updateTimer = () => setTimeAgo(formatTimeAgo(lastSeenDate));
        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [bus.LAST_GPS_TIME]);

    const lat = parseFloat(bus.LATITUDE.replace(',', '.'));
    const lon = parseFloat(bus.LONGITUDE.replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) return null;

    const cleanLine = getCleanLineNumber(bus.ROUTE_CODE);
    const [operator, internal] = getVehicleInfo(bus.BUS_ID);
    const status = getBusStatus(bus.LAST_GPS_TIME);

    return (
        <DriftMarker
            position={[lat, lon]}
            duration={4000} 
            icon={createBusIconWithSignal(cleanLine, status)}>
            <Popup><b>Linija: {cleanLine}</b> ({bus.ROUTE_CODE})<br /><b>Vozilo:</b> {bus.BUS_ID}<br />{operator} #{internal}<br /><b>Status:</b> {status.label} ({timeAgo})<br />{isBusInDepot(bus) && <span className="text-red-500 font-bold">U depou</span>}</Popup>
        </DriftMarker>
    );
};

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { if (center) { map.flyTo(center, zoom); } }, [center, zoom, map]);
    return null;
};

const MapEvents = ({ setZoomLevel }) => {
    const map = useMap();
    useEffect(() => {
        const onZoomEnd = () => setZoomLevel(map.getZoom());
        map.on('zoomend', onZoomEnd);
        return () => map.off('zoomend', onZoomEnd);
    }, [map, setZoomLevel]);
    return null;
};

const MapaComponent = ({ stanice, buses, mapCenter, mapZoom, selectedRoute, onStationClick }) => {
    const [zoomLevel, setZoomLevel] = useState(mapZoom);

    const visibleStops = useMemo(() => {
        if (selectedRoute) return stanice.filter(s => selectedRoute.stopIds.has(s.STOP_ID));
        if (zoomLevel > 14) return stanice;
        return [];
    }, [selectedRoute, zoomLevel, stanice]);

    const visibleBuses = useMemo(() => {
        if (selectedRoute) {
            return buses.filter(bus => bus.ROUTE_CODE === selectedRoute.routeCode);
        }
        return buses;
    }, [buses, selectedRoute]);

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <MapEvents setZoomLevel={setZoomLevel} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            {selectedRoute && (
                <>
                    <Polyline pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }} positions={selectedRoute.smerA} />
                    <Polyline pathOptions={{ color: 'red', weight: 5, opacity: 0.7 }} positions={selectedRoute.smerB} />
                </>
            )}

            <LayersControl position="topright">
                <LayersControl.Overlay checked name="Stajališta">
                    <LayerGroup>
                        {visibleStops.filter(s => s.LATITUDE && s.LONGITUDE).map(stanica => (
                            <CircleMarker key={`stanica-${stanica.STOP_ID}`} center={[parseFloat(stanica.LATITUDE), parseFloat(stanica.LONGITUDE)]} radius={5} pathOptions={{ color: '#007bff', fillColor: '#007bff', fillOpacity: 0.7 }} eventHandlers={{ click: () => onStationClick(stanica) }}>
                                <Popup><b>Stanica:</b> {stanica.NAME} <br /><b>ID:</b> {stanica.STOP_ID}</Popup>
                            </CircleMarker>
                        ))}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Aktivni autobusi (< 1h)">
                    <LayerGroup>
                        {visibleBuses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type === 'Aktivan').map(bus => <BusMarker key={`bus-${bus.BUS_ID}`} bus={bus} />)}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Neaktivni autobusi (> 1h)">
                    <LayerGroup>
                        {visibleBuses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type !== 'Aktivan').map(bus => <BusMarker key={`bus-${bus.BUS_ID}`} bus={bus} />)}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    );
};

const SearchComponent = ({ stanice, linije, buses, onResultSelect, searchTerm, setSearchTerm }) => {
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

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setShowAllBuses(false); // Reset when search term changes

        if (newSearchTerm.trim() === '') {
            setResults([]);
            onResultSelect(null);
            return;
        }

        const lowerCaseSearchTerm = newSearchTerm.toLowerCase();
        const latinSearchTerm = toLatin(lowerCaseSearchTerm);
        
        let foundResults = [];

        // 1. Exact match for Bus ID (garage number)
        const exactBusMatch = buses
            .filter(bus => !isBusInDepot(bus) && String(bus.BUS_ID) === newSearchTerm)
            .map(bus => {
                const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
                return { ...bus, type: 'bus', internalId, operator, score: 4 }; // Highest score
            });
        foundResults.push(...exactBusMatch);

        // 2. Exact match for Line Display Code
        const exactLineMatch = uniqueLinije
            .filter(l => l.routeDisplayCode.toLowerCase() === lowerCaseSearchTerm)
            .map(l => ({ ...l, type: 'linija', score: 3 }));
        foundResults.push(...exactLineMatch);

        // 3. Exact match for Station Name
        const exactStationMatch = stanice
            .filter(s => toLatin(s.NAME.toLowerCase()) === latinSearchTerm)
            .map(s => ({ ...s, type: 'stanica', score: 3 }));
        foundResults.push(...exactStationMatch);

        // 4. Partial match for Bus ID (garage number)
        const partialBusMatches = buses
            .filter(bus => 
                !isBusInDepot(bus) &&
                String(bus.BUS_ID).includes(newSearchTerm) &&
                !foundResults.some(r => r.type === 'bus' && r.BUS_ID === bus.BUS_ID) // Avoid duplicates
            )
            .map(bus => {
                const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
                return { ...bus, type: 'bus', internalId, operator, score: 2 };
            });
        foundResults.push(...partialBusMatches);

        // 5. Partial match for Line Display Code or Route Name
        const partialLineMatches = uniqueLinije
            .filter(l => 
                (l.routeDisplayCode.toLowerCase().includes(lowerCaseSearchTerm) || 
                 toLatin(l.routeName.toLowerCase()).includes(latinSearchTerm)) &&
                 !foundResults.some(r => r.type === 'linija' && r.routeCode === l.routeCode)
            )
            .map(l => ({ ...l, type: 'linija', score: 1 }));
        foundResults.push(...partialLineMatches);

        // 6. Partial match for Station Name or ID
        const partialStationMatches = stanice
            .filter(s => 
                (toLatin(s.NAME.toLowerCase()).includes(latinSearchTerm) || s.STOP_ID.includes(newSearchTerm)) &&
                !foundResults.some(r => r.type === 'stanica' && r.STOP_ID === s.STOP_ID)
            )
            .map(s => ({ ...s, type: 'stanica', score: 1 }));
        foundResults.push(...partialStationMatches);

        // Sort results: highest score first, then by type (bus, line, station), then alphabetically/numerically
        foundResults.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score; // Higher score first
            
            // Then by type preference (bus, linija, stanica)
            const typeOrder = { 'bus': 3, 'linija': 2, 'stanica': 1 };
            if (typeOrder[a.type] !== typeOrder[b.type]) return typeOrder[b.type] - typeOrder[a.type];

            // Finally, by display name
            let nameA, nameB;
            if (a.type === 'bus') nameA = a.internalId;
            else if (a.type === 'linija') nameA = a.routeDisplayCode;
            else if (a.type === 'stanica') nameA = a.NAME;

            if (b.type === 'bus') nameB = b.internalId;
            else if (b.type === 'linija') nameB = b.routeDisplayCode;
            else if (b.type === 'stanica') nameB = b.NAME;

            return String(nameA).localeCompare(String(nameB), undefined, { numeric: true });
        });

        setResults(foundResults);
    };

    const handleResultClick = (result) => {
        onResultSelect(result);
        let displayValue = '';
        if (result.type === 'stanica') displayValue = result.NAME;
        else if (result.type === 'linija') displayValue = `Linija: ${result.routeDisplayCode}`;
        else if (result.type === 'bus') displayValue = `#${result.internalId} ${result.operator}`;
        setSearchTerm(displayValue);
        setResults([]);
        setShowAllBuses(false);
        searchInputRef.current?.blur(); // Close keyboard on mobile
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setResults([]);
        onResultSelect(null);
        setShowAllBuses(false);
    };

    const busResults = results.filter(item => item.type === 'bus');
    const lineResults = results.filter(item => item.type === 'linija');
    const stationResults = results.filter(item => item.type === 'stanica');

    const displayedBusResults = showAllBuses ? busResults : busResults.slice(0, 3);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-11/12 md:w-1/3">
            <div className="relative">
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Pronađi stajalište, liniju ili vozilo..." 
                    className="w-full p-3 pr-10 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                />
                {searchTerm && (<button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">&#x2715;</button>)}
            </div>
            {results.length > 0 && (
                <ul className="bg-white border rounded-lg mt-2 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                    {displayedBusResults.map(item => (
                        <li key={`bus-${item.BUS_ID}`} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">
                                🚌 #{item.internalId} <span className="font-normal text-gray-600">{item.operator}</span>
                            </p>
                        </li>
                    ))}
                    {busResults.length > 3 && !showAllBuses && (
                        <li className="p-3 text-center text-blue-600 cursor-pointer hover:bg-gray-100 border-t" onClick={() => setShowAllBuses(true)}>
                            Prikaži još autobusa ({busResults.length - 3})
                        </li>
                    )}
                    {lineResults.map(item => (
                         <li key={item.routeCode} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">Linija: {item.routeDisplayCode}</p>
                            <p className="text-sm text-gray-500">{item.routeName.replace(/ - /g, ' ↔ ')}</p>
                        </li>
                    ))}
                    {stationResults.map(item => (
                        <li key={item.STOP_ID} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <div><p className="font-semibold text-gray-800">{item.NAME}</p><p className="text-sm text-gray-500">Stajalište (ID: {item.STOP_ID})</p></div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- KOMPLETNO REFAKTORISAN PANEL SA HIBRIDNOM ETA LOGIKOM ---
const StationDetailsPanel = ({ station, linije, redVoznje, etaData, buses, onClose }) => {
    // 1. Priprema podataka o linijama koje staju na stanici (za gornji info deo)
    const enrichedRelevantLinije = useMemo(() => {
        if (!station) return [];
        const seen = new Set();
        return linije.filter(l => {
            if (l.stopId === station.STOP_ID && !seen.has(l.routeDisplayCode)) {
                seen.add(l.routeDisplayCode);
                return true;
            }
            return false;
        }).map(l => {
            const scheduleInfo = redVoznje.find(rv => rv.kod_linije === l.routeCode);
            const finalRouteName = scheduleInfo ? scheduleInfo.naziv_linije.replace(/ - /g, ' ↔ ') : l.routeName.replace(/ - /g, ' ↔ ');
            return { ...l, finalRouteName };
        }).sort((a, b) => a.routeDisplayCode.localeCompare(b.routeDisplayCode, undefined, { numeric: true }));
    }, [station, linije, redVoznje]);
  
    // Grupisanje linija za expandable UI
    const groupedLinije = useMemo(() => {
        if (!station) return {};
        const groups = {};
        enrichedRelevantLinije.forEach(linija => {
            const baseNumber = linija.routeDisplayCode.split('/')[0];
            if (!groups[baseNumber]) groups[baseNumber] = [];
            groups[baseNumber].push(linija);
        });
        return groups;
    }, [station, enrichedRelevantLinije]);
    
    // --- NOVA, UNAPREĐENA LOGIKA ZA KOMBINOVANJE REDA VOŽNJE I LIVE ETA PODATAKA ---
    const combinedArrivals = useMemo(() => {
      if (!station || !etaData?._embedded?.routes || !buses.length) return [];
  
      const now = new Date();
      const jsDay = now.getDay();
      const danTip = jsDay === 0 ? 7 : (jsDay === 6 ? 6 : 0);
      const normalizeName = (str) => toLatin(str).replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  
      // 1. Generišemo sve planirane (statičke) dolaske za danas
      let scheduledArrivals = [];
      etaData._embedded.routes.forEach(route => {
          ['directionA', 'directionB'].forEach(directionKey => {
              const direction = route[directionKey];
              if (!direction?.stops) return;
  
              const routeLineInfo = linije.find(l => normalizeName(l.routeName) === normalizeName(route.name) && 
                                                ((directionKey === 'directionA' && l.routeHalfProgressType === '0') || 
                                                 (directionKey === 'directionB' && l.routeHalfProgressType === '1')));
              if (!routeLineInfo) return;
  
              const targetStopData = direction.stops.find(s => s.stanceIndex === station.STOP_ID);
              if (!targetStopData) return;
  
              const travelTimeBeforeStation = direction.stops
                  .filter(s => s.ordinal < targetStopData.ordinal)
                  .reduce((sum, current) => sum + current.duration, 0);
              
              const scheduledDeparturesForToday = direction.departures.filter(dep => dep.day === danTip);
              scheduledDeparturesForToday.forEach(dep => {
                  const scheduledDepartureDate = parseBusTime(dep.time);
                  const predictedArrivalDate = new Date(scheduledDepartureDate.getTime() + travelTimeBeforeStation * 60 * 1000);
  
                  if (predictedArrivalDate > now) {
                      scheduledArrivals.push({
                          type: 'scheduled',
                          lineDisplayCode: routeLineInfo.routeDisplayCode,
                          routeCode: routeLineInfo.routeCode,
                          destination: direction.endPoint,
                          scheduledArrivalTime: `${predictedArrivalDate.getHours().toString().padStart(2, '0')}:${predictedArrivalDate.getMinutes().toString().padStart(2, '0')}`,
                          predictedArrivalTimeDate: predictedArrivalDate
                      });
                  }
              });
          });
      });
  
      // 2. Priprema za obradu aktivnih autobusa
      const activeBuses = buses.filter(bus => getBusStatus(bus.LAST_GPS_TIME).type === 'Aktivan' && !isBusInDepot(bus));
      const liveArrivals = [];
      const matchedSchedules = new Set(); // Čuva ključeve spojenih polazaka (npr. '601-14:30')
  
      // 3. Obrada svakog aktivnog autobusa
      activeBuses.forEach(bus => {
          const busLat = parseFloat(bus.LATITUDE.replace(',', '.'));
          const busLon = parseFloat(bus.LONGITUDE.replace(',', '.'));
          if (isNaN(busLat) || isNaN(busLon)) return;
  
          const busPoint = turf.point([busLon, busLat]);
          const relevantLinije = linije.filter(l => l.routeCode === bus.ROUTE_CODE);
          if (relevantLinije.length === 0) return;
  
          let busCurrentDirection = null;
          let closestPointOnLine = null;
  
          for (let directionType of ['0', '1']) {
              const polylineStops = relevantLinije.filter(l => l.routeHalfProgressType === directionType).sort((a,b) => parseInt(a.seqNo, 10) - parseInt(b.seqNo, 10)).map(s => [parseFloat(s.longitude), parseFloat(s.latitude)]);
              if(polylineStops.length < 2) continue;
              const polyline = turf.lineString(polylineStops);
              const snappedBus = turf.nearestPointOnLine(polyline, busPoint);
              if (turf.pointToLineDistance(busPoint, polyline, {units: 'meters'}) > 100) continue;
              if (!closestPointOnLine || snappedBus.properties.dist < closestPointOnLine.properties.dist) {
                  closestPointOnLine = snappedBus;
                  busCurrentDirection = directionType;
              }
          }
          if (!busCurrentDirection || !closestPointOnLine) return;
  
          const currentRouteDirectionStops = relevantLinije.filter(l => l.routeHalfProgressType === busCurrentDirection).sort((a,b) => parseInt(a.seqNo, 10) - parseInt(b.seqNo, 10));
          if (currentRouteDirectionStops.length < 2) return;

          const stationIndexOnLine = currentRouteDirectionStops.findIndex(s => s.stopId === station.STOP_ID);
          if (stationIndexOnLine === -1) return;

          let lastPassedStopIndex = -1;
          let minDistanceToSegment = Infinity;
          
          for (let i = 0; i < currentRouteDirectionStops.length - 1; i++) {
              const startStop = currentRouteDirectionStops[i];
              const endStop = currentRouteDirectionStops[i + 1];
              const lineSegment = turf.lineString([
                  [parseFloat(startStop.longitude), parseFloat(startStop.latitude)],
                  [parseFloat(endStop.longitude), parseFloat(endStop.latitude)]
              ]);
              const distance = turf.pointToLineDistance(busPoint, lineSegment, { units: 'meters' });
              
              if (distance < minDistanceToSegment) {
                  minDistanceToSegment = distance;
                  lastPassedStopIndex = i;
              }
          }

          if (minDistanceToSegment > 200) return;
          if (stationIndexOnLine <= lastPassedStopIndex) return;

          const lastStopOfRoute = currentRouteDirectionStops[currentRouteDirectionStops.length - 1];
          const distanceToLastStop = turf.distance(busPoint, turf.point([parseFloat(lastStopOfRoute.longitude), parseFloat(lastStopOfRoute.latitude)]), { units: 'meters' });
          if (distanceToLastStop < 100) return;

          const pathPoints = [
              [busLon, busLat],
              ...currentRouteDirectionStops
                  .slice(lastPassedStopIndex + 1, stationIndexOnLine + 1)
                  .map(s => [parseFloat(s.longitude), parseFloat(s.latitude)])
          ];
          const remainingPath = turf.lineString(pathPoints);
          const distanceKm = turf.length(remainingPath, { units: 'kilometers' });
          
          const averageSpeedKmh = 22;
          let etaMinutes = Math.round((distanceKm / averageSpeedKmh) * 60);
          
          const liveDate = new Date(now.getTime() + etaMinutes * 60 * 1000);
          
          const busLineInfo = linije.find(l => l.routeCode === bus.ROUTE_CODE);
          let busDestination = 'Nepoznat smer';
          if (busLineInfo) {
              const routeInEta = etaData._embedded.routes.find(r => normalizeName(r.name) === normalizeName(busLineInfo.routeName));
              if (routeInEta) {
                  const directionKey = busCurrentDirection === '0' ? 'directionA' : 'directionB';
                  busDestination = routeInEta[directionKey]?.endPoint || 'Nepoznat smer';
              }
          }
  
          let bestMatch = null;
          let minDiff = Infinity;
  
          scheduledArrivals.forEach(sched => {
              const scheduleKey = `${sched.routeCode}-${sched.scheduledArrivalTime}`;
              if (sched.routeCode === bus.ROUTE_CODE && sched.destination === busDestination && !matchedSchedules.has(scheduleKey)) {
                  const diff = Math.abs(liveDate - sched.predictedArrivalTimeDate);
                  if (diff < minDiff) {
                      minDiff = diff;
                      bestMatch = sched;
                  }
              }
          });
  
          const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
  
          if (bestMatch && minDiff < 20 * 60 * 1000) {
              const scheduleKey = `${bestMatch.routeCode}-${bestMatch.scheduledArrivalTime}`;
              
              const scheduledArrivalDate = bestMatch.predictedArrivalTimeDate;
              const stopsRemaining = stationIndexOnLine - lastPassedStopIndex;
              const blendingFactor = Math.max(0, 1 - ((stopsRemaining - 1) / 10));
              const predictedDelayMs = liveDate.getTime() - scheduledArrivalDate.getTime();
              const blendedDelayMs = predictedDelayMs * blendingFactor;
              const finalPredictedArrivalDate = new Date(scheduledArrivalDate.getTime() + blendedDelayMs);
              const finalEtaMinutes = Math.max(1, Math.round((finalPredictedArrivalDate.getTime() - now.getTime()) / 60000));
              const finalDelayMinutes = Math.round((finalPredictedArrivalDate.getTime() - scheduledArrivalDate.getTime()) / 60000);
              const status = finalDelayMinutes > 2 ? `Kasni ~${finalDelayMinutes} min` :
                             finalDelayMinutes < -2 ? `Ranije ~${Math.abs(finalDelayMinutes)} min` : `Na vreme`;
              
              const newLiveArrival = {
                  type: 'live-matched',
                  lineDisplayCode: bestMatch.lineDisplayCode,
                  routeCode: bestMatch.routeCode,
                  destination: bestMatch.destination,
                  scheduledArrivalTime: bestMatch.scheduledArrivalTime,
                  predictedArrivalTimeDate: finalPredictedArrivalDate,
                  live: { eta: finalEtaMinutes, vehicleId: internalId, status: status }
              };

              const existingLiveMatchIndex = liveArrivals.findIndex(a => a.type === 'live-matched' && a.routeCode === bestMatch.routeCode && a.scheduledArrivalTime === bestMatch.scheduledArrivalTime);

              if (existingLiveMatchIndex > -1) {
                  if (newLiveArrival.live.eta < liveArrivals[existingLiveMatchIndex].live.eta) {
                      liveArrivals[existingLiveMatchIndex] = newLiveArrival;
                  }
              } else {
                  liveArrivals.push(newLiveArrival);
              }
              matchedSchedules.add(scheduleKey);

          } else { 
              liveArrivals.push({
                  type: 'live-only',
                  lineDisplayCode: getCleanLineNumber(bus.ROUTE_CODE),
                  routeCode: bus.ROUTE_CODE,
                  destination: busDestination,
                  scheduledArrivalTime: null,
                  predictedArrivalTimeDate: liveDate,
                  live: { eta: etaMinutes < 1 ? 1 : etaMinutes, vehicleId: internalId, status: 'Uživo' }
              });
          }
      });
  
      const remainingScheduled = scheduledArrivals.filter(sched => {
          const scheduleKey = `${sched.routeCode}-${sched.scheduledArrivalTime}`;
          return !matchedSchedules.has(scheduleKey);
      });
  
      return [...liveArrivals, ...remainingScheduled].sort((a, b) => a.predictedArrivalTimeDate - b.predictedArrivalTimeDate);
  
    }, [station, buses, linije, etaData, redVoznje]);
    
    const getStatusColorClass = (status) => {
        if (status.startsWith('Kasni')) return 'text-orange-600 font-semibold';
        if (status.startsWith('Ranije')) return 'text-red-600 font-semibold';
        if (status.startsWith('Na vreme')) return 'text-green-600 font-semibold';
        return 'text-gray-700';
    };
  
    if (!station) return null;

    return (
        <div className="absolute top-0 left-0 h-full w-full md:w-1/3 lg:w-1/4 bg-white/90 backdrop-blur-sm shadow-lg z-[1001] p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{station.NAME}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto">
                 <h3 className="font-semibold mb-2">Linije koje staju ovde</h3>
                <ul className="space-y-2 mt-2">
                    {Object.entries(groupedLinije).map(([base, subLinije]) => (
                        <li key={`station-line-group-${base}`}>
                            {subLinije.length > 1 ? (
                                <details>
                                    <summary className="p-2 bg-gray-100 rounded-md font-bold text-blue-600 cursor-pointer">
                                        Linija {base}
                                    </summary>
                                    <ul className="pl-4 mt-1 space-y-1">
                                        {subLinije.map(l => (
                                            <li key={l.routeCode} className="p-1 rounded-md hover:bg-gray-200">
                                                <span className="font-semibold text-gray-800">Linija {l.routeDisplayCode}:</span>
                                                <p className="text-sm text-gray-600 pl-2">{l.finalRouteName}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            ) : (
                                <div className="p-2 bg-gray-100 rounded-md">
                                    <span className="font-bold text-blue-600">Linija {subLinije[0].routeDisplayCode}:</span> {subLinije[0].finalRouteName}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
  
                <h3 className="font-semibold mt-4 mb-2">Sledeći dolasci:</h3>
                {combinedArrivals.length > 0 ? (
                    <ul className="space-y-2">
                        {combinedArrivals.slice(0, 10).map((arrival, index) => (
                            <li key={index} className={`p-2 rounded-md ${arrival.live ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-100'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-gray-800">Linija {arrival.lineDisplayCode}</span>
                                        <p className="text-sm text-gray-600 truncate">smer: {arrival.destination}</p>
                                    </div>
                                    <div className="text-right">
                                        {arrival.live ? (
                                            <>
                                                <span className="font-bold text-blue-600 text-lg">~ {arrival.live.eta} min</span>
                                                {arrival.scheduledArrivalTime && (
                                                  <p className="text-sm text-gray-500 line-through">{arrival.scheduledArrivalTime}</p>
                                                )}
                                                {arrival.live.status && arrival.live.status !== 'Uživo' && (
                                                    <p className={`text-xs ${getStatusColorClass(arrival.live.status)}`}>{arrival.live.status}</p>
                                                )}
                                            </>
                                        ) : (
                                            <span className="font-bold text-gray-800 text-lg">{arrival.scheduledArrivalTime}</span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">Nema planiranih dolazaka za danas ili aktivnih autobusa.</p>
                )}
            </div>
        </div>
    );
  };

const LineDetailsPanel = ({ line, onClose }) => {
    const [sledeciPolasci, setSledeciPolasci] = useState([]);

    useEffect(() => {
        if (!line) return;
        const danUNedelji = new Date().getDay();
        const scheduleType = (danUNedelji === 0) ? '7' : (danUNedelji === 6) ? '6' : '5';
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const polasci = redVoznjeData
            .filter(p => p.kod_linije === line.routeCode && p.SCHEDULE_TYPE === scheduleType)
            .filter(p => p.vreme > currentTime)
            .sort((a, b) => a.vreme.localeCompare(b.vreme))
            .slice(0, 5);
        setSledeciPolasci(polasci);
    }, [line]);

    if (!line) return null;

    return (
        <div className="absolute top-0 left-0 h-full w-full md:w-1/3 lg:w-1/4 bg-white/90 backdrop-blur-sm shadow-lg z-[1001] p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Linija {line.routeDisplayCode}</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button></div>
            <p className="text-sm text-gray-600 mb-4">{line.routeName.replace(/ - /g, ' ↔ ')}</p>
            <div className="flex-grow overflow-y-auto"><h3 className="font-semibold mb-2">Sledeći polasci (danas):</h3>
                {sledeciPolasci.length > 0 ? (<ul className="space-y-2">{sledeciPolasci.map((p, index) => (<li key={index} className="p-2 bg-gray-100 rounded-md"><span className="font-bold text-blue-600">{p.vreme}</span><span className="text-sm text-gray-500 ml-2">(Smer: {p.smer.replace('Смер ', '')})</span></li>))}</ul>) : (<p className="text-gray-500">Nema više polazaka za danas.</p>)}
            </div>
        </div>
    );
};


// --- Glavna App komponenta ---
export default function App() {
    const [buses, setBuses] = useState([]);
    const [mapCenter, setMapCenter] = useState([44.0141, 20.9116]);
    const [mapZoom, setMapZoom] = useState(13);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const API_URL = '/bus-data/location-tracking';
        const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfdHlwZSI6IkVLR19NT0JJTEVfQVBQIiwiaWF0IjoxNzQ0ODAwOTc0fQ.Ni2RKLQSSd2u1CBQv4yn2pNMXgRKJUmpMWR4qRSEQzw';
        const DEVICE_ID = 'b3f97b2f-473a-42ee-bef8-612f9112e562';
        const headers = { 'Authorization': AUTH_TOKEN, 'X-Device-Id': DEVICE_ID };

        const fetchBusData = async () => {
            try {
                const response = await fetch(API_URL, { headers });
                if (!response.ok) throw new Error(`HTTP greška- Status: ${response.status}`);
                const apiData = await response.json();
                const nestedData = JSON.parse(apiData.data);
                setBuses(nestedData.ROOT.BUSES.BUS || []);
            } catch (error) { console.error("Greška pri preuzimanju lokacija autobusa-", error); }
        };
        fetchBusData();
        const intervalId = setInterval(fetchBusData, 5000); 
        return () => clearInterval(intervalId);
    }, []);

    const handleResultSelect = async (result) => {
      if (!result) {
          setSelectedRoute(null);
          setSelectedStation(null);
          setSelectedLine(null);
          return;
      }
      if (result.type === 'stanica') {
          const lat = parseFloat(result.LATITUDE);
          const lon = parseFloat(result.LONGITUDE);
          if (!isNaN(lat) && !isNaN(lon)) {
              setMapCenter([lat, lon]);
              setMapZoom(17);
              setSelectedRoute(null);
              setSelectedStation(result);
              setSelectedLine(null);
          }
      } else if (result.type === 'linija') {
          const routeStops = linijeData.filter(stop => stop.routeCode === result.routeCode);
  
          // Funkcija za pozivanje OSRM-a
          const getRoutePolyline = async (stops) => {
              if (stops.length < 2) return [];
              
              // Formatiramo koordinate za OSRM API (longitude,latitude)
              const coordsString = stops.map(s => `${s.longitude},${s.latitude}`).join(';');
              const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=polyline`;
              
              try {
                  const response = await fetch(url);
                  const data = await response.json();
                  if (data.code === 'Ok' && data.routes.length > 0) {
                      // Dekodiramo dobijenu geometriju i vraćamo niz [lat, lon]
                      const decoded = polylineUtil.decode(data.routes[0].geometry);
                      return decoded.map(p => [p[0], p[1]]); // Vraća [lat, lon] niz
                  }
              } catch (error) {
                  console.error("Greška pri preuzimanju putanje sa OSRM-", error);
              }
              // Fallback - ako OSRM pukne, vrati samo prave linije između stanica
              return stops.map(s => [parseFloat(s.latitude), parseFloat(s.longitude)]);
          };
  
          // Dobijamo stanice za svaki smer
          const stopsA = routeStops.filter(stop => stop.routeHalfProgressType === '0').sort((a, b) => parseInt(a.seqNo) - parseInt(b.seqNo));
          const stopsB = routeStops.filter(stop => stop.routeHalfProgressType === '1').sort((a, b) => parseInt(a.seqNo) - parseInt(b.seqNo));
  
          // Pozivamo OSRM za oba smera i čekamo detaljne putanje
          const [smerA_detailed, smerB_detailed] = await Promise.all([
              getRoutePolyline(stopsA),
              getRoutePolyline(stopsB)
          ]);
  
          const stopIds = new Set(routeStops.map(s => s.stopId));
  
          // Čuvamo detaljne putanje u state
          setSelectedRoute({ 
              ...result, 
              smerA: smerA_detailed, 
              smerB: smerB_detailed, 
              stopIds 
          });
          
          setSelectedStation(null);
          setSelectedLine(result);
          setMapCenter([44.0141, 20.9116]);
          setMapZoom(13);
  
      } else if (result.type === 'bus') {
          const lat = parseFloat(result.LATITUDE.replace(',', '.'));
          const lon = parseFloat(result.LONGITUDE.replace(',', '.'));
          if (!isNaN(lat) && !isNaN(lon)) {
              setMapCenter([lat, lon]);
              setMapZoom(18);
              setSelectedRoute(null);
              setSelectedStation(null);
              setSelectedLine(null);
          }
      }
  };

    return (
        <>
            <style>{busIconStyles}</style>
            <div className="h-screen w-screen relative">
                <header className="absolute top-0 left-0 p-4 z-[1000]">
                    <h1 className="text-2xl font-bold text-gray-800 bg-white/80 p-2 rounded-md shadow-lg">KG Bus</h1>
                </header>
                
                <SearchComponent 
                    stanice={staniceData} 
                    linije={linijeData} 
                    buses={buses}
                    onResultSelect={handleResultSelect} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />
                
                <StationDetailsPanel 
                    station={selectedStation} 
                    linije={linijeData} 
                    redVoznje={redVoznjeData}
                    etaData={etaData}
                    buses={buses}
                    onClose={() => setSelectedStation(null)} 
                />

                <LineDetailsPanel line={selectedLine} onClose={() => { setSelectedLine(null); setSelectedRoute(null); setSearchTerm(''); }} />
                <MapaComponent stanice={staniceData} buses={buses} mapCenter={mapCenter} mapZoom={mapZoom} selectedRoute={selectedRoute} onStationClick={setSelectedStation} />
            </div>
        </>
    );
}
