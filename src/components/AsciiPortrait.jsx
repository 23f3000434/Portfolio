import React from 'react';

export default function AsciiPortrait() {
  return (
    <div className="ascii-corner-portrait" aria-hidden="true">
      <img
        src="/images/ascii-magic-1.png"
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}
