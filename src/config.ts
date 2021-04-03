const config = {
  youtubeRegex: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  databaseUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
}

export default config
