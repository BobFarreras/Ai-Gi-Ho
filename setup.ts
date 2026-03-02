import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Neteja el DOM després de cada test per evitar interferències
afterEach(() => {
  cleanup();
});