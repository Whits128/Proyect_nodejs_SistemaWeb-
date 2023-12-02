
import { getConnection ,sql} from "./connection";
import Joi from 'joi';
export const mostrarRoles = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdRol as Codigo, NombreRol as Nombre FROM Roles ');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};
export const mostrarRecurso = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('select IdRecurso as Codigo,NombreRecurso  from Recursos');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};



export const mostrarConfiguracionesAcceso = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`
        SELECT
          ca.IdConfiguracion as Codigo,
          ca.Ruta,
          r.NombreRecurso,
          rol.NombreRol,
          ca.IdRecurso,
          ca.IdRol
        FROM
          ConfiguracionAcceso ca
          JOIN Recursos r ON ca.IdRecurso = r.IdRecurso
          JOIN Roles rol ON ca.IdRol = rol.IdRol
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarConfiguracionAcceso = async (ruta, idRecurso, idRol) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      ruta: Joi.string().required().messages({
        'any.required': 'La ruta es obligatoria.',
        'string.empty': 'La ruta no puede estar vacía.',
      }),
      idRecurso: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del recurso es obligatorio.',
        'number.base': 'El ID del recurso debe ser un número.',
        'number.integer': 'El ID del recurso debe ser un número entero.',
        'number.positive': 'El ID del recurso debe ser un número positivo.',
      }),
      idRol: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del rol es obligatorio.',
        'number.base': 'El ID del rol debe ser un número.',
        'number.integer': 'El ID del rol debe ser un número entero.',
        'number.positive': 'El ID del rol debe ser un número positivo.',
      }),
    });

    const validationResult = schema.validate({ ruta, idRecurso, idRol });

    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la configuración de acceso ya existe
    const existingConfiguracion = await pool
      .request()
      .input('ruta', ruta)
      .query('SELECT TOP 1 1 FROM ConfiguracionAcceso WHERE Ruta = @ruta');

    if (existingConfiguracion.recordset.length > 0) {
      throw new Error('La configuración de acceso ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('ruta', sql.NVarChar(255), ruta)
      .input('idRecurso', sql.Int, idRecurso)
      .input('idRol', sql.Int, idRol)
      .query('INSERT INTO ConfiguracionAcceso (Ruta, IdRecurso, IdRol) VALUES (@ruta, @idRecurso, @idRol); SELECT SCOPE_IDENTITY() AS Codigo');

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarConfiguracionAcceso = async (codigo, ruta, idRecurso, idRol) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      codigo: Joi.number().integer().positive().required().messages({
        'any.required': 'El código es obligatorio.',
        'number.base': 'El código debe ser un número entero.',
        'number.integer': 'El código debe ser un número entero.',
        'number.positive': 'El código debe ser un número positivo.',
      }),
      ruta: Joi.string().required().messages({
        'any.required': 'La ruta es obligatoria.',
        'string.empty': 'La ruta no puede estar vacía.',
      }),
      idRecurso: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del recurso es obligatorio.',
        'number.base': 'El ID del recurso debe ser un número.',
        'number.integer': 'El ID del recurso debe ser un número entero.',
        'number.positive': 'El ID del recurso debe ser un número positivo.',
      }),
      idRol: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del rol es obligatorio.',
        'number.base': 'El ID del rol debe ser un número.',
        'number.integer': 'El ID del rol debe ser un número entero.',
        'number.positive': 'El ID del rol debe ser un número positivo.',
      }),
    });

    const validationResult = schema.validate({ codigo, ruta, idRecurso, idRol });

    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verificar si la configuración de acceso existe
    const existingConfiguracion = await pool
      .request()
      .input('codigo', codigo)
      .query('SELECT TOP 1 1 FROM ConfiguracionAcceso WHERE IdConfiguracion = @codigo');

    if (existingConfiguracion.recordset.length === 0) {
      throw new Error('La configuración de acceso no existe. ¿El código proporcionado es válido?');
    }

    // Realizar la actualización
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('ruta', sql.NVarChar(255), ruta)
      .input('idRecurso', sql.Int, idRecurso)
      .input('idRol', sql.Int, idRol)
      .query(`
        UPDATE ConfiguracionAcceso
        SET Ruta = @ruta, IdRecurso = @idRecurso, IdRol = @idRol
        WHERE IdConfiguracion = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};