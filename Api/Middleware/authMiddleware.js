import jwt from 'jsonwebtoken';
import config from '../../Config/config';
import { promisify } from 'util';
import { getConnection, sql } from '../models/connection';

import { verifyToken} from '../Middleware/MiddlewareJWT';
import * as UsuarioModel from '../models/ConsultaUsuario';



export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        
      
        const decodificada = await verifyToken(req.cookies.jwt);
  
        const pool = await getConnection();
  
        try {
          const result = await pool
            .request()
            .input('id', sql.Int, decodificada.id)
            .query('SELECT * FROM USUARIO WHERE IdUsuario = @id');
  
            if (result.recordset.length === 1) {
              // Obtén más detalles del usuario utilizando la función obtenerNombreUsuarioYRol
              const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(result.recordset[0].LoginUsuario);
    
              res.locals.userData = {
                Nombres: detallesUsuario.NombresUsuario || 'Usuario no autenticado',
                Apellidos: detallesUsuario.Apellidos || 'Apellidos por defecto',
                NombreRol: detallesUsuario.NombreRol || 'Rol por defecto',
                IdRol: detallesUsuario.IdRol || 'Id rol por defecto',
                IdUsuario: detallesUsuario.IdUsuario || 'Id IdUsuario por defecto',
                ID_Empleado:  detallesUsuario.ID_Empleado || 'Id Empleado por defecto',
                NombreEmpleado:  detallesUsuario.NombreEmpleado || 'NombreEmpleado por defecto',
              };
              req.user = res.locals.userData; // Asegúrate de establecer req.user correctamente
 console.log('req.user ',req.user );
            return next(); // Usuario autenticado correctamente
          }
        } catch (error) {
          console.error('Error en la consulta SQL:', error);
          res.json({ msg: "Size deactivated successfully" });
        }
      } catch (error) {
        console.log(error);
        res.json({ msg: "Size deactivated successfully" });
      }
    } else {
      return res.redirect('/'); // Si no se encontró un token JWT en las cookies, redirige al usuario a la página de inicio de sesión
    }
    // No cierras la conexión aquí
  };
  
 
  export const checkAccess = async (req, res, next) => {
    let pool;
    try {


      // Verifica si el usuario está autenticado
      if (!req.user) {
        return res.status(403).json({ error: 'Acceso denegado. Usuario no autenticado' });
      }
  
      // Obtiene la ruta actual
      const currentPath = (req.path || '').toLowerCase();
      console.log('currentPath', currentPath);
  
      // Consulta la configuración de acceso desde la base de datos
      const routeConfig = await getRouteConfig(currentPath);
      console.log('routeConfig', routeConfig);
 
      if (!routeConfig) {
        return res.status(403).json({ error: 'Ruta no encontrada' });
      }
  
      const { IdRecurso, IdAccion,Ruta } = routeConfig;
      const user = req.user; // Objeto del usuario que incluye el rol
      console.log('IdRecurso', IdRecurso);
      console.log('IdAccion', IdAccion);
      console.log('user', user);
      console.log('IdRol', user.IdRol);
         // Obtiene las rutas permitidas para el usuario
    const allowedRoutes = await getRoutesByUserId(user.IdUsuario);
    console.log('Rutas permitidas:', allowedRoutes);
    const allowedActions = await   getActionsByUserId(user.IdUsuario)
      // Normaliza las rutas antes de la comparación
      const normalizedCurrentPath = currentPath.replace(/\\/g, '/');
      const normalizedDbPath = Ruta.replace(/\\/g, '/').toLowerCase();
      console.log('normalizedDbPath', normalizedDbPath);
  
      // Verifica si la ruta de la vista actual está en la configuración de acceso
      if (normalizedDbPath !== normalizedCurrentPath) {
        return res.status(403).json({ error: 'Acceso denegado. Ruta no permitida' });
      }
  
      // Verifica si el usuario tiene acceso al recurso y rol
      const hasAccess = await hasUserAccess(user, IdRecurso,IdAccion);
      console.log('hasAccess', hasAccess);
  
      if (hasAccess > 0) {
        // Agrega la información de rutas permitidas a res.locals
        // Agrega la información de rutas permitidas a res.locals
      res.locals.allowedRoutes = allowedRoutes;
      res.locals.allowedActions =allowedActions;
        console.log('acciones  permitidas:',  res.locals.allowedActions); // Imprime la información
        next(); // El usuario tiene acceso al recurso y rol
      } else {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    } catch (error) {
      console.error('Error en el middleware de autorización:', error);
  
      // Maneja el error y envía una respuesta adecuada
      return res.status(500).json({ error: 'Error en el servidor' });
    } finally {
      // Cierra la conexión de la base de datos en caso de que se haya abierto
      if (pool) {
        try {
          await pool.close();
        } catch (error) {
          console.error('Error al cerrar la conexión de la base de datos:', error.message);
        }
      }
    }
  };
  
  
  
  // Función para obtener la configuración de ruta desde la base de datos
  const getRouteConfig = async (ruta) => {
    let pool;
    try {
      pool = await getConnection();
      const result = await pool
        .request()
        .input('ruta', sql.NVarChar, ruta)
        .query(`
        SELECT TOP 1
        CA.IdRecurso, 
        R.NombreRecurso,
        CA.IdAccion, 
        A.NombreAccion,
        CA.IdRol,
        C.NombreRol,
        R.Ruta 
      FROM 
        ConfiguracionAcceso CA
        INNER JOIN Recursos R ON CA.IdRecurso = R.IdRecurso
        INNER JOIN Acciones A ON CA.IdAccion = A.IdAccion
        INNER JOIN Roles C ON CA.IdRol = C.IdRol where R.Ruta  = @ruta;
        `);
  
      const routeConfig = result.recordset[0];
  
      if (!routeConfig) {
        console.error('Configuración de ruta no encontrada.');
        return null;
      }
  
      console.log('Ruta encontrada:', routeConfig);
      return routeConfig;
    } catch (error) {
      console.error('Error al obtener la configuración de ruta:', error);
      throw error;
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };
  

  
  // Función para verificar el acceso del usuario en la base de datos
const hasUserAccess = async (user, IdRecurso, IdAccion) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input('userId', sql.Int, user.IdUsuario)
      .input('IdRecurso', sql.Int, IdRecurso)
      .input('IdAccion', sql.Int, IdAccion)
      .input('IdRol', sql.Int, user.IdRol)
      .query('SELECT COUNT(*) AS accessCount FROM ConfiguracionAcceso WHERE IdRol = @IdRol AND IdRecurso = @IdRecurso AND IdAccion = @IdAccion');
    console.log('result', result);
    return result.recordset[0].accessCount > 0;

  } catch (error) {
    console.error('Error al verificar el acceso del usuario:', error);
    throw error;
  } finally {
    // Cierra la conexión de la base de datos en caso de que se haya abierto
    if (pool) {
      await pool.close();
    }
  }
};

 
  export const getRoutesByUserId = async (userId) => {
    let pool;
    try {
      pool = await getConnection();
  
      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .query(`
          
SELECT
R.NombreRol,
A.NombreAccion,
Rec.NombreRecurso,
Rec.Ruta
FROM
USUARIO U
JOIN Roles R ON U.IdRol = R.IdRol
JOIN ConfiguracionAcceso RA ON U.IdRol = RA.IdRol
JOIN Acciones A ON RA.IdAccion = A.IdAccion
JOIN Recursos Rec ON RA.IdRecurso = Rec.IdRecurso
WHERE
U.IdUsuario = @userId;

        `);
  
      return result.recordset.map((row) => row.Ruta);
    } catch (error) {
      console.error('Error al obtener las rutas por IdUsuario:', error);
      throw error;
    } finally {
      if (pool) {
        try {
          await pool.close();
        } catch (error) {
          console.error('Error al cerrar la conexión de la base de datos:', error.message);
        }
      }
    }
  };



  // Función para obtener las acciones permitidas para un usuario
export const getActionsByUserId = async (userId) => {
  let pool;
  try {
    pool = await getConnection();

    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT
          R.NombreRol,
          A.NombreAccion,
          Rec.NombreRecurso,
          Rec.Ruta
        FROM
          USUARIO U
          JOIN Roles R ON U.IdRol = R.IdRol
          JOIN ConfiguracionAcceso RA ON U.IdRol = RA.IdRol
          JOIN Acciones A ON RA.IdAccion = A.IdAccion
          JOIN Recursos Rec ON RA.IdRecurso = Rec.IdRecurso
        WHERE
          U.IdUsuario = @userId;
      `);

    return result.recordset.map((row) => ({
      Accion: row.NombreAccion,
    }));
  } catch (error) {
    console.error('Error al obtener las acciones por IdUsuario:', error);
    throw error;
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (error) {
        console.error('Error al cerrar la conexión de la base de datos:', error.message);
      }
    }
  }
};