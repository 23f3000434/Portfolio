import React, { useState, useEffect, useRef } from 'react';

const ROLES = [
  ['full', 'stack', 'dev,', 'ml', 'engineer,', 'cybersecurity', 'builder', ':)'],
  ['bs', 'data', 'science', '@', 'iit', 'madras,', 'audio', 'ml', 'hacker', ':)'],
  ['real-time', 'systems,', 'adversarial', 'defense,', '&', 'clean', 'code', ':)'],
];

export default function HoverRoles() {
  const [isOpen, setIsOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const isHoveredRef = useRef(false);
  const nextRoleIndexRef = useRef(0);

  const activeTokens = ROLES[roleIndex];

  const handleMouseEnter = () => {
    if (isHoveredRef.current) return;
    isHoveredRef.current = true;
    const nextIdx = nextRoleIndexRef.current;
    nextRoleIndexRef.current = (nextIdx + 1) % ROLES.length;
    setRoleIndex(nextIdx);
    setRevealedCount(0);
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsOpen(false);
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsClosing(false);
      let count = 0;
      timer = window.setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= activeTokens.length) {
          window.clearInterval(timer);
        }
      }, 25);
      return () => window.clearInterval(timer);
    } else {
      setIsClosing(true);
      timer = window.setTimeout(() => {
        setRevealedCount(0);
        setIsClosing(false);
      }, 300);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, activeTokens]);

  return (
    <span className="hover-roles" data-open={isOpen ? 'true' : 'false'}>
      <button
        type="button"
        className="hover-roles__trigger"
        aria-expanded={isOpen}
        aria-label="need — show what I can be"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleMouseEnter}
      >
        need
      </button>

      {revealedCount > 0 && (
        <span className="hover-roles__stream" data-closing={isClosing ? 'true' : 'false'} aria-hidden="true">
          {activeTokens.slice(0, revealedCount).map((token, idx) => (
            <span key={`${token}-${idx}`}>
              {idx > 0 && ' '}
              <span className="hover-roles__token">{token}</span>
            </span>
          ))}
        </span>
      )}
      <span className="sr-only">
        : full stack dev, ml engineer, cybersecurity builder :) or bs data science @ iit madras, audio ml hacker :)
      </span>
    </span>
  );
}
