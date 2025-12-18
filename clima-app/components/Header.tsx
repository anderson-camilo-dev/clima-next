import React from 'react';


const Header = () => {
  // URL da imagem que você enviou
  const imageUrl = "https://images.unsplash.com/photo-1639147830990-fa5883dc0031";

  const headerStyle = {
    backgroundImage: ` url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <header 
      style={headerStyle} 
      className="w-full border-b border-gray-200 py-16 px-8 flex justify-between items-center"
    >
      {/* Logo ou Nome do Site */}
      
      <div className="text-6xl font-extrabold text-blue-700 drop-shadow-md">
        <a href="/">
        Clima Next
        </a>
      </div>

      
    </header>
  );
};

export default Header;