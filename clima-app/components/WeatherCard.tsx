

interface WeatherCardProps {
  data: WeatherData | null;
  locationName: string; // Nova prop
}

export default function WeatherCard({ data, locationName }: WeatherCardProps) {
  if (!data) return null;

  return (
    <div className="border p-6 rounded-lg bg-white shadow-lg text-black text-center w-full max-w-md">
      {/* Exibe o Nome e Estado aqui */}
      <h2 className="text-2xl font-bold text-slate-700 mb-1">{locationName}</h2>
      
      <p className="text-gray-500 mb-4">Condição Atual</p>
      
      <div className="flex flex-col items-center">
        <span className="text-6xl font-bold text-blue-600">{data.temperature}°C</span>
        <p className="text-gray-500 mt-2">Vento: {data.windspeed} km/h</p>
      </div>
    </div>
  );
}