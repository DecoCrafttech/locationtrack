// src/LiveLocation.js
import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue, set, off } from 'firebase/database';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveLocation = ({ userId }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [watchId, setWatchId] = useState(null);
  const [duration, setDuration] = useState(60); // Duration in seconds

  const notify = (message) => toast(message);

  const startSharing = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationRef = ref(database, `locations/${userId}`);

          set(locationRef, {
            lat: latitude,
            lng: longitude,
            timestamp: Date.now(),
          })
          .then(() => {
            setIsSharing(true);
            notify("Location sharing started!");
          })
          .catch((error) => {
            console.error("Error setting location:", error);
            notify("Error sharing location.");
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          notify("Geolocation error.");
        },
        { enableHighAccuracy: true }
      );
      setWatchId(id);

      // Automatically stop sharing after the specified duration
      setTimeout(stopSharing, duration * 1000);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const stopSharing = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      notify("Location sharing stopped!");
      const locationRef = ref(database, `locations/${userId}`);
      set(locationRef, null); // Clear location data when stopped
    }
  };

  useEffect(() => {
    const locationRef = ref(database, `locations`);
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      setLocationData(data || {});
    });

    return () => {
      off(locationRef);
      unsubscribe();
    };
  }, []);

  // Create a shareable link
  const shareableLink = `${window.location.origin}/track/${userId}`;

  return (
    <div>
      <h1>{userId === 'user1' ? 'Share Your Location' : 'Track Location'}</h1>
      {userId === 'user1' && (
        <>
          <label>
            Share for (seconds):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          </label>
          <button onClick={startSharing} disabled={isSharing}>
            Start Sharing Location
          </button>
          <button onClick={stopSharing} disabled={!isSharing}>
            Stop Sharing Location
          </button>
          <div>
            <strong>Share this link:</strong>
            <input type="text" readOnly value={shareableLink} />
          </div>
        </>
      )}
      {userId === 'user2' && <p>Tracking user1's location...</p>}
      
      <LoadScript googleMapsApiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw">
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={{
            lat: locationData.user1?.lat || 0,
            lng: locationData.user1?.lng || 0
          }}
          zoom={15}
        >
          {locationData.user1 && (
            <Marker
              position={{
                lat: locationData.user1.lat,
                lng: locationData.user1.lng,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <ToastContainer />
    </div>
  );
};

export default LiveLocation;
