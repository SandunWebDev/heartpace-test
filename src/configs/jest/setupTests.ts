import '@testing-library/jest-dom';

// Polyfilling ResizeObserver. Currently mainly needed for "Recharts"
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;
