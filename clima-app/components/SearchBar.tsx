interface SearchBarProps {
  city: string;
  setCity: (value: string) => void;
  onSearch: () => void;
  onLocation: () => void;
}

export default function SearchBar({
  city,
  setCity,
  onSearch,
  onLocation,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 w-full max-w-md">
      {/* Container para o input e botão de busca por nome */}
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded text-black flex-1"
          placeholder="Nome da cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={onSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Botão para localização automática via GPS do navegador */}
      <button
        onClick={onLocation}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
      >
        Usar minha localização
      </button>
    </div>
  );
}
