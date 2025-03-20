// Initialize the map
mapboxgl.accessToken = mapboxAccessToken;
const map = new mapboxgl.Map(mapConfig);

// Function to handle basemap changes
function handleBasemapChange() {
    const styleUrl = document.getElementById('basemap-select').value;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();
    const currentPitch = map.getPitch();
    const currentBearing = map.getBearing();
    
    // Store which layers are currently visible
    const layerVisibility = {};
    layers.forEach(layer => {
        layerVisibility[layer.id] = map.getLayoutProperty(layer.id, 'visibility') !== 'none';
    });
    
    // Change the map style
    map.setStyle(styleUrl);
    
    // When style is loaded, re-add sources and layers
    map.once('style.load', () => {
        // Restore map state
        map.setZoom(currentZoom);
        map.setCenter(currentCenter);
        map.setPitch(currentPitch);
        map.setBearing(currentBearing);
        
        // Reload all data sources and layers
        reloadMapData(layerVisibility);
    });
}

// Function to reload data after style change
function reloadMapData(layerVisibility = {}) {
    // Load all data first
    Promise.all([
        fetch(dataSources.isochrones).then(res => res.json()),
        fetch(dataSources.metroLines).then(res => res.json()),
        fetch(dataSources.metroStations).then(res => res.json())
    ])
    .then(([data1, data2, data3]) => {
        // Re-add sources
        map.addSource('source1', { type: 'geojson', data: data1 });
        map.addSource('source2', { type: 'geojson', data: data2 });
        map.addSource('source3', { type: 'geojson', data: data3 });
        
        // Re-add layers in specific order (bottom to top)
        map.addLayer({
            id: 'area5',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 15],
            paint: { 
                'fill-color': '#E1BEE7', 
                'fill-opacity': 0.4,
                'fill-outline-color': '#BA68C8'
            },
            layout: {
                visibility: layerVisibility['area5'] === false ? 'none' : 'visible'
            }
        });
        
        map.addLayer({
            id: 'area10',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 10],
            paint: { 
                'fill-color': '#BA68C8', 
                'fill-opacity': 0.25,
                'fill-outline-color': '#9C27B0'
            },
            layout: {
                visibility: layerVisibility['area10'] === false ? 'none' : 'visible'
            }
        });
        
        map.addLayer({
            id: 'area15',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 5],
            paint: { 
                'fill-color': '#9C27B0', 
                'fill-opacity': 0.3,
                'fill-outline-color': '#7B1FA2'
            },
            layout: {
                visibility: layerVisibility['area15'] === false ? 'none' : 'visible'
            }
        });
        
        map.addLayer({
            id: 'line-1',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '1'],
            paint: {
              'line-color': '#FF0000',
              'line-width': 3
            },
            layout: {
                visibility: layerVisibility['line-1'] === false ? 'none' : 'visible'
            }
        });
          
        map.addLayer({
            id: 'line-2',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '2'],
            paint: {
              'line-color': '#0000FF',
              'line-width': 3
            },
            layout: {
                visibility: layerVisibility['line-2'] === false ? 'none' : 'visible'
            }
        });
          
        map.addLayer({
            id: 'line-3',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '3'],
            paint: {
              'line-color': '#00AA00',
              'line-width': 3
            },
            layout: {
                visibility: layerVisibility['line-3'] === false ? 'none' : 'visible'
            }
        });
          
        map.addLayer({
            id: 'stations',
            type: 'circle',
            source: 'source3',
            paint: { 
                'circle-color': '#1E88E5',
                'circle-radius': 5,
                'circle-stroke-color': '#0D47A1',
                'circle-stroke-width': 1.5
            },
            layout: {
                visibility: layerVisibility['stations'] === false ? 'none' : 'visible'
            }
        });
        
        // Re-add click events for stations
        addStationInteractivity();
    })
    .catch(error => console.error('Error reloading data:', error));
}

// Function to add station interactivity
function addStationInteractivity() {
    // Add click event for metro stations
    map.on('click', 'stations', (e) => {
        // Get clicked feature
        const feature = e.features[0];
        const properties = feature.properties;
        
        // Create popup content
        let popupContent = '<div class="popup-content">';
        popupContent += '<table class="popup-table">';
        
        // Add each property to the table
        for (const [key, value] of Object.entries(properties)) {
            popupContent += `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`;
        }
        
        popupContent += '</table></div>';
        
        // Create a popup
        new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change cursor to pointer when hovering over stations
    map.on('mouseenter', 'stations', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back when leaving stations
    map.on('mouseleave', 'stations', () => {
        map.getCanvas().style.cursor = '';
    });
}

map.on('load', () => {
    // Set up basemap selector event listener
    document.getElementById('basemap-select').addEventListener('change', handleBasemapChange);
    
    // Initial data load
    Promise.all([
        fetch(dataSources.isochrones).then(res => res.json()),
        fetch(dataSources.metroLines).then(res => res.json()),
        fetch(dataSources.metroStations).then(res => res.json())
    ])
    .then(([data1, data2, data3]) => {
        // Add sources
        map.addSource('source1', { type: 'geojson', data: data1 });
        map.addSource('source2', { type: 'geojson', data: data2 });
        map.addSource('source3', { type: 'geojson', data: data3 });
        
        // Add layers in specific order (bottom to top)
        map.addLayer({
            id: 'area5',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 15],
            paint: { 
                'fill-color': '#E1BEE7', 
                'fill-opacity': 0.4,
                'fill-outline-color': '#BA68C8'
            }
        });
        
        map.addLayer({
            id: 'area10',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 10],
            paint: { 
                'fill-color': '#BA68C8', 
                'fill-opacity': 0.25,
                'fill-outline-color': '#9C27B0'
            }
        });
        
        map.addLayer({
            id: 'area15',
            type: 'fill',
            source: 'source1',
            filter: ['==', ['get', 'Time'], 5],
            'paint': { 
                'fill-color': '#9C27B0', 
                'fill-opacity': 0.3,
                'fill-outline-color': '#7B1FA2'
            }
        });
        
        map.addLayer({
            id: 'line-1',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '1'],
            paint: {
              'line-color': '#FF0000',
              'line-width': 3
            }
        });
          
        map.addLayer({
            id: 'line-2',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '2'],
            paint: {
              'line-color': '#0000FF',
              'line-width': 3
            }
        });
          
        map.addLayer({
            id: 'line-3',
            type: 'line',
            source: 'source2',
            filter: ['==', ['get', 'line'], '3'],
            paint: {
              'line-color': '#00AA00',
              'line-width': 3
            }
        });
        
        map.addLayer({
            id: 'stations',
            type: 'circle',
            source: 'source3',
            paint: { 
                'circle-color': '#1E88E5',
                'circle-radius': 5,
                'circle-stroke-color': '#0D47A1',
                'circle-stroke-width': 1.5
            }
        });
        
        // Add station interactivity
        addStationInteractivity();
        
        // Create the legend
        createLegend(layers);
    })
    .catch(error => console.error('Error loading data:', error));
});

// Function to create the legend with checkboxes for toggling layers
function createLegend(layers) {
    const legendContainer = document.getElementById('legend');
    
    // Add legend title
    const title = document.createElement('div');
    title.className = 'legend-title';
    title.textContent = 'Map Layers';
    legendContainer.appendChild(title);
    
    layers.forEach(layer => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            const visibility = checkbox.checked ? 'visible' : 'none';
            map.setLayoutProperty(layer.id, 'visibility', visibility);
        });
        
        // Color box
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        if (layer.type === 'line') {
            colorBox.style.background = `linear-gradient(to right, ${layer.color}, ${layer.color})`;
            colorBox.style.height = '4px';
            colorBox.style.marginTop = '8px';
            colorBox.style.marginBottom = '8px';
        }
        else if (layer.type === 'circle') {
            // Circle style
            colorBox.style.backgroundColor = layer.color;
            colorBox.style.borderRadius = '50%'; // Make it round
            colorBox.style.width = '12px';
            colorBox.style.height = '12px';
            colorBox.style.margin = '4px';
        
            // Optional: If you track strokeColor, add a border
            if (layer.strokeColor) {
                colorBox.style.border = `${layer.strokeWidth || 1}px solid ${layer.strokeColor}`;
            }
        }
        else {
            // fill style
            colorBox.style.backgroundColor = layer.color;
            colorBox.style.opacity = layer.opacity || 1;
        }
        
        // Label
        const label = document.createElement('div');
        label.className = 'legend-label';
        label.textContent = layer.label;
        
        // Append
        item.appendChild(checkbox);
        item.appendChild(colorBox);
        item.appendChild(label);
        legendContainer.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const sidePanel = document.getElementById('side-panel');
    const toggleBtn = document.getElementById('toggle-panel-btn');

    toggleBtn.addEventListener('click', () => {
        sidePanel.classList.toggle('minimized');
        toggleBtn.textContent = sidePanel.classList.contains('minimized')
            ? 'About the map'
            : 'Minimize';
    });
});