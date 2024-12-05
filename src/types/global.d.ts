// src/types/global.d.ts

export {};

declare global {
  interface Window {
    Pusher: any; // Declare Pusher globally on the window object
  }
}
