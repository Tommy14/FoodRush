import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from '@react-google-maps/api';
import { MdLocationOn } from 'react-icons/md';

const GoogleMapComponent = ({ position, name, address }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Format the center properly if position is valid
  const center = position && Array.isArray(position) && position.length === 2 
    ? { lat: position[1], lng: position[0] } 
    : { lat: 0, lng: 0 };

  const mapStyles = {
    height: '300px',
    width: '100%',
    borderRadius: '0.5rem'
  };

  // Get your API key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ''
  });

  // When the map is fully loaded, mark it
  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true);
    }
  }, [isLoaded]);

  // Show a nice fallback UI if map can't be loaded
  if (loadError || (!isLoaded && !mapLoaded)) {
    return (
      <div className="h-[300px] w-full bg-blue-50 flex flex-col items-center justify-center rounded-lg border border-blue-100">
        <div className="text-center p-4">
          <div className="text-blue-500 text-4xl mb-2">
            <MdLocationOn size={48} />
          </div>
          <h3 className="font-medium text-blue-800">{name || 'Restaurant'}</h3>
          <p className="text-blue-600 mt-1">{address || 'Location information not available'}</p>
          <p className="text-sm text-blue-500 mt-3 italic">Map display unavailable</p>
          {/* Helpful fallback link to open manually in Google Maps */}
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  // If map loads fine, render it
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={center}
      zoom={15}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true
      }}
    >
      <Marker 
        position={center}
        onClick={() => setShowInfo(!showInfo)}
      />

      {showInfo && (
        <InfoWindow
          position={center}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="p-1">
            <h3 className="font-medium text-sm">{name || 'Restaurant'}</h3>
            {address && <p className="text-xs text-gray-600">{address}</p>}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : null;
};

export default GoogleMapComponent;
