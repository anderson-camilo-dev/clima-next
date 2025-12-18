"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Solução mais robusta para os ícones no Next.js/TypeScript
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Tipagem das Props
interface MapProps {
  lat: number;
  lon: number;
  apiKey: string;
}

// Função para atualizar a visão do mapa suavemente
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

export default function Map({ lat, lon, apiKey }: MapProps) {
  const position: [number, number] = [lat, lon];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden mt-5 shadow-inner border border-gray-300">
      <MapContainer 
        center={position} 
        zoom={10} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <ChangeView center={position} />
        
        {/* Camada do Mapa (Logradouros) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Camada Climática (Radar de Chuva) */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
          attribution='&copy; OpenWeatherMap'
          opacity={0.6}
        />

        <Marker position={position} icon={DefaultIcon}>
          <Popup>Você está aqui!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}