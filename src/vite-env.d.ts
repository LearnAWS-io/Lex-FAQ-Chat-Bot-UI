/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ACCESS_KEY_ID: string;
  readonly VITE_ACCESS_KEY_SECRET: string;
  readonly VITE_BOT_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
