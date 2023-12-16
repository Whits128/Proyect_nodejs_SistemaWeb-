import { config } from 'dotenv';

config();

export default {
  port: process.env.PORT || 3000,
  socketPort: process.env.SOCKET_PORT || 4000, // Asegúrate de que este puerto sea diferente al puerto del servidor HTTP
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbServer: process.env.DB_SERVER || '',
  dbDatabase: process.env.DB_DATABASE || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
  JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES || '',
};
