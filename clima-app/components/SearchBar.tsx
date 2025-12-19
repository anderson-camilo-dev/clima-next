interface SearchBarProps {
  city: string;
  setCity: (value: string) => void;
  onSearch: () => void;
  onLocation: () => void;
  loading: boolean;
}

export default function SearchBar({
  city,
  setCity,
  onSearch,
  onLocation,
  loading,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded text-black flex-1 disabled:bg-gray-200"
          placeholder="Nome da cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className={`p-2 rounded text-white transition-colors ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <button
        onClick={onLocation}
        disabled={loading}
        className={`p-2 rounded text-white transition-colors ${
          loading
            ? "bg-green-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Aguarde..." : "Usar minha localização"}
      </button>
    </div>
  );
}
