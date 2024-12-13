import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';

// Mocking ResizeObserver for "Recharts"
global.ResizeObserver = ResizeObserver;
