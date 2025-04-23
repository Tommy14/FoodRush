import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default marker icon issue in Leaflet
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const LocationMap = ({ position, name, address }) => {
  // If no coordinates are provided, don't render the map
  if (!position || !position[0] || !position[1]) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
        No location coordinates available
      </div>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={[position[1], position[0]]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[position[1], position[0]]} icon={defaultIcon}>
          <Popup>
            <div>
              <strong>{name}</strong>
              <div>{address}</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;