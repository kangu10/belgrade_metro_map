// Mapbox access token
const mapboxAccessToken = 'pk.eyJ1Ijoia2FuZ3UxMCIsImEiOiJjbHU1aTJ5NGcxcjgwMmtxczN5Z3U2dTVxIn0.V_bAup9EGYnSATEZMagAaA';

// Map configuration
const mapConfig = {
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [20.4612, 44.8125],
    zoom: 13
};

// Data sources
const dataSources = {
    // area5min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/iso_mic_plugin_OAS_with_population_5min.geojson',
    // area10min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/iso_mic_plugin_OAS_with_population_10min.geojson',
    // area15min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/iso_mic_plugin_OAS_with_population_15min.geojson',
    area5min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/generalized_5_min_iso.geojson',
    area10min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/generalized_10_min_iso.geojson',
    area15min: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/generalized_15_min_iso.geojson',
    metroLines: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/metro_lines_smooth.geojson',
    metroStations: 'https://raw.githubusercontent.com/kanguu10/belgrade_metro_map/main/metro_stations.geojson'
};

// Define your layers with their properties
const layers = [
    {
        id: 'stations',
        source: 'source5',
        type: 'circle',
        color: '#1E88E5',       // Bright blue for stations
        radius: 5,
        strokeColor: '#0D47A1', // Darker blue for station outline
        strokeWidth: 1.5,       // Width of the outline
        label: 'Metro stations'
    },
    {
        id: 'lines',
        source: 'source4',
        type: 'line',
        color: '#FF5722',       // Orange-red for metro lines
        width: 3,               // Slightly thicker lines
        label: 'Metro lines',
        hasCategories: true,
        categories: {
            '1': { color: '#FF0000', label: 'Line 1' }, // Red
            '2': { color: '#0000FF', label: 'Line 2' }, // Blue
            '3': { color: '#00AA00', label: 'Line 3' }  // Green
        }
    },
    {
        id: 'area15',
        source: 'source3',
        type: 'fill',
        color: '#9C27B0',       // Green for 5-minute area
        opacity: 0.5,
        label: '5 minutes accessibility area'
    },
    {
        id: 'area10',
        source: 'source2',
        type: 'fill',
        color: '#BA68C8',       // Lighter green for 10-minute area
        opacity: 0.5,
        label: '10 minutes accessibility area'
    },
    {
        id: 'area5',
        source: 'source1',
        type: 'fill',
        color: '#E1BEE7',       // Very light green for 15-minute area
        opacity: 0.5,
        label: '15 minutes accessibility area'
    }
];
