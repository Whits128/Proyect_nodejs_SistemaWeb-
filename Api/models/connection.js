import config from "../../Config/config";
import * as sql from "mssql";

export const dbSettings = {
  user: config.dbUser,
  password: config.dbPassword,
  server: config.dbServer,
  database: config.dbDatabase,
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(error);
    throw error; // Lanza nuevamente el error para que pueda ser manejado por el código que llama a esta función
  }
};

export { sql };
