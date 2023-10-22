/* eslint-disable */

export const displayMap = (locations) => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmxhbmtuZXZlcmxvc3QiLCJhIjoiY2xrMmo1anRzMGlkaDNvbzdsaTM2MWFudyJ9.0cE4WTwQWQ9QUpeWkAY7sA';
        
        var map = new mapboxgl.Map({
            container : 'map',
            style:'mapbox://styles/blankneverlost/clk2jb7p100fr01pehazhcs3s',
            scrollZoom:false
        
            // center: [-118,34],
            // zoom:10,
            // interactive:false
        });
        
        const bounds = new mapboxgl.LngLatBounds();
        
        locations.forEach(loc => {
            // create marker
            const el = document.createElement('div');
            el.className = 'marker';
        
            // Add marker
            new mapboxgl.Marker({
                element:el,
                anchor:'bottom'
            }).setLngLat(loc.coordinates).addTo(map);
        
            // Add popup
            new mapboxgl.Popup({
                offset:30
            })
                .setLngLat(loc.coordinates)
                .setHTML(`<p>Day ${loc.day} ${loc.description}</p>`)
                .addTo(map);
        
            // Extends map bound to include current loactions
            bounds.extend(loc.coordinates);
        });
        
        map.fitBounds(bounds,{
            padding:{
                top:200,
                bottom:150,
                left:10,
                right:10
            }
        });
    }

