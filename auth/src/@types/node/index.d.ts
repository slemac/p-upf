declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: string;

      readonly PORT: number;
      readonly DB_CNN_STRING: string;
      JWT_PRIVATE_KEY: string;

      // readonly CLIENT_URL: string;

      // readonly CRYPTO_PRIVATE_KEY: string;

      // readonly GOOGLE_CLIENT_ID: string;
      // readonly GOOGLE_SECRET_ID: string;
      // readonly GOOGLE_REDIRECT_URI: string;
      // readonly GOOGLE_REFRESH_TOKEN: string;

      // readonly AWS_ACCESS_KEY_ID: string;
      // readonly AWS_SECRET_ACCESS_KEY: string;
      // readonly AWS_BUCKET_PRIVATE: string;
      // readonly AWS_BUCKET_PUBLIC: string;
      // readonly CF_ACCESS_KEY_ID: string;
      // readonly CF_PRIVATE_KEY: any;
    }
  }
}

export {};
