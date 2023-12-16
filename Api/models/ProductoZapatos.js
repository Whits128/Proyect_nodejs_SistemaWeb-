// connection.js - Asumiendo que ya tienes este archivo configurado
import { getConnection, sql } from "./connection";

// productModel.js - Nuevo archivo para el modelo de Productos_Zapatos
import Joi from 'joi';

// Función para mostrar todos los productos
export const mostrarProductos = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT  PZ.[ID_ProductoZapatos] as Codigo,PZ.Nombre as Nombre,PZ.Descripcion as Descripcion,C.Nombre as Categoria, PZ.Estado as Estado FROM Productos_Zapatos PZ JOIN Categorias C ON PZ.ID_Categoria = C.ID_Categoria WHERE  pz.Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

// Función para agregar un nuevo producto
export const agregarProducto = async (nombre, descripcion, idCategoria, estado) => {
    try {
      // Validación de datos con Joi
      const schema = Joi.object({
        nombre: Joi.string().required().messages({
          'any.required': 'El nombre es obligatorio.',
          'string.empty': 'El nombre no puede estar vacío.',
        }),
        descripcion: Joi.string().messages({
          'string.empty': 'La descripción no puede estar vacía.',
        }),
        idCategoria: Joi.number().integer().positive().required().messages({
          'any.required': 'El ID de la categoría es obligatorio.',
          'number.base': 'El ID de la categoría debe ser un número.',
          'number.integer': 'El ID de la categoría debe ser un número entero.',
          'number.positive': 'El ID de la categoría debe ser un número positivo.',
        }),
        estado: Joi.string().valid('Activo', 'Inactivo').default('Activo').messages({
          'any.only': 'El estado debe ser "Activo" o "Inactivo".',
        }),
      });
  
      const validationResult = schema.validate({ nombre, descripcion, idCategoria, estado });
  
      if (validationResult.error) {
        throw new Error(validationResult.error.details[0].message);
      }
  
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('nombre', sql.NVarChar(100), nombre)
        .input('descripcion', sql.NVarChar(sql.MAX), descripcion)
        .input('idCategoria', sql.Int, idCategoria)
        .input('estado', sql.NVarChar(50), estado)
        .query('INSERT INTO Productos_Zapatos (Nombre, Descripcion, ID_Categoria, Estado) VALUES (@nombre, @descripcion, @idCategoria, @estado); SELECT SCOPE_IDENTITY() AS Codigo');
  
      return result.recordset[0].Codigo;
    } catch (error) {
      throw error;
    }
  };
  
  // Función para actualizar un producto existente
  export const actualizarProducto = async (codigo, nombre, descripcion, idCategoria, estado) => {
    try {
      // Validación de datos con Joi
      const schema = Joi.object({
        codigo: Joi.number().integer().positive().required().messages({
          'any.required': 'El ID es obligatorio.',
          'number.base': 'El ID debe ser un número entero.',
          'number.integer': 'El ID debe ser un número entero.',
          'number.positive': 'El ID debe ser un número positivo.',
        }),
        nombre: Joi.string().required().messages({
          'any.required': 'El nombre es obligatorio.',
          'string.empty': 'El nombre no puede estar vacío.',
        }),
        descripcion: Joi.string().messages({
          'string.empty': 'La descripción no puede estar vacía.',
        }),
        idCategoria: Joi.number().integer().positive().required().messages({
          'any.required': 'El ID de la categoría es obligatorio.',
          'number.base': 'El ID de la categoría debe ser un número.',
          'number.integer': 'El ID de la categoría debe ser un número entero.',
          'number.positive': 'El ID de la categoría debe ser un número positivo.',
        }),
        estado: Joi.string().valid('Activo', 'Inactivo').default('Activo').messages({
          'any.only': 'El estado debe ser "Activo" o "Inactivo".',
        }),
      });
  
      const validationResult = schema.validate({ codigo, nombre, descripcion, idCategoria, estado });
  
      if (validationResult.error) {
        throw new Error(validationResult.error.details[0].message);
      }
  
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('codigo', sql.Int, codigo)
        .input('nombre', sql.NVarChar(100), nombre)
        .input('descripcion', sql.NVarChar(sql.MAX), descripcion)
        .input('idCategoria', sql.Int, idCategoria)
        .input('estado', sql.NVarChar(50), estado)
        .query('UPDATE Productos_Zapatos SET Nombre = @nombre, Descripcion = @descripcion, ID_Categoria = @idCategoria, Estado = @estado WHERE ID_ProductoZapatos = @codigo');
  
      if (result.rowsAffected[0] === 0) {
        throw new Error('La actualización no afectó a ninguna fila. ¿El ID proporcionado es válido?');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Función para dar de baja un producto
  export const darDeBajaProducto = async (codigo) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('codigo', codigo)
        .query('UPDATE Productos_Zapatos SET Estado = \'Inactivo\' WHERE ID_ProductoZapatos = @codigo');
  
      if (result.rowsAffected[0] === 0) {
        throw new Error('No se pudo dar de baja el producto. ¿El ID proporcionado es válido?');
      }
    } catch (error) {
      throw error;
    }
  };
  
// Función para activar un producto
export const activarProducto = async (codigo) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Productos_Zapatos SET Estado = \'Activo\' WHERE ID_ProductoZapatos = @codigo');

    if (result.rowsAffected[0] === 0) {
      throw new Error('No se pudo activar el producto. ¿El ID proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};
