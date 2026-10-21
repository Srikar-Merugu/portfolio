'use client';

import dynamic from 'next/dynamic';

// The chat widget pulls in Three.js — load it only in the browser.
// `ssr: false` is only allowed inside a Client Component (Next 15+).
const SrikarAI = dynamic(() => import('./SrikarAI'), { ssr: false });

export default SrikarAI;
