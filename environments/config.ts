const MasterKeys = {
  development: {
    BASE_URL: "http://localhost",
    BASE_ENV: "local",
    PORT: 4000,
    API_PORT: 3008,
    PREFIX: "api",
  },
  production: {
    BASE_URL: "",
    BASE_ENV: "production",
    PORT: 4000,
    PREFIX: "api",
  },
};

export { MasterKeys };
