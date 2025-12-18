"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Header from "../components/Header";

// Importação dinâmica do mapa
const WeatherMap = dynamic(() => import("../components/Map"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Carregando mapa...</div>
});

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export default function WeatherPage() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  // Defina sua chave aqui para passar para o componente Map
  const OPEN_WEATHER_KEY = "a5e79d149be371635b711462727cabed";

  const handleSearch = async () => {
    try {
      setError("");
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name, admin1 } = data.results[0];
        setLocationName(`${name}${admin1 ? `, ${admin1}` : ""}`);
        setCoords({ lat: latitude, lon: longitude });
        fetchWeather(latitude, longitude);
      } else {
        setError("Cidade não encontrada.");
      }
    } catch (err) {
      setError("Erro ao conectar com o serviço de busca.");
    }
  };

  const handleAutoLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Seu navegador não suporta geolocalização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const cityFound = data.address.city || data.address.town || data.address.village;
          const stateFound = data.address.state;

          setLocationName(cityFound ? `${cityFound}, ${stateFound}` : "Localização Atual");
        } catch {
          setLocationName("Localização Atual");
        }

        fetchWeather(lat, lon);
      },
      (err) => {
        setError("Não foi possível obter sua localização.");
      }
    );
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      setError("Erro ao buscar dados climáticos.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      <main className="flex flex-1 flex-col items-center p-6 gap-6 w-full max-w-4xl mx-auto">
        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={handleSearch}
          onLocation={handleAutoLocation}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <WeatherCard data={weather} locationName={locationName} />

        {/* CORREÇÃO: Passando a apiKey necessária para o componente Map */}
        {coords && (
          <div className="w-full h-[400px] rounded-xl shadow-lg overflow-hidden border-4 border-white">
            <WeatherMap 
              lat={coords.lat} 
              lon={coords.lon} 
              apiKey={OPEN_WEATHER_KEY} 
            />
          </div>
        )}
      </main>
    </div>
  );
}