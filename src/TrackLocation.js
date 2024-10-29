// src/TrackLocation.js
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, onValue, off } from 'firebase/database';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrackLocation = ({ userId }) => {
  const [locationData, setLocationData] = useState({});
  const [address, setAddress] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const locationRef = ref(database, `locations`);
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      setLocationData(data || {});

      // Fetch address and update timestamp whenever location updates
      if (data && data[userId]) {
        const { lat, lng, timestamp } = data[userId];
        getAddress(lat, lng);
        setLastUpdated(formatTimestamp(timestamp));
      }
    });

    return () => {
      off(locationRef);
      unsubscribe();
    };
  }, [userId]);

  // Function to get address from latitude and longitude
  const getAddress = async (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        toast.error('Address not found');
      }
    });
  };

  // Format the timestamp into a readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize the format here
  };

  return (
    <div>
      <h1>Tracking Location</h1>

      <LoadScript googleMapsApiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw">
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={{
            lat: locationData[userId]?.lat || 0,
            lng: locationData[userId]?.lng || 0
          }}
          zoom={15}
        >
          {locationData[userId] && (
            <Marker
              position={{
                lat: locationData[userId].lat,
                lng: locationData[userId].lng,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <ToastContainer />

      {/* Display live data in a table */}
      <h2>Live Location Data:</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {locationData[userId] && (
            <tr>
              <td>{userId}</td>
              <td>{locationData[userId].lat}</td>
              <td>{locationData[userId].lng}</td>
              <td>{lastUpdated}</td> {/* Display last updated time */}
            </tr>
          )}
        </tbody>
      </table>

      {/* Display address */}
      <h2>Address:</h2>
      <pre>{address || 'No address available'}</pre>
    </div>
  );
};

export default TrackLocation;
