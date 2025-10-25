"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function SpookyApparition() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [isFlipped, setIsFlipped] = useState(false);

  const ghostImage = PlaceHolderImages.find(img => img.id === 'ghost');

  useEffect(() => {
    const handleApparition = () => {
      setIsVisible(true);
      
      const top = `${Math.random() * 80 + 10}%`; // 10% to 90%
      const left = `${Math.random() * 80 + 10}%`;
      setPosition({ top, left });
      setIsFlipped(Math.random() > 0.5);

      setTimeout(() => {
        setIsVisible(false);
      }, Math.random() * 2000 + 1000); // Visible for 1-3 seconds
    };

    const interval = setInterval(() => {
      // Chance to appear
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        handleApparition();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!ghostImage) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed pointer-events-none z-50 transition-opacity duration-[2000ms]',
        isVisible ? 'opacity-20' : 'opacity-0'
      )}
      style={{ top: position.top, left: position.left, transform: `translate(-50%, -50%) ${isFlipped ? 'scaleX(-1)' : ''}` }}
    >
      <Image
        src={ghostImage.imageUrl}
        alt={ghostImage.description}
        data-ai-hint={ghostImage.imageHint}
        width={150}
        height={200}
        className="object-contain filter grayscale"
      />
    </div>
  );
}
