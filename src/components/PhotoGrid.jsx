import React, { useState, useEffect } from 'react';

const PHOTO_SLOTS = [
  {
    images: [
      { src: '/images/maconskate.jpeg', alt: 'Working outdoors with a laptop and skateboard' },
      { src: '/images/working-whatsapp.jpeg', alt: 'Working on a laptop' },
    ],
    position: 'center',
  },
  {
    images: [
      { src: '/images/football.png', alt: 'Playing football' },
      { src: '/images/skate1.jpeg', alt: 'Skateboarding' },
    ],
    position: 'bottom',
  },
  {
    images: [
      { src: '/images/trek1.jpeg', alt: 'Trekking in the mountains' },
      { src: '/images/beach.png', alt: 'At the beach' },
      { src: '/images/coding-hotel.png', alt: 'Coding while travelling' },
    ],
    position: 'center',
  },
];

export default function PhotoGrid() {
  const [indices, setIndices] = useState(PHOTO_SLOTS.map(() => 0));
  const [prevIndices, setPrevIndices] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndices([...indices]);
      setIndices((current) => current.map((idx, s) => (idx + 1) % PHOTO_SLOTS[s].images.length));
      setIsCrossfading(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsCrossfading(true);
        });
      });

      const timer = setTimeout(() => {
        setPrevIndices(null);
      }, 750);

      return () => clearTimeout(timer);
    }, 3500);

    return () => clearInterval(interval);
  }, [indices]);

  return (
    <div className="photo-grid">
      {PHOTO_SLOTS.map((slot, slotIdx) => {
        const currentImg = slot.images[indices[slotIdx]];
        const prevImg = prevIndices ? slot.images[prevIndices[slotIdx]] : null;

        return (
          <div
            key={slotIdx}
            data-butterfly-perch={`photo-${slotIdx + 1}`}
            className="photo-slot"
          >
            {prevImg && (
              <img
                src={prevImg.src}
                alt={prevImg.alt}
                style={{
                  objectPosition: slot.position,
                  opacity: isCrossfading ? 0 : 1,
                  transform: isCrossfading ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            )}
            <img
              src={currentImg.src}
              alt={currentImg.alt}
              style={{
                objectPosition: slot.position,
                opacity: isCrossfading ? 1 : 0,
                transform: isCrossfading ? 'scale(1)' : 'scale(1.05)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
