"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";

const WeatherMap = dynamic(() => import("../components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      Carregando mapa...
    </div>
  )
});

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const OPEN_WEATHER_KEY = "a5e79d149be371635b711462727cabed";

  const handleSearch = async () => {
    if (loading) return;

    let timeoutId: NodeJS.Timeout;

    try {
      setError("");
      setLoading(true);

      timeoutId = setTimeout(() => {
        setLoading(false);
        setError("A busca demorou mais de 10 segundos. Tente novamente.");
      }, 10000);

      const estados = [
        "acre", "alagoas", "amapá", "amazonas", "bahia", "ceará",
        "distrito federal", "espírito santo", "goiás", "maranhão",
        "mato grosso", "mato grosso do sul", "minas gerais", "pará",
        "paraíba", "paraná", "pernambuco", "piauí",
        "rio grande do norte", "rio grande do sul", "rondônia",
        "roraima", "santa catarina", "sergipe", "tocantins"
      ];

      if (estados.includes(city.toLowerCase().trim())) {
        clearTimeout(timeoutId);
        setLoading(false);
        setError("Esse estado não é uma cidade.");
        return;
      }

      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      const data = await res.json();
      clearTimeout(timeoutId);

      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name, admin1 } = data.results[0];
        setLocationName(`${name}${admin1 ? `, ${admin1}` : ""}`);
        setCoords({ lat: latitude, lon: longitude });
        fetchWeather(latitude, longitude);
      } else {
        setError(
          "Cidade não encontrada. Verifique acentos, letras maiúsculas ou o nome digitado."
        );
      }
    } catch {
      setError("Erro ao conectar com o serviço de busca.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLocation = () => {
    if (loading) return;

    setError("");
    setLoading(true);

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
          const cityFound =
            data.address.city ||
            data.address.town ||
            data.address.village;

          setLocationName(
            cityFound ? `${cityFound}, ${data.address.state}` : "Localização Atual"
          );
        } catch {
          setLocationName("Localização Atual");
        }

        fetchWeather(lat, lon);
        setLoading(false);
      },
      () => {
        setError("Não foi possível obter sua localização.");
        setLoading(false);
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
    } catch {
      setError("Erro ao buscar dados climáticos.");
    }
  };

  return (
    // Aqui tirei o bg-gray-100 para que a imagem do layout fique visível
    <div className="min-h-screen flex flex-col font-sans">
      
      <main className="flex flex-1 flex-col items-center p-6 gap-6 w-full max-w-4xl mx-auto">
        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={handleSearch}
          onLocation={handleAutoLocation}
          loading={loading}
        />

        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded">
            Buscando informações, aguarde...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        
        <WeatherCard data={weather} locationName={locationName} />

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
