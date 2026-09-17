import React, { useState, useEffect } from 'react';

const PHOTO_SLOTS = [
  {
    images: [
      { src: '/images/aesthetics/aesthetic-1.png', alt: 'Aesthetic mood 1' },
      { src: '/images/aesthetics/aesthetic-4.png', alt: 'Aesthetic mood 4' },
    ],
    position: 'center',
  },
  {
    images: [
      { src: '/images/aesthetics/aesthetic-2.png', alt: 'Aesthetic mood 2' },
      { src: '/images/aesthetics/aesthetic-5.png', alt: 'Aesthetic mood 5' },
    ],
    position: 'center',
  },
  {
    images: [
      { src: '/images/aesthetics/aesthetic-3.png', alt: 'Aesthetic mood 3' },
      { src: '/images/aesthetics/aesthetic-6.png', alt: 'Aesthetic mood 6' },
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
    }, 4000);

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
                loading="lazy"
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
              loading="lazy"
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
