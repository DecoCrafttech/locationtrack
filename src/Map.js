// src/Map.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = ({ location }) => {
  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  const center = {
    lat: location.latitude || 0,
    lng: location.longitude || 0,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw

">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
