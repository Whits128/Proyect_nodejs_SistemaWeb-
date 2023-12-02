// En tu modelo InsersionDinamica.js
import { getConnection, sql } from "./connection";

export const insertarRegistro = async (tabla, campos) => {
  const pool = await getConnection();
  const transaction = pool.transaction();
  
  try {
    await transaction.begin();

    // Verifica si el registro ya existe
    const existeRegistro = await transaction
      .request()
      .query(
        sql`SELECT TOP 1 1 FROM ${tabla} WHERE ${Object.keys(campos)
          .map((key) => sql`${key} = @${key}`)
          .join(" AND ")}`
      );

    if (existeRegistro.recordset.length > 0) {
      throw new Error(`El registro ya existe en la tabla ${tabla}.`);
    }

    // Realiza la inserción utilizando parámetros
    const request = transaction.request();
    Object.keys(campos).forEach((key) => {
      request.input(key, campos[key]);
    });

    const result = await request.query(
      sql`INSERT INTO ${tabla} (${Object.keys(campos).join(", ")}) VALUES (${Object.keys(campos).map((key) => `@${key}`).join(", ")}); SELECT SCOPE_IDENTITY() AS codigo`
    );

    await transaction.commit();
    return result.recordset[0].codigo;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


