export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-gray-300 px-100 py-10 text-center">
      {/* Sombra subindo */}
      <div className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <p className="text-3xl font-light tracking-widest">
        © {currentYear} MEU POKÉDEX
      </p>

      <p className="text-2xl tracking-wide leading-relaxed max-w-xl mx-auto mt-2">
        Dados fornecidos pela PokeAPI. Este é um projeto de estudo.
      </p>

      <a
        href="https://github.com/anderson-camilo-dev"
        className="mt-6 inline-block text-2xl uppercase tracking-[0.25em] text-gray-400 hover:text-white transition-colors"
      >
        Contato
      </a>
    </footer>
  );
}
