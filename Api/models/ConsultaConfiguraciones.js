// modeloConfiguracion.js

import { getConnection } from "../models/connection";
import fs from 'fs';

export const mostrarConfiguraciones = async () => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT PKConfiguraciones as Codigo, NombreNegocio, LogoLocal, RUC, Telefonos, Correo, Direccion, Estado, FechaModificacion, UsuarioModificacion, TipoOperacion FROM Configuraciones WHERE Estado = \'Activo\'');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };

  export const mostrarhistorial = async () => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT H.PKHistorial, C.NombreNegocio AS NombreLocal, H.ColumnaModificada,  H.ValorAntiguo, H.ValorNuevo, H.FechaModificacion, H.UsuarioModificacion, H.TipoOperacion FROM HistorialConfiguraciones H JOIN  Configuraciones C ON H.FKConfiguraciones = C.PKConfiguraciones; ');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };
  export const obtenerConfiguracionPorId = async (id) => {
    try {
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input('PKConfiguraciones', sql.Int, id)
        .query('SELECT * FROM Configuraciones WHERE PKConfiguraciones = @PKConfiguraciones');
  
      // Supongo que obtienes una fila de resultados, puedes ajustar esto según tu estructura de base de datos
      const configuracion = result.recordset[0];
  
      return configuracion;
    } catch (error) {
      throw new Error(`Error al obtener la configuración por ID: ${error.message}`);
    }
  };