import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet';
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

const createBusIconWithSignal = (line_number, status) => {
    const barOpacities = { 3: [1, 1, 1], 2: [0.3, 1, 1], 1: [0.3, 0.3, 1], 0: [0.3, 0.3, 0.3] };
    const opacities = barOpacities[status.bars] || barOpacities[0];
    return L.divIcon({
        html: `<div class="bus-icon-wrapper"><div class="bus-icon-main" style="background-color: ${status.mainColor};"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="bus-icon-svg"><path d="M18.5,3H5.5C4.67,3,4,3.67,4,4.5v12C4,17.33,4.67,18,5.5,18H6v2h2v-2h8v2h2v-2h0.5c0.83,0,1.5-0.67,1.5-1.5v-12 C20,3.67,19.33,3,18.5,3z M7,15c-0.83,0-1.5-0.67-1.5-1.5S6.17,12,7,12s1.5,0.67,1.5,1.5S7.83,15,7,15z M17,15 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S17.83,15,17,15z M18,10H6V5h12V10z"/></svg><div class="bus-icon-line-text">${line_number}</div></div><div class="signal-badge"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1,9 A8,8 0 0 1 9,1" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[0]}"/><path d="M4,9 A4,4 0 0 1 9,4" stroke="${status.signalColor}" stroke-width="2" stroke-linecap="round" style="opacity: ${opacities[1]}"/><circle cx="9" cy="9" r="1.5" fill="${status.signalColor}" style="opacity: ${opacities[2]}"/></svg></div></div>`,
        className: 'custom-bus-icon-wrapper',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const busIconStyles = `.custom-bus-icon-wrapper { background: transparent; border: none; }.bus-icon-wrapper { position: relative; width: 40px; height: 40px; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.4)); }.bus-icon-main { position: relative; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, background-color 0.5s ease; }.bus-icon-wrapper:hover .bus-icon-main { transform: scale(1.1); }.bus-icon-svg { width: 18px; height: 18px; color: white; }.bus-icon-line-text { position: absolute; bottom: -1px; color: white; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 1px #000; }.signal-badge { position: absolute; top: -2px; left: -2px; width: 16px; height: 16px; background-color: white; border-radius: 50%; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; }`;

// --- Components ---
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
        <DriftMarker position={[lat, lon]} duration={4000} icon={createBusIconWithSignal(cleanLine, status)}>
            <Popup><b>Linija: {cleanLine}</b> ({bus.ROUTE_CODE})<br /><b>Vozilo:</b> {bus.BUS_ID}<br />{operator} #{internal}<br /><b>Status:</b> {status.label} ({timeAgo})<br />{isBusInDepot(bus) && <span className="text-red-500 font-bold">U depou</span>}</Popup>
        </DriftMarker>
    );
};

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { if (center) { map.flyTo(center, zoom); } }, [center, zoom, map]);
    return null;
};

const MapaComponent = ({ buses, mapCenter, mapZoom }) => {
    const visibleBuses = useMemo(() => buses, [buses]);

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <LayersControl position="topright">
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

    const handleSearchChange = (e) => {
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

        const exactBusMatch = buses.filter(bus => !isBusInDepot(bus) && String(bus.BUS_ID) === newSearchTerm).map(bus => {
            const [operator, internalId] = getVehicleInfo(bus.BUS_ID);
            return { ...bus, type: 'bus', internalId, operator, score: 4 };
        });
        foundResults.push(...exactBusMatch);

        const exactLineMatch = uniqueLinije.filter(l => l.routeDisplayCode.toLowerCase() === lowerCaseSearchTerm).map(l => ({ ...l, type: 'linija', score: 3 }));
        foundResults.push(...exactLineMatch);

        const partialBusMatches = buses.filter(bus => !isBusInDepot(bus) && String(bus.BUS_ID).includes(newSearchTerm) && !foundResults.some(r => r.type === 'bus' && r.BUS_ID === bus.BUS_ID)).map(bus => {
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
    };

    const handleResultClick = (result) => {
        onResultSelect(result);
        let displayValue = result.type === 'linija' ? `Linija: ${result.routeDisplayCode}` : `#${result.internalId} ${result.operator}`;
        setSearchTerm(displayValue);
        setResults([]);
        setShowAllBuses(false);
        searchInputRef.current?.blur();
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setResults([]);
        onResultSelect(null);
        setShowAllBuses(false);
    };

    const busResults = results.filter(item => item.type === 'bus');
    const lineResults = results.filter(item => item.type === 'linija');
    const displayedBusResults = showAllBuses ? busResults : busResults.slice(0, 3);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-11/12 md:w-1/3">
            <div className="relative">
                <input ref={searchInputRef} type="text" placeholder="Pronađi liniju ili vozilo..." className="w-full p-3 pr-10 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={handleSearchChange} />
                {searchTerm && (<button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">&#x2715;</button>)}
            </div>
            {results.length > 0 && (
                <ul className="bg-white border rounded-lg mt-2 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                    {displayedBusResults.map(item => (
                        <li key={`bus-${item.BUS_ID}`} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">🚌 #{item.internalId} <span className="font-normal text-gray-600">{item.operator}</span></p>
                        </li>
                    ))}
                    {busResults.length > 3 && !showAllBuses && (
                        <li className="p-3 text-center text-blue-600 cursor-pointer hover:bg-gray-100 border-t" onClick={() => setShowAllBuses(true)}>Prikaži još autobusa ({busResults.length - 3})</li>
                    )}
                    {lineResults.map(item => (
                        <li key={item.routeCode} className="p-3 hover:bg-gray-100 cursor-pointer border-t" onClick={() => handleResultClick(item)}>
                            <p className="font-semibold text-gray-800">Linija: {item.routeDisplayCode}</p>
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch('https://kg-mobile-api.busplus.rs/bus-data/location-tracking', {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfdHlwZSI6IkVLR19NT0JJTEVfQVBQIiwiaWF0IjoxNzQ0ODAwOTc0fQ.Ni2RKLQSSd2u1CBQv4yn2pNMXgRKJUmpMWR4qRSEQzw'
                    }
                });
                const data = await response.json();
                setBuses(data);
            } catch (error) {
                console.error('Error fetching buses:', error);
            }
        };
        fetchBuses();
        const interval = setInterval(fetchBuses, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleResultSelect = (result) => {
        if (!result) return;
        if (result.type === 'bus') {
            const lat = parseFloat(result.LATITUDE.replace(',', '.'));
            const lon = parseFloat(result.LONGITUDE.replace(',', '.'));
            if (!isNaN(lat) && !isNaN(lon)) {
                setMapCenter([lat, lon]);
                setMapZoom(16);
            }
        } else if (result.type === 'linija') {
            const firstStop = linije.find(l => l.routeCode === result.routeCode);
            if (firstStop) {
                setMapCenter([parseFloat(firstStop.latitude), parseFloat(firstStop.longitude)]);
                setMapZoom(14);
            }
        }
    };

    return (
        <div className="h-screen w-screen relative">
            <style>{busIconStyles}</style>
            <MapaComponent buses={buses} mapCenter={mapCenter} mapZoom={mapZoom} />
            <SearchComponent linije={linije} buses={buses} onResultSelect={handleResultSelect} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
    );
}

export default App;
