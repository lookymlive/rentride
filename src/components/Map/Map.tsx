'use client';
import { useAppContext } from '@/context/AppContext';
import { Container } from '@mantine/core';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import classes from './Map.module.css';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface Props {
  height?: string;
}

const Map = ({ height }: Props) => {
  const {
    state: { selectedCountry, selectedRegion },
  } = useAppContext();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const coordinates = useMemo((): [number, number] => {
    if (selectedRegion) {
      return [selectedRegion.latitude || 0, selectedRegion.longitude || 0];
    }

    if (selectedCountry) {
      return [selectedCountry.latitude || 0, selectedCountry.longitude || 0];
    }

    return [7.9465, 1.0232];
  }, [selectedRegion, selectedCountry]);

  const displayName = useMemo(() => {
    if (selectedRegion) return selectedRegion.name;
    if (selectedCountry) return selectedCountry.name;
    return 'Ghana';
  }, [selectedRegion, selectedCountry]);

  if (!isMounted) {
    return (
      <Container size="xl" className={classes.mapContainer}>
        <div style={{ height: height || '300px', width: '100%', backgroundColor: '#f0f0f0' }} />
      </Container>
    );
  }

  return (
    <Container size="xl" className={classes.mapContainer}>
      <MapContainer
        center={coordinates}
        zoom={14}
        style={{
          height: height || '300px',
          width: '100%',
          zIndex: 0,
          margin: 0,
        }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarker
          latitude={coordinates[0]}
          longitude={coordinates[1]}
          displayName={displayName}
        />
      </MapContainer>
    </Container>
  );
};

interface MapMarkerProps {
  latitude: number;
  longitude: number;
  displayName: string;
}

const MapMarker = ({ latitude, longitude, displayName }: MapMarkerProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 14);
  }, [map, latitude, longitude]);

  return (
    <Marker position={[latitude, longitude]}>
      <Popup>{displayName}</Popup>
    </Marker>
  );
};

export default Map;
