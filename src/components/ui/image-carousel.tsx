import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToImage = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-black/5 rounded-3xl p-6 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,4fr] gap-6 items-center">
        {/* Thumbnails on the left */}
        <div className="flex flex-row lg:flex-col gap-4 justify-center lg:max-h-[600px]">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "group relative w-full lg:max-w-full aspect-[4/3] overflow-hidden rounded-2xl transition-all duration-500",
                "hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] hover:shadow-hotel-gold/20",
                currentIndex === index 
                  ? [
                      "ring-2 ring-hotel-gold ring-offset-4 ring-offset-white/90",
                      "scale-105 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] shadow-hotel-gold/20",
                      "z-10"
                    ].join(" ")
                  : "hover:ring-1 ring-hotel-gold/50 ring-offset-2 hover:scale-102"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  "group-hover:scale-110",
                  currentIndex === index ? "scale-105" : ""
                )}
              />
              <div className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}>
                <div className="w-12 h-12 rounded-full bg-hotel-gold/90 text-white flex items-center justify-center text-lg font-semibold backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Image Display on the right */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[16/9] bg-gradient-to-br from-black to-gray-900">
          {/* Background blur effect */}
          <div 
            className="absolute inset-0 blur-2xl scale-110 opacity-30"
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Main images */}
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-700 ease-out",
                  index === currentIndex 
                    ? "opacity-100 scale-100 rotate-0 filter brightness-110" 
                    : index < currentIndex 
                      ? "opacity-0 scale-95 -rotate-3 -translate-x-full" 
                      : "opacity-0 scale-95 rotate-3 translate-x-full"
                )}
              >
                <img
                  src={image}
                  alt={`Room View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6">
            <button
              onClick={prevImage}
              className={cn(
                "w-12 h-12 rounded-full bg-black/30 backdrop-blur-md",
                "hover:bg-hotel-gold/90 text-white flex items-center justify-center",
                "transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-hotel-gold/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isAnimating}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="px-6 py-3 rounded-full bg-black/30 backdrop-blur-md text-white font-medium">
              <span className="text-hotel-gold">{currentIndex + 1}</span>
              <span className="mx-2">/</span>
              <span>{images.length}</span>
            </div>
            <button
              onClick={nextImage}
              className={cn(
                "w-12 h-12 rounded-full bg-black/30 backdrop-blur-md",
                "hover:bg-hotel-gold/90 text-white flex items-center justify-center",
                "transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-hotel-gold/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isAnimating}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
            <div 
              className="h-full bg-hotel-gold transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel; 