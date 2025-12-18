// Estrutura dos dados que a API Open-Meteo retorna [cite: 9]
interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}