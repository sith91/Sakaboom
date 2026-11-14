// Polyfill for Node 25+ where SlowBuffer is removed but still used by deep dependencies (buffer-equal-constant-time)
if (typeof process !== 'undefined' && typeof global !== 'undefined' && !global.SlowBuffer) {
  global.SlowBuffer = global.Buffer;
}

import {genkit} from 'genkit';

export const ai = genkit({
  plugins: [],
  // model: 'googleai/gemini-1.5-flash', -> Removed for independence
});
