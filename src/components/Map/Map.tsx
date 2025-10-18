'use client';
import { useAppContext } from '@/context/AppContext';
import { Container } from '@mantine/core';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import classes from './Map.module.css';

interface Props {
  height?: string;
}

const Map = ({ height }: Props) => {
  const {
    state: { selectedCountry, selectedRegion },
  } = useAppContext();

  const getCordinates = (): [number, number] => {
    if (selectedRegion) {
      return [selectedRegion.latitude || 0, selectedRegion.longitude || 0];
    }

    if (selectedCountry) {
      return [selectedCountry.latitude || 0, selectedCountry.longitude || 0];
    }

    return [7.9465, 1.0232];
  };

  return (
    <Container size="xl" className={classes.mapContainer}>
      <MapContainer
        center={getCordinates()}
        zoom={14}
        style={{
          height: height || '300px',
          width: '100%',
          zIndex: 0,
          margin: 0,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarker
          latitude={getCordinates()[0]}
          longitude={getCordinates()[1]}
          displayName={
            selectedRegion
              ? selectedRegion.name
              : selectedCountry
              ? selectedCountry.name
              : 'Ghana'
          }
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
