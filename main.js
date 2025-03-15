// Initialize the map
mapboxgl.accessToken = mapboxAccessToken;
const map = new mapboxgl.Map(mapConfig);

map.on('load', () => {
    // Load all data first
    Promise.all([
        fetch(dataSources.area15min).then(res => res.json()),
        fetch(dataSources.area10min).then(res => res.json()),
        fetch(dataSources.area5min).then(res => res.json()),
        fetch(dataSources.metroLines).then(res => res.json()),
        fetch(dataSources.metroStations).then(res => res.json())
    ])
    .then(([data1, data2, data3, data4, data5]) => {
        // Add sources
        map.addSource('source1', { type: 'geojson', data: data1 });
        map.addSource('source2', { type: 'geojson', data: data2 });
        map.addSource('source3', { type: 'geojson', data: data3 });
        map.addSource('source4', { type: 'geojson', data: data4 });
        map.addSource('source5', { type: 'geojson', data: data5 });
        
        // Add layers in specific order (bottom to top)
        map.addLayer({
            'id': 'area5',
            'type': 'fill',
            'source': 'source1',
            'paint': { 
                'fill-color': '#E1BEE7', 
                'fill-opacity': 0.2,
                'fill-outline-color': '#BA68C8'
            }
        });
        
        map.addLayer({
            'id': 'area10',
            'type': 'fill',
            'source': 'source2',
            'paint': { 
                'fill-color': '#BA68C8', 
                'fill-opacity': 0.25,
                'fill-outline-color': '#9C27B0'
            }
        });
        
        map.addLayer({
            'id': 'area15',
            'type': 'fill',
            'source': 'source3',
            'paint': { 
                'fill-color': '#9C27B0', 
                'fill-opacity': 0.3,
                'fill-outline-color': '#7B1FA2'
            }
        });
        
        
        map.addLayer({
            id: 'line-1',
            type: 'line',
            source: 'source4',
            filter: ['==', ['get', 'line'], '1'], // Only features whose "line" property == "1"
            paint: {
              'line-color': '#FF0000',
              'line-width': 3
            }
          });
          
          map.addLayer({
            id: 'line-2',
            type: 'line',
            source: 'source4',
            filter: ['==', ['get', 'line'], '2'],
            paint: {
              'line-color': '#0000FF',
              'line-width': 3
            }
          });
          
          map.addLayer({
            id: 'line-3',
            type: 'line',
            source: 'source4',
            filter: ['==', ['get', 'line'], '3'],
            paint: {
              'line-color': '#00AA00',
              'line-width': 3
            }
          });
          
        
        map.addLayer({
            'id': 'stations',
            'type': 'circle',
            'source': 'source5',
            'paint': { 
                'circle-color': '#1E88E5',
                'circle-radius': 5,
                'circle-stroke-color': '#0D47A1',
                'circle-stroke-width': 1.5
            }
        });
        
        // Create the legend
        createLegend(layers);
    })
    .catch(error => console.error('Error loading data:', error));
});

map.on('click', (e) => {
    // Query all fill layers (polygons) at the clicked point
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['area5', 'area10', 'area15'] // Updated to match your actual layer IDs
    });
    
    // If no features found, return
    if (!features.length) return;
    
    // Get the first feature (topmost)
    const feature = features[0];
    
    // Extract properties from the feature
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
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
});



// Function to create the legend with checkboxes for toggling layers
function createLegend(layers) {
    const legendContainer = document.getElementById('legend');
      
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