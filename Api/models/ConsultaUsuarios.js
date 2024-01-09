
import { getConnection } from "../models/connection";
import Joi from 'joi';
export const mostrarUsuarios = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdUsuario, Nombres, Apellidos, LoginUsuario, IdRol, Estado, FechaRegistroFROM USUARIO WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};