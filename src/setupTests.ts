// Setup for Bun testing environment
import { expect } from 'bun:test';

// Mock global expect for jest-dom
globalThis.expect = expect;

// Import jest-dom matchers
import '@testing-library/jest-dom';
