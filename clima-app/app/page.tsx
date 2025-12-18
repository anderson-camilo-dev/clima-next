"use client";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Header from "../components/Header";

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

  // Busca por nome (Fluxo 1) [cite: 13]
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
        fetchWeather(latitude, longitude);
      } else {
        setError("Cidade não encontrada.");
      }
    } catch (err) {
      setError("Erro ao conectar com o serviço de busca.");
    }
  };

  // Localização automática (Fluxo 2) [cite: 19]
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

        // Tentamos buscar o nome real. Se falhar, usamos "Localização Atual"
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const cityFound =
            data.address.city || data.address.town || data.address.village;
          const stateFound = data.address.state;

          setLocationName(
            cityFound ? `${cityFound}, ${stateFound}` : "Localização Atual"
          );
        } catch {
          setLocationName("Localização Atual");
        }

        fetchWeather(lat, lon);
      },
      (err) => {
        setError(
          "Não foi possível obter sua localização. Verifique as permissões."
        );
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
      {/* O Header fica fora do main ou no topo do flex-col sem justify-center */}
      <Header />

      <main className="flex flex-1 flex-col items-center p-6 gap-6">
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
      </main>
    </div>
  );
}
