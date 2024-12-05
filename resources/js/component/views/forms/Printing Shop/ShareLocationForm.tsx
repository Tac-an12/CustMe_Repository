import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/header';
import { Button, TextField, Typography, Container, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ShareLocation = () => {
  const { createStore, loading } = useStore();
  const [storename, setStorename] = useState('');
  const [description, setDescription] = useState('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLatitude(latitude);
              setLongitude(longitude);
  
              // Call reverse geocoding API
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                if (data && data.display_name) {
                  setAddress(data.display_name); // Populate the address field
                }
              } catch (error) {
                console.error('Error fetching address:', error);
                setAddress(''); // Default to empty if an error occurs
              }
  
              setShowMap(true);
            },
            (error) => {
              alert('Unable to retrieve your location. Defaulting to Lapu-Lapu City, Cebu, Philippines.');
              setLatitude(10.3103);
              setLongitude(123.9494);
              setAddress('Lapu-Lapu City, Cebu, Philippines');
              setShowMap(true);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else if (result.state === 'denied') {
          alert('Location access denied. Defaulting to Lapu-Lapu City, Cebu, Philippines.');
          setLatitude(10.3103);
          setLongitude(123.9494);
          setAddress('Lapu-Lapu City, Cebu, Philippines');
          setShowMap(true);
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const handleRemoveMap = () => {
    setShowMap(false);
    setLatitude(null);
    setLongitude(null);
    setAddress('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert('Please allow location access or enter your location manually.');
      return;
    }

    const location = { longitude, latitude, address };
    const storeData = { storename, description, location };

    const success = await createStore(storeData);

    if (success) {
      alert('Store created successfully!');
      setStorename('');
      setDescription('');
      setAddress('');
      setShowMap(false);
    } else {
      alert('Failed to create store.');
    }
  };

  return (
    <Container maxWidth="sm" className='mt-20'>
      <Header />
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Share Your Location
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={handleShareLocation}>
          Share Location
        </Button>

        {showMap && latitude !== null && longitude !== null && (
          <div style={{ position: 'relative', margin: '20px 0' }}>
            <IconButton
              onClick={handleRemoveMap}
              style={{ position: 'absolute', top: '0', right: '0' }}
              color="secondary"
            >
              <CloseIcon />
            </IconButton>
            <MapContainer
              center={[latitude, longitude] as [number, number]}
              zoom={13}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]} />
            </MapContainer>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Store Name"
            value={storename}
            onChange={(e) => setStorename(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Creating...' : 'Create Store'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ShareLocation;
