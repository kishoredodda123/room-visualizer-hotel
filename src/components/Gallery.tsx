
import { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 1,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421823/3P6A8455_nrvsuj.jpg',
      title: 'Luxury Suite'
    },
    {
      id: 2,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421823/3P6A8479_fnynsf.jpg',
      title: 'Executive Room'
    },
    {
      id: 3,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421823/3P6A8457_yx0jwq.jpg',
      title: ''
    },
    {
      id: 4,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421835/3P6A8456_oxh9kh.jpg',
      title: 'Business Center'
    },
    {
      id: 5,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421823/3P6A8460_typlf1.jpg',
      title: 'Hotel Exterior'
    },
    {
      id: 6,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421825/3P6A8465_opsbak.jpg',
      title: 'Garden View'
    },
    {
      id: 7,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752422100/photo_6314499762719671047_y_yukzen.jpg',
      title: 'Garden View'
    },
    {
      id: 8,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421828/3P6A8467_flppjl.jpg',
      title: 'Garden View'
    },
    {
      id: 9,
      url: 'https://res.cloudinary.com/dsz4sifhj/image/upload/v1752421823/3P6A8457_yx0jwq.jpg',
      title: 'Garden View'
    }

  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Hotel Gallery</h2>
        <p className="text-lg text-muted-foreground">Discover the beauty and elegance of our hotel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div 
            key={image.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => setSelectedImage(image.url)}
          >
            <img 
              src={image.url} 
              alt={image.title}
              loading="lazy"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="text-xl font-semibold">{image.title}</h3>
                <p className="text-sm">Click to view</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Gallery Image"
              loading="lazy"
              className="max-w-full max-h-full object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white text-3xl hover:text-hotel-gold transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
