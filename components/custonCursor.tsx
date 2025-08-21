// src/components/custom-cursor.tsx
"use client";

import { useEffect } from 'react';

interface CustomCursorProps {
  imageUrl: string;
}

/**
 * This component sets a custom cursor image for the entire document.
 * It renders nothing itself, but applies a side effect to the body.
 */
export function CustomCursor({ imageUrl }: CustomCursorProps) {
  useEffect(() => {
    // Set the custom cursor on the body when the component mounts
    document.body.style.cursor = `url(${imageUrl}), auto`;

    // This is a cleanup function that runs when the component unmounts
    return () => {
      // Revert the cursor back to the default
      document.body.style.cursor = 'auto';
    };
  }, [imageUrl]); // Re-run the effect if the imageUrl changes

  // This component doesn't render any visible element
  return null;
}