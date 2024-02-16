import { getConnection, sql } from "../models/connection";
export const mostrarVentas = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query('SELECT ID_Venta as Codigo, CodigoVenta, Fecha, Total, Estado FROM Ventas');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener las compras: ${error.message}`);
    }
  };
  export const mostrarNotaCredito = async (codigoNotaCredito) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('CodigoNotaCredito', sql.NVarChar, codigoNotaCredito)
            .query(`SELECT *
                    FROM VistaNotasCredito
                    WHERE CodigoNotaCredito = @CodigoNotaCredito`);
        return result.recordset;
    } catch (error) {
        throw new Error(`Error al obtener las compras: ${error.message}`);
    }
};


  export const mostrarDevolucion = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query('SELECT * FROM VistaDevolucionesConNotaCredito;');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener las compras: ${error.message}`);
    }
  };


  export const gestionarVenta = async (params) => {
    try {
      if (!params.CodigoVenta || !params.FechaVenta || !params.Total || !params.DetallesVenta || !params.DetallesVenta.length) {
        throw new Error('Datos de venta incompletos o incorrectos.');
      }
  
      const detallesXml = `<DetallesVenta>${params.DetallesVenta.map(detalle => {
        return `
          <Detalle>
            <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
            <ID_Empleado>${detalle.ID_Empleado}</ID_Empleado>
            <PrecioVenta>${detalle.PrecioVenta}</PrecioVenta>
            <Cantidad>${detalle.Cantidad}</Cantidad>
            <Descuento>${detalle.Descuento}</Descuento>
            <Total>${detalle.Total}</Total>
            <Subtotal>${detalle.Subtotal}</Subtotal>
            <IVA>${detalle.IVA}</IVA>
            <Fecha>${detalle.Fecha}</Fecha>
          </Detalle>`;
      }).join('')}</DetallesVenta>`;
  
      // Imprimir los datos antes de la ejecución
      console.log('Datos que se enviarán al servidor:', params);
      // Imprimir el XML
      console.log('XML que se enviará al servidor:', detallesXml);
  
      const pool = await getConnection();
      const result = await pool.request()
        .input('CodigoVenta', sql.NVarChar(100), params.CodigoVenta)
        .input('FechaVenta', sql.Date, params.FechaVenta)
        .input('EstadoVenta', sql.NVarChar(50), params.EstadoVenta)
        .input('Subtotal', sql.Decimal(10, 2), params.Subtotal)  // Usar params.Subtotal en lugar de params.Total
        .input('IVA', sql.Decimal(10, 2), params.IVA)  // Usar params.IVA en lugar de params.Total
        .input('Total', sql.Decimal(10, 2), params.Total)
        .input('DetallesVenta', sql.Xml, detallesXml)// Permitir que CodigoNotaCredito sea nulo si existe en los parámetros
        .input('CodigoNotaCredito', sql.NVarChar(100), params.CodigoNotaCredito ? params.CodigoNotaCredito : null)
        .execute('GestionarVenta');
  
      // Obtener el código de venta recién insertado
      const codigoVentaInsertado = params.CodigoVenta;
  
      // Retornar el objeto con el código de venta
      return {
        codigoVenta: codigoVentaInsertado,
        resultado: result,
        datosEnviados: params,
      };
    } catch (error) {
      console.error(`Error al ejecutar gestionarVenta: ${error.message}`);
      throw error;
    }
  };
  

  export const procesarDevolucionVenta = async (params) => {
    try {
      const pool = await getConnection();
  
          // Transformar el objeto de detalles a formato XML
          const detallesDevolucionXml = `<DetalleDevolucion>${params.DetalleDevolucion.map(detalle => {
            return `
              <Detalle>
                <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
                <CantidadDevuelta>${detalle.CantidadDevuelta}</CantidadDevuelta>
                <Motivo>${detalle.Motivo}</Motivo>
              </Detalle>`;
          }).join('')}</DetalleDevolucion>`;
          
            // Imprimir los datos antes de la ejecución
      console.log('Datos que se enviarán al servidor:', params);
      // Imprimir el XML
      console.log('XML que se enviará al servidor:', detallesDevolucionXml);
      const result = await pool
        .request()
        .input("CodigoVenta", sql.NVarChar(100), params.CodigoVenta)
        .input("DetalleDevolucion", sql.Xml, detallesDevolucionXml) // Ajuste para el nuevo parámetro
        .input("ID_Empleado", sql.Int, params.ID_Empleado)
        .input("Fecha", sql.Date, params.Fecha)
        .execute("ProcesoDevolucionVenta");
  
      return result;
    } catch (error) {
      console.error(`Error al ejecutar procesarDevolucionVenta: ${error.message}`);
      throw error;
    }
  };
  
  export const gestionarDevolucion = async (params) => {
    try {
      if (!params.CodigoVenta || !params.DetalleDevolucion || !params.ID_Empleado || !params.Fecha) {
        throw new Error('Datos de devolución incompletos o incorrectos.');
      }
  
      // Imprimir los datos antes de la ejecución
      console.log('Datos que se enviarán al servidor:', params);
  
      const pool = await getConnection();
      const result = await pool.request()
        .input('CodigoVenta', sql.NVarChar(100), params.CodigoVenta)
        .input('DetalleDevolucion', sql.Xml, params.DetalleDevolucion)
        .input('ID_Empleado', sql.Int, params.ID_Empleado)
        .input('Fecha', sql.Date, params.Fecha)
        .execute('ProcesoDevolucionVenta');
  
    
  
      // Retornar el objeto con el código de nota de crédito
      return {
        resultado: result,
        datosEnviados: params,
      };
    } catch (error) {
      console.error(`Error al ejecutar gestionarDevolucion: ${error.message}`);
      throw error;
    }
  };
  



  export const ObtenerDatosVenta = async (Codigo) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('CodigoVenta', Codigo) // Asegúrate de pasar el código aquí
        .execute('ObtenerDetallesVentaPorCodigo'); // Cambié el método .query() por .execute()
  console
      return result.recordset;

    } catch (error) {
      throw new Error(`Error al obtener detalles de Venta: ${error.message}`);
    }
  };