import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit-table';
import base64Img from 'image-to-base64'; // Asegúrate de haber instalado el paquete con 'npm install image-to-base64'
import * as CompraModel from '../models/ColsultaCompra';
import * as ConfiguracionModel from '../models/ConsultaConfiguraciones';
import os from 'os';
import svgToPdfKit from 'svg-to-pdfkit';

export async function generatePDF(codigoCompra, response) {
    try {
        // Obtener los datos de la compra usando la función en tu controlador
        const result = await obtenerDetallesCompraPorCodigo(codigoCompra);
        console.log('result:', result);

        // Obtener la configuración del local
        const configuraciones = await ConfiguracionModel.mostrarConfiguraciones();
        const localInfo = configuraciones[0]; // Suponiendo que solo hay una configuración activa
        console.log('localInfo:', localInfo);

        // Verificar si se obtuvo la información de la compra
        if (result !== undefined && result !== null && result.length > 0) {
            // Se encontraron datos en el array, proceder con la creación del PDF
            const compras = result;
            console.log('compras:', compras);

            // Definir la ruta donde se guardará el archivo PDF
            const fileName = `factura_${codigoCompra}.pdf`;
            const filePath = path.join('D:', 'Downloads', fileName);
           
    



            // Crear un nuevo documento PDF
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            // Ajusta según sea necesario
const espacioEntreElementos = 10;


// Dibujar una línea vertical
doc.moveTo(20, 5) // Mover a punto inicial (x, y)
    .lineTo(20, 900) // Dibujar línea vertical hasta punto final (misma x, diferente y)
    .stroke(); // Dibujar la línea



// Dibujar una línea vertical
doc.moveTo(20, 0) // Mover a punto inicial (x, y)
    .lineTo(20, 900) // Dibujar línea vertical hasta punto final (misma x, diferente y)
    .stroke(); // Dibujar la línea



// Dibujar una línea vertical
doc.moveTo(570, 0) // Mover a punto inicial (x, y)
    .lineTo(570, 900) // Dibujar línea vertical hasta punto final (misma x, diferente y)
    .stroke(); // Dibujar la línea

    // Dibujar una línea vertical
doc.moveTo(420, 0) // Mover a punto inicial (x, y)
.lineTo(420, 170) // Dibujar línea vertical hasta punto final (misma x, diferente y)
.stroke(); // Dibujar la línea

// Dibujar una línea horizontal
doc.moveTo(20, 170) // Mover a punto inicial (x, y)
    .lineTo(570, 170) // Dibujar línea horizontal hasta punto final (diferente x, misma y)
    .stroke(); // Dibujar la línea

if (localInfo.LogoLocal) {
    const logoBase64 = await getBase64Image(localInfo.LogoLocal);
    const logoWidth = 100;
    const logoHeight = 100;
    const logoX = 450; // Ajusta según sea necesario
const logoY =15; // Ajusta según sea necesario
// Ajustar la posición vertical del logo para alinear con el texto

doc.image(logoBase64, logoX, logoY, { width: logoWidth, height: logoHeight });



} else {
    console.warn('La propiedad LogoLocal no está definida en localInfo.');
}
// Nombre del Local
const localNameX = 430; // Ajusta según sea necesario
const localNameY =150; // Ajusta según sea necesario
doc.fontSize(20).fillColor('000000').text(`${localInfo.NombreNegocio}`, localNameX, localNameY);

            // Añadir espaciado 
            doc.moveDown();
            
            // Logo del Local
        // Logo a la izquierda

            
            // Información de la compra
            const fechaCompra = new Date(compras[0].FechaCompra);
            const fechaFormateada = `${fechaCompra.getFullYear()}-${(fechaCompra.getMonth() + 1).toString().padStart(2, '0')}-${fechaCompra.getDate().toString().padStart(2, '0')}`;
            
            // Texto a la izquierda
            const textX = doc.page.margins.left;
            const textY = doc.y + -160; // Ajusta la posición vertical manualmente
            
            doc.fontSize(16).fillColor('000000').text(`Código de la Compra: ${compras[0].CodigoCompra}`, textX, textY);
            doc.fontSize(16).fillColor('000000').text(`Fecha de la Compra: ${fechaFormateada}`, textX, textY + 20);
            doc.fontSize(16).fillColor('000000').text(`Estado de la Compra: ${compras[0].EstadoCompra}`, textX, textY + 40);
            doc.fontSize(16).fillColor('000000').text(`Empleado: ${compras[0].NombreEmpleado}`, textX, textY + 60);
            doc.fontSize(16).fillColor('000000').text(`Total General: ${compras[0].TotalGeneral}`, textX, textY + 80);
            // Añadir espaciado entre las dos tablas
            doc.moveDown(3);

            const table = {
                title: 'Detalles de la Compra',
                headers: [
                    { label: 'Producto', property: 'Nombre', width: 50, align: 'center', renderer: null },
                    { label: 'Proveedor', property: 'NombreProveedor', width: 70, align: 'center', renderer: null },
                    { label: 'Bodega', property: 'NombreBodega', width: 60, align: 'center', renderer: null },
                    { label: 'Cantidad', property: 'Cantidad', width: 53, align: 'center', renderer: null },
                    { label: 'P.Compra', property: 'PrecioCompra', width: 50, align: 'center', renderer: null },
                    { label: 'Descuento', property: 'Descuento', width: 50, align: 'center', renderer: null },
                    { label: 'Total', property: 'Total', width: 50, align: 'center', renderer: null },
                    { label: 'Subtotal', property: 'Subtotal', width: 50, align: 'center', renderer: null },
                    { label: 'IVA', property: 'IVA', width: 50, align: 'center', renderer: null },
                ],
                datas: [],
                rows: []
            };

            // Llenar la tabla con los datos de cada compra
            for (const compra of compras) {
                table.datas.push({
                    Nombre: compra.Nombre,
                    NombreProveedor: compra.NombreProveedor,
                    NombreBodega: compra.NombreBodega,
                    Cantidad: compra.Cantidad,
                    PrecioCompra: compra.PrecioCompra,
                    Descuento: compra.Descuento,
                    Total: compra.Total,
                    Subtotal: compra.Subtotal,
                    IVA: compra.IVA
                });
            }

            // La magia (async/await)
            await doc.table(table, {
                autoSize: false,
                prepareHeader: () => doc.fontSize(10).fillColor('000000'),
            });

            // Añadir espaciado entre las dos tablas
            doc.moveDown(3); // Ajusta el valor según la cantidad de espacio que desees

            // Crear otra tabla con sus propios datos
            const table2 = {
                title: 'Detalles de Cada producto',
                headers: [
                    // Define los encabezados de la segunda tabla
                    { label: 'Marca', property: 'NombreMarca', width: 50, renderer: null },
                    { label: 'Talla', property: 'NombreTalla', width: 50, renderer: null },
                    { label: 'Color', property: 'NombreColor', width: 50, renderer: null },
                    { label: 'Material', property: 'NombreMaterial', width: 50, renderer: null },
                ],
                datas: [],
                rows: []
            };

            // Llenar la segunda tabla con sus propios datos
            for (const compra of compras) {
                table2.datas.push({
                    // Define los datos de la segunda tabla
                    NombreMarca: compra.NombreMarca,
                    NombreTalla: compra.NombreTalla,
                    NombreColor: compra.NombreColor,
                    NombreMaterial: compra.NombreMaterial
                });
            }

            // La magia (async/await)
            await doc.table(table2, {
                autoSize: false,
                prepareHeader: () => doc.fontSize(10).fillColor('000000'),
           
            });


// Crear otra página

if (doc.y + espacioEntreElementos + 80 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
}

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
async function obtenerDetallesCompraPorCodigo(codigoCompra) {
    // Implementa la lógica para obtener detalles de la compra por el código
    // Asegúrate de importar y usar CompraModel adecuadamente
    return await CompraModel.ObtenerDatosParaEditar(codigoCompra);
}

// Función para convertir base64 a imagen temporal
async function getBase64Image(imageBuffer) {
    const tempFilePath = path.join(os.tmpdir(), 'temp_image.png');

    return new Promise((resolve, reject) => {
        // Guarda el buffer en un archivo temporal
        fs.writeFile(tempFilePath, imageBuffer, (writeErr) => {
            if (writeErr) {
                reject(writeErr);
                return;
            }

            // Lee la imagen desde el archivo temporal y conviértela a base64
            const data = fs.readFileSync(tempFilePath, 'base64');
            resolve(`data:image/png;base64,${data}`);

            // Elimina el archivo temporal después de convertir a base64
            fs.unlinkSync(tempFilePath);
        });
    });
}
