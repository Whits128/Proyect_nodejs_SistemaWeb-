// modeloConfiguracion.js

import { getConnection } from "../models/connection";
import fs from 'fs';

export const mostrarConfiguraciones = async () => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT PKConfiguraciones as Codigo, NombreNegocio, LogoLocal, RUC, Telefonos, Correo, Direccion, Estado, FechaModificacion, UsuarioModificacion, TipoOperacion FROM Configuraciones ');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };


  