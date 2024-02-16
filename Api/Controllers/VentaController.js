import * as VentasModel from '../models/ConsultaVenta';
import * as factura from '../Controllers/GeneradorFacturaVenta'
export const renderVentasPage = async (req, res) => {
    try {  
      // Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;

      res.render('MtlVentas.ejs', { pageTitle: 'Ventas',user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const renderDevolucionVPage = async (req, res) => {
    try {  
        // Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;


      res.render('MtlDevolucionVenta.ejs',{ pageTitle: 'Devolucion'});
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const renderDevolucionRegistrarPage = async (req, res) => {
    try {  
        // Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;

// En la ruta de devoluciones
const codigo = req.query.codigoVenta;
const detalelventa = await VentasModel.ObtenerDatosVenta(codigo);
console.log('detalelventa',detalelventa);
// Ahora puedes utilizar el código de la venta en tu lógica de devoluciones
console.log("codigoVenta",codigo);
      res.render('MtlIngresarDevolucionV.ejs',{ pageTitle: 'Registrar Devolucion ',user ,codigo,detalelventa});
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  
  export const GetVentas = async (req, res) => {
    try {
      const venta = await VentasModel.mostrarVentas();
      res.json(venta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const GetDevolucion = async (req, res) => {
    try {
      const dev = await VentasModel.mostrarDevolucion();
      res.json(dev);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const GetNotacredito = async (req, res) => {
    const codigo = req.params.id;
    try {
      const Nota = await VentasModel.mostrarNotaCredito(codigo);
      res.json(Nota);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const crearVenta = async (req, res) => {
    try {
        // Recuperar los datos de la solicitud
        const { CodigoVenta, FechaVenta, EstadoVenta, Total,Subtotal ,IVA, DetallesVenta, CodigoNotaCredito } = req.body;

        // Validar datos antes de procesar
        const ventas = await VentasModel.mostrarVentas();
        const ventaExistente = ventas.find(
            (v) => v.CodigoVenta.toLowerCase() === CodigoVenta.toLowerCase()
        );

        if (ventaExistente) {
            return res.status(400).json({ error: 'Ya existe una venta con este Código.' });
        }

        if (!CodigoVenta || !FechaVenta || !EstadoVenta || !Total || !DetallesVenta || !DetallesVenta.length) {
            return res.status(400).json({ success: false, error: 'Datos de venta incompletos o incorrectos.' });
        }

        // Transformar el objeto de detalles a formato XML
        const detallesXml = `<DetallesVenta>${DetallesVenta.map(detalle => `
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
            </Detalle>`).join('')}</DetallesVenta>`;

        // Imprimir los datos antes de la ejecución
        console.log('Datos que se enviarán al servidor:', req.body);
        // Imprimir el XML
        console.log('XML que se enviará al servidor:', detallesXml);

        // Llamar a la función del modelo para guardar la venta
        const result = await VentasModel.gestionarVenta({
            CodigoVenta,
            FechaVenta,
            EstadoVenta,
            Subtotal,
            IVA,
            Total,
            DetallesVenta,
            CodigoNotaCredito,
        });

        // Enviar una respuesta al cliente según el resultado
        res.json({ success: true, result });
    } catch (error) {
        // Manejar errores y enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al crear la venta.' });
    }
};



export const DevolucionVenta = async (req, res) => {
  try {
    // Obtener datos de la solicitud (puedes usar el body-parser u otra middleware)
    const { CodigoVenta, ID_Empleado, Fecha, DetalleDevolucion } = req.body;

    // Validar los datos necesarios
    if (!CodigoVenta || !ID_Empleado || !Fecha || !DetalleDevolucion) {
      return res.status(400).json({ error: "Datos de devolución incompletos o incorrectos." });
    }

 // Transformar el objeto de detalles a formato XML
 const detallesDevolucionXml = `<DetalleDevolucion>${DetalleDevolucion.map(detalle => {
  return `
    <Detalle>
      <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
      <CantidadDevuelta>${detalle.CantidadDevuelta}</CantidadDevuelta>
      <Motivo>${detalle.Motivo}</Motivo>
    </Detalle>`;
}).join('')}</DetalleDevolucion>`;

  // Imprimir los datos antes de la ejecución
console.log('Datos que se enviarán al servidor:', detallesDevolucionXml);
  
 

    // Parámetros para la devolución
    const devolucionParams = {
      CodigoVenta,
      DetalleDevolucion, // Ajuste de nombre del parámetro para que coincida con el modelo
      ID_Empleado,
      Fecha,
    };

    // Procesar devolución utilizando la función del modelo
    const resultadoDevolucion = await VentasModel.procesarDevolucionVenta(devolucionParams);

   // Enviar respuesta exitosa
   return res.status(200).json({
    success: true,
    mensaje: 'Devolución procesada correctamente',
    datosEnviados: resultadoDevolucion.datosEnviados,
  });  } catch (error) {
    // Manejar errores y enviar respuesta de error
    console.error(`Error al procesar devolución: ${error.message}`);
    return res.status(500).json({ error: "Error al procesar devolución" });
  }
};





export const ObtenerDetallesVentaaPorCodigo= async (req, res) => {
  try {
 
    const codigo = req.params.id;

    const result = await VentasModel.ObtenerDatosVenta(codigo);

  // Enviar una respuesta al cliente según el resultado
  res.json(result);

  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener detalle venta.' });
  }
};


export const generarFactura = async (req, res) => {
  const codigoventa = req.params.id;

  try {
    // Llamar a la función para generar el PDF
    await factura.generatePDF(codigoventa, res);
  } catch (error) {
    // Manejar errores de la llamada a la función generatePDF
    console.error('Error al generar la factura:', error);
    res.status(500).json({ success: false, error: 'Error al generar la factura.' });
  }
};
