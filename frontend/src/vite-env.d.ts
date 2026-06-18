/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_TAGLINE: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_USE_AI_BACKEND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
