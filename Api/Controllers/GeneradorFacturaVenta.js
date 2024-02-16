import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit-table';
import * as VentaModel from '../models/ConsultaVenta';
import * as ConfiguracionModel from '../models/ConsultaConfiguraciones';
import os from 'os';

export async function generatePDF(codigoVenta, response) {
    try {
        // Obtener los datos de la compra usando la función en tu controlador
        const result = await obtenerDetallesVentaPorCodigo(codigoVenta);
        console.log('result:', result);

        // Obtener la configuración del local
        const configuraciones = await ConfiguracionModel.mostrarConfiguraciones();
        const localInfo = configuraciones[0]; // Suponiendo que solo hay una configuración activa
        console.log('localInfo:', localInfo);

        // Verificar si se obtuvo la información de la compra
        if (result !== undefined && result !== null && result.length > 0) {
            // Se encontraron datos en el array, proceder con la creación del PDF
            const venta = result;
            console.log('venta:', venta);

            // Definir la ruta donde se guardará el archivo PDF
            const fileName = `factura_${codigoVenta}.pdf`;
            const filePath = path.join('D:', 'Downloads', fileName);

            // Crear un nuevo documento PDF
const doc = new PDFDocument({ margin: 10, size: [250, 460], autoFirstPage: false });

            // Agregar la primera página (necesario para que la tabla funcione correctamente)
            doc.addPage();

            // Configuración del documento en blanco y negro
            doc.fillColor('black');
            doc.strokeColor('black');

            // Contenido de la factura
            doc.fontSize(14).text(`${localInfo.NombreNegocio}`,{ align: 'center' });
            doc.moveDown(1);
            doc.fontSize(10).text(`Correo:${localInfo.Correo}`);
            doc.fontSize(10).text(`Direccion:${localInfo.Direccion}`);
            doc.fontSize(10).text(`Telefono:${localInfo.Telefonos}`);
            doc.text(`Fac-Venta - ${venta[0].CodigoVenta}`);
            doc.text(`Fecha: ${new Date(venta[0].Fecha).toLocaleDateString()}`);
            doc.moveDown();

            // Crear la tabla para mostrar los productos
            const table = {
                title: 'Detalles de la Compra',
                headers: [
                    { label: 'Producto', property: 'Nombre', width: 80, align: 'center', renderer: null },
                    { label: 'Precio', property: 'PrecioVenta', width: 40, align: 'center', renderer: null },
                    { label: 'Cantidad', property: 'Cantidad', width: 35, align: 'center', renderer: null },
                    { label: 'Total', property: 'Total', width: 50, align: 'center', renderer: null },
                ],
                datas: [],
                rows: []
            };

            // Llenar la tabla con los productos
            for (const venta of venta) {
                table.datas.push({
                    Nombre: venta.Nombre,
                    PrecioVenta: `C$${venta.PrecioVenta.toFixed(2)}`,
                    Cantidad: venta.Cantidad,
                    Total: `C$${venta.Total.toFixed(2)}`,
                });
            }

            // Ajustar la tabla para que ocupe todo el ancho del documento
          // Opciones para la tabla
const tableOptions = {
    prepareHeader: () => doc.fontSize(8).fillColor('black'),
 
};

            // Agregar la tabla al documento
            await doc.table(table, tableOptions);

            // Totales
            doc.moveDown();
            doc.fontSize(9).text(`Subtotal: C$${venta[0].SubtotalGeneral.toFixed(2)}`);
            doc.fontSize(9).text(`IVA (15%): C${venta[0].IvaGeneral.toFixed(2)}`);
            doc.fontSize(9).text(`Total General: C$${venta[0].TotalGeneral.toFixed(2)}`);
            doc.moveDown();

// Información de devolución
doc.moveDown();
doc.fontSize(9).text('**Política de Devolución:**', { bold: true,align: 'center', width: doc.page.width });
doc.moveDown(1);
doc.fontSize(9).text('1. **Productos Dañados:**');
doc.fontSize(9).text(' Devoluciones en 2 días desde la compra.', { indent: 20 });
doc.fontSize(9).text('2. **Cambio de Talla:** ');
doc.fontSize(9).text('Cambios en 4 días desde la compra.', { indent: 20 });
doc.fontSize(9).text('**Condiciones Generales:** ');
doc.fontSize(9).text('Presentar comprobante de compra.', { indent: 20 });
doc.fontSize(9).text(`Devoluciones por daño hasta: ${obtenerFechaLimiteDevolucion(venta[0].Fecha, 2)}`, { indent: 20 });
doc.fontSize(9).text(`Cambios de talla hasta: ${obtenerFechaLimiteDevolucion(venta[0].Fecha, 4)}`, { indent: 20 });
doc.fontSize(9).text('Para consultas, contáctenos.', { indent: 20 });



// Pie de página con el nombre del local
doc.fontSize(10).text(`© ${new Date().getFullYear()} ${localInfo.NombreNegocio}`, 10, doc.page.height - 23, {
    align: 'left',
});
            // Finalizar el documento y guardarlo en el archivo especificado
            const stream = doc.pipe(fs.createWriteStream(filePath));
            doc.end();

            // Esperar a que el stream se cierre antes de enviar la respuesta al cliente
            stream.on('finish', () => {
                console.log('Factura generada con éxito en:', filePath);
                response.download(filePath, (err) => {
                    if (err) {
                        console.error('Error al descargar el archivo:', err);
                        response.status(500).json({ success: false, error: 'Error al descargar el archivo.' });
                    } else {
                        console.log('Archivo descargado con éxito');
                        // Puedes eliminar el archivo después de que se ha descargado
                        fs.unlinkSync(filePath);
                    }
                });
            });

            return { success: true };
        } else {
            // Si no se encuentra la compra, enviar un mensaje de error
            console.error('Compra no encontrada.');
            return { success: false, error: 'Compra no encontrada.' };
        }
    } catch (error) {
        // Manejar errores y enviar una respuesta de error al cliente
        console.error(error);
        return { success: false, error: 'Error al generar la factura.' };
    }
}

// Función para obtener detalles de la compra
async function obtenerDetallesVentaPorCodigo(codigoVenta) {
    // Implementa la lógica para obtener detalles de la compra por el código
    // Asegúrate de importar y usar CompraModel adecuadamente
    return await VentaModel.ObtenerDatosVenta(codigoVenta);
}
// Función para obtener la fecha límite de devolución
function obtenerFechaLimiteDevolucion(fechaCompra, dias) {
    const fechaLimite = new Date(fechaCompra);
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    return fechaLimite.toLocaleDateString();
}