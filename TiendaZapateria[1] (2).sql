 -- Crear la base de datos
CREATE DATABASE TiendaZapateria;
GO

-- Utilizar la base de datos
USE TiendaZapateria;
GO
-- Tabla de Roles
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    NombreRol NVARCHAR(50) UNIQUE NOT NULL,
	 Estado NVARCHAR(50) DEFAULT 'Activo'
);
GO


-- Tabla de Usuarios
CREATE TABLE USUARIO (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombres VARCHAR(100),
    Apellidos VARCHAR(100),
    LoginUsuario VARCHAR(50),
    LoginClave VARCHAR(100),
    IdRol INT REFERENCES Roles(IdRol),
    Estado NVARCHAR(50) DEFAULT 'Activo',
    FechaRegistro DATETIME DEFAULT GETDATE(),
    NumSesiones INT DEFAULT 0,
    FechaInicioSesion DATETIME,
    FechaFinSesion DATETIME
);
GO


CREATE TABLE HistorialUsuario (
    PKHistorialUsuari INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
   IdUsuario INT FOREIGN KEY REFERENCES USUARIO(IdUsuario),
    ColumnaModificada NVARCHAR(50), -- Nueva columna para indicar la columna modificada
    ValorAntiguo NVARCHAR(MAX),
    ValorNuevo NVARCHAR(MAX),
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20)
);

GO
-- Tabla de Acciones (botones o funcionalidades específicas)
CREATE TABLE Acciones (
    IdAccion INT PRIMARY KEY IDENTITY(1,1),
    NombreAccion NVARCHAR(100) UNIQUE NOT NULL,
	Estado NVARCHAR(50) DEFAULT 'Activo'
);
go
INSERT INTO Acciones (NombreAccion)
VALUES 
  ('Imprimir'),
  ('Crear'),
  ('Editar'),
  ('Eliminar'),
  ('Ver');
go
-- Tabla de Recursos (páginas o funcionalidades)
CREATE TABLE Recursos (
    IdRecurso INT PRIMARY KEY IDENTITY(1,1),
    NombreRecurso NVARCHAR(100) NOT NULL,
	Ruta NVARCHAR(255) UNIQUE NOT NULL,
	Estado NVARCHAR(50) DEFAULT 'Activo'
);
GO
-- Insertar datos en la tabla Recursos
INSERT INTO Recursos (NombreRecurso, Ruta)
VALUES 
('Informes ', '/api/informes/page'),
('Proveedor ', '/api/Proveedor/page'),
('Configuracion ', '/api/configuracion/page'),
('configuracion Acceso', '/api/configuracionAcceso/page'),
  ('Productos', '/api/producto/page'),
  ('Ventas', '/api/venta/page'),
  ('Bodega', '/api/bodega/page'),
  ('Categoria', '/api/categorias/page'),
  ('Color', '/api/color/page'),
  ('Compra', '/api/compra/page'),
  ('Historial Configuraciones', '/api/historial/page'),
  ('Datos Debaja', '/api/DatosDebaja/page'),
   ('Empleado', '/api/empleado/page'),
   ('Inicio', '/Inicio'),
   ('Inventario', '/api/inventario/page'),
    ('Marca', '/api/marcas/page'),
    ('Promocion', '/api/promociones/page'),
    ('Rol', '/api/rol/page'),
	 ('Tallas', '/api/talla/page'),
	 ('Usuarios', '/api/usuarios/page'),
	 ('Devolucion', '/api/venta/devolucion/page'),
	  ('Registrar Devolucion', '/api/venta/devolucion/registrar/page'),
	  	  ('Material Zapatos ', '/api/materialesZapatos/page');
-- Tabla de Relación entre Acciones y Recursos
CREATE TABLE ConfiguracionAcceso (
    IdConfiguracion INT PRIMARY KEY IDENTITY(1,1),
    IdRecurso INT,
    IdAccion INT,
	IdRol INT,
    FOREIGN KEY (IdRol) REFERENCES Roles(IdRol),
    FOREIGN KEY (IdRecurso) REFERENCES Recursos(IdRecurso),
    FOREIGN KEY (IdAccion) REFERENCES Acciones(IdAccion),
	Estado NVARCHAR(50) DEFAULT 'Activo'
);
GO
-- Insertar datos en la tabla RecursoAccion
-- Insertar datos en la tabla RecursoAccion


-- Tabla Configuraciones
CREATE TABLE Configuraciones (
    PKConfiguraciones INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    NombreNegocio NVARCHAR(250),
    LogoLocal VARBINARY(MAX),
    RUC NVARCHAR(20),
    Telefonos NVARCHAR(100),
    Correo NVARCHAR(100),
    Direccion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo',
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20) DEFAULT 'INSERT' -- Puede ser 'INSERT', 'UPDATE', 'DELETE', etc.
);
GO



-- Tabla HistorialConfiguraciones
CREATE TABLE HistorialConfiguraciones (
    PKHistorial INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    FKConfiguraciones INT FOREIGN KEY REFERENCES Configuraciones(PKConfiguraciones),
    ColumnaModificada NVARCHAR(50), -- Nueva columna para indicar la columna modificada
    ValorAntiguo NVARCHAR(MAX),
    ValorNuevo NVARCHAR(MAX),
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20) DEFAULT 'UPDATE'
);



GO
-- Tabla Marcas
CREATE TABLE Marcas (
    ID_Marca INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    DetalleMarca VARCHAR(100),
   Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Colores
CREATE TABLE Colores (
    ID_Colores INT PRIMARY KEY IDENTITY(1,1),
    Color VARCHAR(255) UNIQUE NOT NULL,
    Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Categorias
CREATE TABLE Categorias (
    ID_Categoria INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Tallas
CREATE TABLE Tallas (
    ID_Talla INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    NumeroTalla VARCHAR(10) UNIQUE NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Materiales para Zapatos
CREATE TABLE MaterialesZapatos (
    ID_MaterialZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion TEXT,
    TipoMaterial VARCHAR(50),
	TipodeCostura  VARCHAR(50),
	TipoSuela VARCHAR(50),
    Fabricante VARCHAR(100),
    Observaciones TEXT,
    Estado Nvarchar(50) DEFAULT 'Activo'
);

-- Tabla Productos
CREATE TABLE Productos_Zapatos (
    ID_ProductoZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion NVARCHAR(MAX),
    ID_Categoria INT FOREIGN KEY REFERENCES Categorias(ID_Categoria),
     Estado Nvarchar(50) DEFAULT 'Activo',
);
GO

-- Tabla Empleados
CREATE TABLE Empleados (
    ID_Empleado INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Apellido VARCHAR(100),
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
	 idUsuario INT FOREIGN KEY REFERENCES USUARIO(IdUsuario),
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO


CREATE TABLE ZapatosDanados (
    ZapatoDanadoID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    ProductoZapatosID INT UNIQUE NOT NULL,
    DescripcionDanos NVARCHAR(MAX),
    FechaDeteccion DATE,
    AccionesTomadas NVARCHAR(MAX),
  Estado Nvarchar(50) DEFAULT 'Activo'
    CONSTRAINT FK_ProductoZapatos_ZapatoDanado FOREIGN KEY (ProductoZapatosID) REFERENCES Productos_Zapatos(ID_ProductoZapatos),
);

go
-- Tabla BODEGA
CREATE TABLE BODEGA (
    ID_BODEGA INT PRIMARY KEY IDENTITY(1,1),
    NOMBRE VARCHAR(100) UNIQUE NOT NULL,
    UBICACION VARCHAR(100),
    Estado Nvarchar(50) DEFAULT 'Activo',
);
GO
CREATE TABLE Inventario (
    ID_Inventario INT PRIMARY KEY IDENTITY(1,1),
    ID_BODEGA INT FOREIGN KEY REFERENCES BODEGA(ID_BODEGA),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    ID_Marca INT FOREIGN KEY REFERENCES Marcas(ID_Marca),
    ID_Talla INT FOREIGN KEY REFERENCES Tallas(ID_Talla),
    ID_Colores INT FOREIGN KEY REFERENCES Colores(ID_Colores),
    ID_MaterialZapatos INT FOREIGN KEY REFERENCES MaterialesZapatos(ID_MaterialZapatos),
    UnidadesExistencias SMALLINT DEFAULT 0 NULL,
    FechaIngreso Date NULL,
    PrecioCompra MONEY DEFAULT 0  NULL,
    Descuento MONEY DEFAULT 0  NULL,
    PrecioVenta MONEY  DEFAULT 0  NULL,
    ExistenciasMinimas INT DEFAULT 0  NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);

GO

-- Tabla Promociones
CREATE TABLE Promociones (
    ID_Promocion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion VARCHAR(200),
    FechaInicio DATE,
    FechaFin DATE,
    Estado Nvarchar(50) DEFAULT 'Activo',
    DescuentoPorcentaje DECIMAL(5, 2) DEFAULT 0, -- Porcentaje de descuento para la promoción
    DescuentoMonto MONEY DEFAULT 0, -- Monto de descuento para la promoción
    Justificacion NVARCHAR(200), -- Justificación para la promoción
);

GO

-- Tabla para gestionar la asociación entre Promociones e Inventario
CREATE TABLE PromocionInventario (
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion),
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario),
    PRIMARY KEY (ID_Promocion, ID_Inventario)
);



-- Tabla MovimientosBodegas
CREATE TABLE TblMovimientosBodegas (
    PKMovimientosBodega INT PRIMARY KEY CLUSTERED IDENTITY(1,1) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    PKEmpleado INT NOT NULL,
    FechaMovimiento DATETIME NOT NULL,
    Descripcion NVARCHAR(250) NOT NULL,
    Cantidad FLOAT NOT NULL,
    ID_BODEGA INT FOREIGN KEY REFERENCES BODEGA(ID_BODEGA) NOT NULL,
    TipoMovimiento NVARCHAR(50) NOT NULL,
   Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Ventas
CREATE TABLE Ventas (
    ID_Venta INT PRIMARY KEY IDENTITY(1,1),
	CodigoVenta  NVARCHAR(100) UNIQUE NOT NULL, -- Agregar UNIQUE aquí NOT NULL,
	 Subtotal DECIMAL(10, 2),
    IVA DECIMAL(10, 2),
    Total DECIMAL(10, 2),
    Fecha DATE,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO


-- Tabla DetalleVenta
CREATE TABLE DetalleVenta (
    ID_DetalleVenta INT PRIMARY KEY IDENTITY(1,1),
	CodigoVenta NVARCHAR(100) FOREIGN KEY REFERENCES Ventas (CodigoVenta) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion) NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado) NOT NULL,
	PrecioVenta money NOT NULL,
    Cantidad INT NOT NULL ,
    Descuento DECIMAL(10, 2),
    Total DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,
    IVA DECIMAL(10, 2),
    Fecha DATE NOT NULL,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
go



-- Tabla para gestionar el historial de precios
CREATE TABLE HistorialPrecioVenta  (
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario),
    PrecioAntiguo MONEY,
    PrecioNuevo MONEY,
    FechaInicio DATE,
    FechaFin DATE, 
	UsuarioModificacion NVARCHAR(50),
    Justificacion NVARCHAR(200), -- Nueva columna para justificar el cambio de precio
    PRIMARY KEY (ID_Inventario, FechaInicio)
);


GO
-- Tabla Devoluciones
CREATE TABLE DevolucionesVentas (
    ID_Devolucion INT PRIMARY KEY IDENTITY(1,1),
  	CodigoVenta NVARCHAR(100) FOREIGN KEY REFERENCES Ventas (CodigoVenta) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado),
    CantidadDevuelta INT NOT NULL,
    Motivo VARCHAR(200),
    Fecha DATE NOT NULL,
    EstadoDevolucion NVARCHAR(50) DEFAULT 'Activo' -- Nuevo campo para el estado de la devolución
);

GO
CREATE TABLE NotasCredito (
    ID_NotaCredito INT PRIMARY KEY IDENTITY(1,1),
    CodigoNotaCredito NVARCHAR(100),
    ID_Devolucion INT FOREIGN KEY REFERENCES DevolucionesVentas(ID_Devolucion) NOT NULL,
    Monto DECIMAL(10, 2) NOT NULL,
    Fecha DATE NOT NULL,
    EstadoNotaCredito NVARCHAR(50) DEFAULT 'Activa'
);

GO

-- Tabla Proveedores
CREATE TABLE Proveedores (
    ID_Proveedor INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE,
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
    Ruc NVARCHAR(100) NULL,
    EmailProveedor NVARCHAR(200) NOT NULL,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Facturas
CREATE TABLE Facturas (
    ID_Factura INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATE,
    Total DECIMAL(10, 2),
	  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla DetalleFactura
CREATE TABLE Detalle_Factura (
    ID_DetalleFactura INT PRIMARY KEY IDENTITY(1,1),
    ID_Factura INT FOREIGN KEY REFERENCES Facturas(ID_Factura),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    Descuento DECIMAL(10, 2),
	  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla HistorialPrecio
CREATE TABLE HistorialPriciocompra (
    PKHistorial INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
	ID_Proveedor INT FOREIGN KEY REFERENCES Proveedores(ID_Proveedor) NOT NULL,
   PrecioAntiguo MONEY,
    PrecioNuevo MONEY,
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20) DEFAULT 'UPDATE'
);
GO

-- Tabla Compras
CREATE TABLE Compras (
    ID_Compra INT PRIMARY KEY IDENTITY(1,1),
    CodigoCompra NVARCHAR(100) UNIQUE NOT NULL, -- Agregar UNIQUE aquí
    FechaCompra Date NOT NULL,
    Total DECIMAL(10, 2),
    EstadoCompra NVARCHAR(50) DEFAULT 'Pendiente' -- Nuevo campo para el estado de la compra
   
);
GO
-- Tabla DetalleCompra
CREATE TABLE DetalleCompra (
    ID_DetalleCompra INT PRIMARY KEY IDENTITY(1,1),
    CodigoCompra NVARCHAR(100) FOREIGN KEY REFERENCES Compras(CodigoCompra) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Proveedor INT FOREIGN KEY REFERENCES Proveedores(ID_Proveedor) NOT NULL,
    ID_BODEGA INT FOREIGN KEY REFERENCES BODEGA(ID_BODEGA) NOT NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado) NOT NULL,
    Cantidad INT,
    PrecioCompra DECIMAL(10, 2),
    Descuento DECIMAL(10, 2) DEFAULT 0.0  Null,
    Total DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    IVA DECIMAL(10, 2),
    EstadoDetalleCompra NVARCHAR(50) DEFAULT 'Activo' -- Nuevo campo para el estado del detalle de la compra
);
GO
-- Tabla Devoluciones
CREATE TABLE Devoluciones (
    ID_Devolucion INT PRIMARY KEY IDENTITY(1,1),
    ID_Compra INT FOREIGN KEY REFERENCES Compras(ID_Compra) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado),
    CantidadDevuelta INT NOT NULL,
    Motivo VARCHAR(200),
    Fecha DATE NOT NULL,
    EstadoDevolucion NVARCHAR(50) DEFAULT 'Activo' -- Nuevo campo para el estado de la devolución
);

GO


	   -- Insertar datos en la tabla "Roles"
INSERT INTO Roles (NombreRol)
VALUES
    ('Administrador'),
    ('Vendedor'),
    ('Comprador');
go 
INSERT INTO ConfiguracionAcceso (IdRecurso, IdAccion,IdRol)
VALUES
(1,5,1),
(2,5,1),
(3,5,1),
(4,5,1),
(5,5,1),
(6,5,1),
(7,5,1),
(8,5,1),
(9,5,1),
(10,5,1),
(11,5,1),
(12,5,1),
(13,5,1),
(14,5,1),
(15,5,1),
(16,5,1),
(17,5,1),
(18,5,1),
(19,5,1),
(20,5,1),
(21,5,1),
(22,5,1),
(23,5,1);

GO
INSERT INTO USUARIO (Nombres,Apellidos,LoginUsuario,LoginClave,IdRol)
VALUES  ('UsuarioInicial','UsuarioInicial','SuperAdmin','$2b$10$HuURQk8iSD.Kw/JeJarPU.jBa1DRKKBPDLeChriQkjHrbcwCRfCLm',1);
	   -- Tabla Marcas
INSERT INTO Marcas (Nombre, DetalleMarca, Estado)
VALUES
  ('Nike', 'Marca especializada en calzado deportivo', 'Activo'),
  ('Adidas', 'Diseño moderno y deportivo', 'Activo'),
  ('Clarks', 'Calidad y comodidad', 'Activo');
go
-- Tabla Colores
INSERT INTO Colores (Color, Estado)
VALUES
  ('Negro', 'Activo'),
  ('Blanco', 'Activo'),
  ('Azul', 'Activo');
  go
-- Tabla Categorias
INSERT INTO Categorias (Nombre, Estado)
VALUES
  ('Deportivos', 'Activo'),
  ('Casuales', 'Activo'),
  ('Formales', 'Activo');
  go
-- Tabla Tallas
INSERT INTO Tallas (NumeroTalla, Estado)
VALUES
  ('36', 'Activo'),
  ('37', 'Activo'),
  ('38', 'Activo');
  go
  INSERT INTO Proveedores (Nombre, Direccion, Telefono, Ruc, EmailProveedor, Estado)
VALUES
    ('Zapatería Zapato Feliz', 'Calle Principal #123', '+123456789', '1234567890123', 'info@zapatosfelices.com', 'Activo'),
    ('Moda Zapatera', 'Avenida Central #456', '+987654321', '9876543210987', 'ventas@modazapatera.com', 'Activo'),
    ('Pies Felices S.A.', 'Plaza de los Zapatos #789', '+1122334455', '1122334455667', 'contacto@piesfelices.com', 'Activo'),
    ('Elegancia en Zapatos', 'Esquina de la Elegancia #101', '+5544332211', '5544332211001', 'info@eleganciaenzapatos.com', 'Activo');
go
-- Tabla Materiales para Zapatos
INSERT INTO MaterialesZapatos (Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado)
VALUES
  ('Cuero Genuino', 'Material duradero y elegante', 'Piel', 'Costura a mano', 'Suela de goma', 'Zapaterías X', 'Ninguna', 'Activo'),
  ('Malla Transpirable', 'Material ligero y transpirable', 'Sintético', 'Costura a máquina', 'Suela de EVA', 'Fabricante Y', 'Ideal para deportes', 'Activo'),
  ('Textil', 'Material cómodo y flexible', 'Textil', 'Costura a máquina', 'Suela de goma', 'Zapaterías Z', 'Adecuado para uso diario', 'Activo');
  go
-- Tabla Productos
INSERT INTO Productos_Zapatos (Nombre, Descripcion, ID_Categoria, Estado)
VALUES
  ('Air Max', 'Zapatillas deportivas con tecnología Air Max', 1, 'Activo'),
  ('Originals Superstar', 'Zapatillas casuales icónicas', 2, 'Activo'),
  ('Unstructured', 'Zapatos formales sin estructura', 3, 'Activo');
  go
 
-- Tabla ZapatosDanados
INSERT INTO ZapatosDanados (ProductoZapatosID, DescripcionDanos, FechaDeteccion, AccionesTomadas, Estado)
VALUES
  (1, 'Rasguño en la parte trasera', '2023-01-15', 'Descuento aplicado al precio de venta', 'Activo'),
  (2, 'Desgaste en la suela', '2023-02-20', 'Enviado a reparación', 'Activo'),
  (3, 'Manchas en la parte superior', '2023-03-10', 'Descartado', 'Inactivo');
  go
-- Tabla Promociones
INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, Estado)
VALUES
  ('Oferta de Verano', 'Descuento del 20% en zapatos de verano', '2023-06-01', '2023-08-31', 'Activo'),
  ('Liquidación Invierno', 'Productos de invierno a precios reducidos', '2023-12-01', '2024-02-28', 'Activo'),
  ('Descuento Especial', 'Solo por hoy, descuento del 30%', '2023-05-01', '2023-05-01', 'Activo');
  go
  -- Promoción con descuento por porcentaje
 
INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, DescuentoPorcentaje, Justificacion)
VALUES ('PromoDescuentoPorcentaje', 'Descuento del 15%', '2024-01-15', '2024-01-30', 15.0, 'Oferta especial');
go
-- Promoción con descuento monto
INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, DescuentoMonto, Justificacion)
VALUES ('PromoDescuentoMonto', 'Descuento de $50', '2024-02-01', '2024-02-15', 50.0, 'Oferta especial');

  go
-- Tabla BODEGA
INSERT INTO BODEGA (NOMBRE, UBICACION, Estado)
VALUES
  ('Bodega Central', 'Calle Principal, Ciudad ABC', 'Activo'),
  ('Sucursal Norte', 'Avenida Norte, Ciudad ABC', 'Activo'),
  ('Sucursal Sur', 'Avenida Sur, Ciudad ABC', 'Activo');
 
  go

CREATE PROCEDURE InsertarConfiguracionYHistorial
    @nombreNegocio NVARCHAR(250),
    @logoLocal VARBINARY(MAX),
    @ruc NVARCHAR(20),
    @telefonos NVARCHAR(100),
    @correo NVARCHAR(100),
    @direccion NVARCHAR(255),
    @usuarioModificacion NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar en la tabla principal (Configuraciones)
        INSERT INTO Configuraciones (NombreNegocio, LogoLocal, RUC, Telefonos, Correo, Direccion, Estado, UsuarioModificacion, TipoOperacion)
        VALUES (@nombreNegocio, @logoLocal, @ruc, @telefonos, @correo, @direccion, 'Activo', @usuarioModificacion, 'INSERT');

        -- Obtener el ID de la configuración recién insertada
        DECLARE @configuracionID INT;
        SET @configuracionID = SCOPE_IDENTITY();

        -- Insertar en el historial para datos de cadena (ej. NombreNegocio)
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, UsuarioModificacion, TipoOperacion)
        VALUES 
            (@configuracionID, 'NombreNegocio', NULL, @nombreNegocio, @usuarioModificacion, 'INSERT'),
            (@configuracionID, 'RUC', NULL, @ruc, @usuarioModificacion, 'INSERT'),
            (@configuracionID, 'Telefonos', NULL, @telefonos, @usuarioModificacion, 'INSERT'),
            (@configuracionID, 'Correo', NULL, @correo, @usuarioModificacion, 'INSERT'),
            (@configuracionID, 'Direccion', NULL, @direccion, @usuarioModificacion, 'INSERT'),
            (@configuracionID, 'Estado', NULL, 'Activo', @usuarioModificacion, 'INSERT');

        -- Insertar en el historial para LogoLocal
        IF @logoLocal IS NOT NULL
        BEGIN
            INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
            VALUES (
                @configuracionID,
                'LogoLocal',
                NULL, -- ValorAntiguo NULL ya que es una inserción
                CONVERT(NVARCHAR(MAX), CAST(@logoLocal AS VARBINARY(MAX)), 1), -- Convertir a Base64
                GETDATE(),
                @usuarioModificacion,
                'INSERT'
            );
        END;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
    END CATCH
END;
GO
CREATE PROCEDURE ActualizarConfiguracion
    @PKConfiguraciones INT,
    @NombreNegocio NVARCHAR(250) = NULL,
    @LogoLocal VARBINARY(MAX) = NULL,
    @RUC NVARCHAR(20) = NULL,
    @Telefonos NVARCHAR(100) = NULL,
    @Correo NVARCHAR(100) = NULL,
    @Direccion NVARCHAR(255) = NULL,
    @UsuarioModificacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TipoOperacion NVARCHAR(20) = 'UPDATE';

    -- Obtener los valores antiguos antes de la actualización
    DECLARE @OldNombreNegocio NVARCHAR(250);
    DECLARE @OldLogoLocal VARBINARY(MAX);
    DECLARE @OldRUC NVARCHAR(20);
    DECLARE @OldTelefonos NVARCHAR(100);
    DECLARE @OldCorreo NVARCHAR(100);
    DECLARE @OldDireccion NVARCHAR(255);

    SELECT
        @OldNombreNegocio = NombreNegocio,
        @OldLogoLocal = LogoLocal,
        @OldRUC = RUC,
        @OldTelefonos = Telefonos,
        @OldCorreo = Correo,
        @OldDireccion = Direccion
    FROM Configuraciones
    WHERE PKConfiguraciones = @PKConfiguraciones;

    -- Actualizar la tabla Configuraciones
    UPDATE Configuraciones
    SET
        NombreNegocio = ISNULL(@NombreNegocio, NombreNegocio),
        LogoLocal = ISNULL(@LogoLocal, LogoLocal),
        RUC = ISNULL(@RUC, RUC),
        Telefonos = ISNULL(@Telefonos, Telefonos),
        Correo = ISNULL(@Correo, Correo),
        Direccion = ISNULL(@Direccion, Direccion),
        FechaModificacion = GETDATE(),
        UsuarioModificacion = @UsuarioModificacion
    WHERE PKConfiguraciones = @PKConfiguraciones;

    -- Registrar cambios en la tabla HistorialConfiguraciones
    IF @OldNombreNegocio != ISNULL(@NombreNegocio, @OldNombreNegocio)
    BEGIN
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'NombreNegocio', @OldNombreNegocio, @NombreNegocio, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END

  IF @OldLogoLocal != ISNULL(@LogoLocal, @OldLogoLocal)
BEGIN
    INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
    VALUES (
        @PKConfiguraciones,
        'LogoLocal',
        CONVERT(NVARCHAR(MAX), CAST(@OldLogoLocal AS VARBINARY(MAX)), 1), -- Convertir a Base64
        CONVERT(NVARCHAR(MAX), CAST(@LogoLocal AS VARBINARY(MAX)), 1), -- Convertir a Base64
        GETDATE(),
        @UsuarioModificacion,
        @TipoOperacion
    );
END

    IF @OldRUC != ISNULL(@RUC, @OldRUC)
    BEGIN
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'RUC', @OldRUC, @RUC, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END

    IF @OldTelefonos != ISNULL(@Telefonos, @OldTelefonos)
    BEGIN
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Telefonos', @OldTelefonos, @Telefonos, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END

    IF @OldCorreo != ISNULL(@Correo, @OldCorreo)
    BEGIN
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Correo', @OldCorreo, @Correo, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END

    IF @OldDireccion != ISNULL(@Direccion, @OldDireccion)
    BEGIN
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Direccion', @OldDireccion, @Direccion, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END
END;

GO

CREATE PROCEDURE GestionarCompra
    @CodigoCompra NVARCHAR(100),
    @FechaCompra DATE,
    @EstadoCompra NVARCHAR(50),
	@Total  DECIMAL(10, 2),
    @DetallesCompra XML
AS
BEGIN
    BEGIN TRY
        -- Declarar variables locales
        DECLARE @ID_Compra INT;

        -- Iniciar una transacción
        BEGIN TRANSACTION;
		       
			   
        -- Crear la tabla temporal si no existe
        IF OBJECT_ID('tempdb..##DetallesCompraTemp') IS NULL
        BEGIN
            CREATE TABLE ##DetallesCompraTemp
            (
                ID_Inventario INT,
                ID_Proveedor INT,
                NuevoPrecio MONEY,
                UsuarioModificacion NVARCHAR(50)
            );
        END;


			   -- Si el estado es 'Pendiente', realizar la inserción de la compra y detalles
        IF @EstadoCompra = 'Pendiente'
        BEGIN

        -- Insertar la compra principal
        INSERT INTO Compras (CodigoCompra, FechaCompra, EstadoCompra)
        VALUES (@CodigoCompra, @FechaCompra, @EstadoCompra);

        -- Obtener el ID de la compra recién insertada
        SET @ID_Compra = SCOPE_IDENTITY();

    
-- Procesar cada detalle de la compra
INSERT INTO Inventario (
    ID_BODEGA, 
    ID_ProductoZapatos,
    ID_Marca,
    ID_Talla,
    ID_Colores,
    ID_MaterialZapatos
)
SELECT DISTINCT
    D.Detalle.value('(ID_BODEGA)[1]', 'INT'), -- Utilizar la BODEGA del detalle de compra
    D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT'),
    D.Detalle.value('(ID_Marca)[1]', 'INT'),
    D.Detalle.value('(ID_Talla)[1]', 'INT'),
    D.Detalle.value('(ID_Colores)[1]', 'INT'),
    D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT')
FROM @DetallesCompra.nodes('/DetallesCompra/Detalle') AS D(Detalle)
WHERE NOT EXISTS (
    SELECT 1
    FROM Inventario I
   WHERE I.ID_BODEGA = D.Detalle.value('(ID_BODEGA)[1]', 'INT')
      AND I.ID_ProductoZapatos = D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT')
      AND I.ID_Marca = D.Detalle.value('(ID_Marca)[1]', 'INT')
      AND I.ID_Talla = D.Detalle.value('(ID_Talla)[1]', 'INT')
      AND I.ID_Colores = D.Detalle.value('(ID_Colores)[1]', 'INT')
      AND I.ID_MaterialZapatos = D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT')
);

        -- Procesar cada detalle de la compra
      -- Procesar cada detalle de la compra
INSERT INTO DetalleCompra (
    CodigoCompra,
    ID_Inventario,
    ID_Proveedor,
    ID_BODEGA, -- Utilizar la BODEGA del inventario
    ID_Empleado,
    Cantidad,
    PrecioCompra,
    Descuento,
    Total,
    Subtotal,
    IVA,
    EstadoDetalleCompra
)
SELECT
    @CodigoCompra,
    I.ID_Inventario,
    D.Detalle.value('(ID_Proveedor)[1]', 'INT'),
    I.ID_BODEGA, -- Utilizar la BODEGA del inventario
    D.Detalle.value('(ID_Empleado)[1]', 'INT'),
    D.Detalle.value('(Cantidad)[1]', 'INT'),
    D.Detalle.value('(PrecioCompra)[1]', 'DECIMAL(10,2)'),
    D.Detalle.value('(Descuento)[1]', 'DECIMAL(10,2)'),
    D.Detalle.value('(Total)[1]', 'DECIMAL(10,2)'),
    D.Detalle.value('(Subtotal)[1]', 'DECIMAL(10,2)'),
    D.Detalle.value('(IVA)[1]', 'DECIMAL(10,2)'),
    'Activo'
FROM @DetallesCompra.nodes('/DetallesCompra/Detalle') AS D(Detalle)
INNER JOIN Inventario I ON
    I.ID_ProductoZapatos = D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT') AND
    I.ID_Marca = D.Detalle.value('(ID_Marca)[1]', 'INT') AND
    I.ID_Talla = D.Detalle.value('(ID_Talla)[1]', 'INT') AND
    I.ID_Colores = D.Detalle.value('(ID_Colores)[1]', 'INT') AND
    I.ID_MaterialZapatos = D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT') AND
	    I.ID_BODEGA = D.Detalle.value('(ID_BODEGA)[1]', 'INT')
WHERE NOT EXISTS (
    SELECT 1
    FROM DetalleCompra DC
    WHERE DC.CodigoCompra = @CodigoCompra
      AND DC.ID_Inventario = I.ID_Inventario
);



            -- Actualizar el total de la compra principal
            UPDATE Compras
            SET Total = @Total
            WHERE CodigoCompra = @CodigoCompra;

		END;
        -- Verificar el estado y realizar acciones adicionales si es 'Completada'
        ELSE IF @EstadoCompra = 'Completada'
        BEGIN
            -- Obtener la fecha de la compra
            SET @FechaCompra = (SELECT FechaCompra FROM Compras WHERE CodigoCompra = @CodigoCompra);

            -- Insertar el movimiento en la tabla TblMovimientosBodegas
            INSERT INTO TblMovimientosBodegas (
                ID_Inventario,
                PKEmpleado,
                FechaMovimiento,
                Descripcion,
                Cantidad,
                ID_BODEGA,
                TipoMovimiento
            )
            SELECT
                DC.ID_Inventario,
                DC.ID_Empleado,
                @FechaCompra,
                'Compra Completada',
                DC.Cantidad,
                DC.ID_BODEGA,
                'Entrada'
            FROM DetalleCompra DC
            WHERE DC.CodigoCompra = @CodigoCompra;

            -- Actualizar el inventario basado en la compra completada
            UPDATE Inv
            SET 
                UnidadesExistencias = UnidadesExistencias + DC.Cantidad,
                FechaIngreso = COALESCE(FechaIngreso, @FechaCompra),
                PrecioCompra = DC.PrecioCompra
            FROM DetalleCompra DC
            JOIN Inventario Inv ON DC.ID_Inventario = Inv.ID_Inventario
            WHERE DC.CodigoCompra = @CodigoCompra;

            -- Actualizar el estado de la compra
            UPDATE Compras
            SET EstadoCompra = @EstadoCompra
            WHERE CodigoCompra = @CodigoCompra;  -- Utilizar el ID_Compra en lugar de CodigoCompra
			  -- Actualizar el estado del detallecompra
            UPDATE DetalleCompra
            SET EstadoDetalleCompra = @EstadoCompra
            WHERE CodigoCompra = @CodigoCompra;  -- Utilizar el ID_Compra en lugar de CodigoCompra

            INSERT INTO ##DetallesCompraTemp (ID_Inventario, ID_Proveedor, NuevoPrecio, UsuarioModificacion)
            SELECT
                DC.ID_Inventario,
                DC.ID_Proveedor,
                DC.PrecioCompra,
                E.Nombre
            FROM DetalleCompra DC
            JOIN Empleados E ON DC.ID_Empleado = E.ID_Empleado
            WHERE DC.CodigoCompra = @CodigoCompra;

            -- Llamar al procedimiento ActualizarHistorialPrecioCompraBulk
            EXEC ActualizarHistorialPrecioCompra;




        END

        -- Commit de la transacción
        COMMIT;
    END TRY
    BEGIN CATCH
        -- Rollback en caso de error
        ROLLBACK;

        -- Manejar el error (puedes registrar el error en una tabla de registro de errores, por ejemplo)
        -- También puedes propagar el error hacia arriba utilizando THROW para que la aplicación cliente lo maneje
        THROW;
    END CATCH;
				-- Eliminar la tabla temporal al final del procedimiento
IF OBJECT_ID('tempdb..##DetallesCompraTemp') IS NOT NULL
    DROP TABLE ##DetallesCompraTemp;
END;

go
CREATE PROCEDURE ObtenerDetallesCompraPorCodigo
    @CodigoCompra NVARCHAR(100)
AS
BEGIN
    -- Verificar si la compra existe
    IF NOT EXISTS (SELECT 1 FROM Compras WHERE CodigoCompra = @CodigoCompra)
    BEGIN
        -- Si no se encuentra la compra, terminar la ejecución
        RETURN;
    END

    -- Seleccionar los detalles de la compra y los productos asociados
    SELECT
        C.CodigoCompra,
        C.FechaCompra,
        C.EstadoCompra,
		C.Total as TotalGeneral,
        D.ID_Inventario,
        D.Cantidad,
        D.PrecioCompra,
        D.Descuento,
        D.Total,
        D.Subtotal,
        D.IVA,
        I.ID_ProductoZapatos as Codigo,
        P.Nombre AS Nombre,
        I.ID_Marca,
        M.Nombre AS NombreMarca,
        I.ID_Talla,
        T.NumeroTalla AS NombreTalla,
        I.ID_Colores,
        Co.Color AS NombreColor,
        I.ID_MaterialZapatos,
        Mat.Nombre AS NombreMaterial,
        I.ID_BODEGA,
        B.Nombre AS NombreBodega,
        D.ID_Empleado,
        E.Nombre AS NombreEmpleado,
        D.ID_Proveedor,
        Prov.Nombre AS NombreProveedor
    FROM Compras C
    INNER JOIN DetalleCompra D ON C.CodigoCompra = D.CodigoCompra
    INNER JOIN Inventario I ON D.ID_Inventario = I.ID_Inventario
    LEFT JOIN Productos_Zapatos P ON I.ID_ProductoZapatos = P.ID_ProductoZapatos
    LEFT JOIN Marcas M ON I.ID_Marca = M.ID_Marca
    LEFT JOIN Tallas T ON I.ID_Talla = T.ID_Talla
    LEFT JOIN Colores Co ON I.ID_Colores = Co.ID_Colores
    LEFT JOIN MaterialesZapatos Mat ON I.ID_MaterialZapatos = Mat.ID_MaterialZapatos
    LEFT JOIN BODEGA B ON I.ID_BODEGA = B.ID_BODEGA
    LEFT JOIN Empleados E ON D.ID_Empleado = E.ID_Empleado
    LEFT JOIN Proveedores Prov ON D.ID_Proveedor = Prov.ID_Proveedor
    WHERE C.CodigoCompra = @CodigoCompra;
END;

go
CREATE PROCEDURE EditarCompraDetalleInventario
    @CodigoCompra NVARCHAR(100),
    @FechaCompra DATE,
    @EstadoCompra NVARCHAR(50),
    @Total DECIMAL(10, 2),
    @DetallesCompra XML
AS
BEGIN
    BEGIN TRY
        -- Declarar variables locales
        DECLARE @ID_Compra INT;
		  DECLARE @NuevoTotal DECIMAL(10, 2);
        -- Iniciar una transacción
        BEGIN TRANSACTION;



        -- Verificar si la compra existe
        IF EXISTS (SELECT 1 FROM Compras WHERE CodigoCompra = @CodigoCompra)
        BEGIN
            -- Actualizar la compra principal
            UPDATE Compras
            SET
                FechaCompra = @FechaCompra,
                EstadoCompra = @EstadoCompra,
                Total = @Total
            WHERE CodigoCompra = @CodigoCompra;

            -- Obtener el ID de la compra
            SET @ID_Compra = (SELECT ID_Compra FROM Compras WHERE CodigoCompra = @CodigoCompra);
INSERT INTO Inventario (
    ID_BODEGA, 
    ID_ProductoZapatos,
    ID_Marca,
    ID_Talla,
    ID_Colores,
    ID_MaterialZapatos
)
SELECT DISTINCT
    D.Detalle.value('(ID_BODEGA)[1]', 'INT'), -- Utilizar la BODEGA del detalle de compra
    D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT'),
    D.Detalle.value('(ID_Marca)[1]', 'INT'),
    D.Detalle.value('(ID_Talla)[1]', 'INT'),
    D.Detalle.value('(ID_Colores)[1]', 'INT'),
    D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT')
FROM @DetallesCompra.nodes('/DetallesCompra/Detalle') AS D(Detalle)
WHERE NOT EXISTS (
    SELECT 1
    FROM Inventario I
   WHERE I.ID_BODEGA = D.Detalle.value('(ID_BODEGA)[1]', 'INT')
      AND I.ID_ProductoZapatos = D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT')
      AND I.ID_Marca = D.Detalle.value('(ID_Marca)[1]', 'INT')
      AND I.ID_Talla = D.Detalle.value('(ID_Talla)[1]', 'INT')
      AND I.ID_Colores = D.Detalle.value('(ID_Colores)[1]', 'INT')
      AND I.ID_MaterialZapatos = D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT')
);


             -- Procesar cada detalle de la compra
        INSERT INTO DetalleCompra (
            CodigoCompra,
            ID_Inventario,
            ID_Proveedor,
            ID_BODEGA, -- Utilizar la BODEGA del inventario
            ID_Empleado,
            Cantidad,
            PrecioCompra,
            Descuento,
            Total,
            Subtotal,
            IVA,
            EstadoDetalleCompra
        )
        SELECT
            @CodigoCompra,
            I.ID_Inventario,
            D.Detalle.value('(ID_Proveedor)[1]', 'INT'),
            I.ID_BODEGA, -- Utilizar la BODEGA del inventario
            D.Detalle.value('(ID_Empleado)[1]', 'INT'),
            D.Detalle.value('(Cantidad)[1]', 'INT'),
            D.Detalle.value('(PrecioCompra)[1]', 'DECIMAL(10,2)'),
            D.Detalle.value('(Descuento)[1]', 'DECIMAL(10,2)'),
            D.Detalle.value('(Total)[1]', 'DECIMAL(10,2)'),
            D.Detalle.value('(Subtotal)[1]', 'DECIMAL(10,2)'),
            D.Detalle.value('(IVA)[1]', 'DECIMAL(10,2)'),
            'Activo'
        FROM @DetallesCompra.nodes('/DetallesCompra/Detalle') AS D(Detalle)
        INNER JOIN Inventario I ON
            I.ID_ProductoZapatos = D.Detalle.value('(ID_ProductoZapatos)[1]', 'INT') AND
            I.ID_Marca = D.Detalle.value('(ID_Marca)[1]', 'INT') AND
            I.ID_Talla = D.Detalle.value('(ID_Talla)[1]', 'INT') AND
            I.ID_Colores = D.Detalle.value('(ID_Colores)[1]', 'INT') AND
            I.ID_MaterialZapatos = D.Detalle.value('(ID_MaterialZapatos)[1]', 'INT');

			            -- Calcular el nuevo total de la compra
            SET @NuevoTotal = COALESCE((
                SELECT SUM(Total) 
                FROM DetalleCompra 
                WHERE CodigoCompra = @CodigoCompra
            ), 0);

            -- Actualizar el total en la tabla Compras
            UPDATE Compras
            SET
                Total = @NuevoTotal
            WHERE ID_Compra = @ID_Compra;


         
            -- Commit de la transacción
            COMMIT;
        END
        ELSE
        BEGIN
            -- La compra no existe, manejar el error o devolver un código de error
            THROW 51000, 'La compra no existe.', 1;
        END;
    END TRY
    BEGIN CATCH
        -- Rollback en caso de error
        ROLLBACK;

        -- Manejar el error (puedes registrar el error en una tabla de registro de errores, por ejemplo)
        -- También puedes propagar el error hacia arriba utilizando THROW para que la aplicación cliente lo maneje
        THROW;
    END CATCH;
END;


go

---Procedure de historico PrecioCompra
CREATE PROCEDURE ActualizarHistorialPrecioCompra
AS
BEGIN
    SET NOCOUNT ON;

    -- Declarar un cursor para recorrer los registros de la tabla temporal
    DECLARE cursorDetalles CURSOR FOR
        SELECT ID_Inventario, ID_Proveedor, NuevoPrecio, UsuarioModificacion
        FROM ##DetallesCompraTemp;

    OPEN cursorDetalles;

    DECLARE @ID_Inventario INT;
    DECLARE @ID_Proveedor INT;
    DECLARE @NuevoPrecio MONEY;
    DECLARE @UsuarioModificacion NVARCHAR(50);

    FETCH NEXT FROM cursorDetalles INTO @ID_Inventario, @ID_Proveedor, @NuevoPrecio, @UsuarioModificacion;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Mostrar los valores para diagnosticar
        PRINT 'ID_Inventario: ' + CAST(@ID_Inventario AS NVARCHAR(10));
        PRINT 'ID_Proveedor: ' + CAST(@ID_Proveedor AS NVARCHAR(10));
        PRINT 'NuevoPrecio: ' + CAST(@NuevoPrecio AS NVARCHAR(50));
        PRINT 'UsuarioModificacion: ' + @UsuarioModificacion;

        -- Obtener el precio antiguo
        DECLARE @PrecioAntiguo MONEY;

        SELECT TOP 1 @PrecioAntiguo = PrecioNuevo
        FROM HistorialPriciocompra
        WHERE ID_Inventario = @ID_Inventario
            AND ID_Proveedor = @ID_Proveedor
        ORDER BY FechaModificacion DESC;

        -- Verificar si el precio cambió
        IF @PrecioAntiguo IS NULL OR @PrecioAntiguo != @NuevoPrecio
        BEGIN
            -- Insertar o actualizar el historial
            MERGE INTO HistorialPriciocompra AS Target
            USING (VALUES (@ID_Inventario, @ID_Proveedor)) AS Source(ID_Inventario, ID_Proveedor)
            ON Target.ID_Inventario = Source.ID_Inventario
                AND Target.ID_Proveedor = Source.ID_Proveedor
            WHEN MATCHED AND Target.PrecioNuevo != @NuevoPrecio THEN
                UPDATE SET
                    PrecioAntiguo = @PrecioAntiguo,
                    PrecioNuevo = @NuevoPrecio,
                    FechaModificacion = GETDATE(),
                    UsuarioModificacion = @UsuarioModificacion,
                    TipoOperacion = 'UPDATE'
            WHEN NOT MATCHED THEN
                INSERT (ID_Inventario, ID_Proveedor, PrecioAntiguo, PrecioNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
                VALUES (@ID_Inventario, @ID_Proveedor, @PrecioAntiguo, @NuevoPrecio, GETDATE(), @UsuarioModificacion, 'INSERT');
        END

        FETCH NEXT FROM cursorDetalles INTO @ID_Inventario, @ID_Proveedor, @NuevoPrecio, @UsuarioModificacion;
    END

    CLOSE cursorDetalles;
    DEALLOCATE cursorDetalles;
END;


go 

CREATE VIEW VistaHistorialUsuario AS
SELECT
    H.PKHistorialUsuari,
    U.LoginUsuario ,
    H.ColumnaModificada,
    H.ValorAntiguo,
    H.ValorNuevo,
    H.FechaModificacion,
    H.UsuarioModificacion,
    H.TipoOperacion,
    U.NumSesiones,
    U.FechaInicioSesion,
    U.FechaFinSesion
FROM
    HistorialUsuario H
JOIN
    USUARIO U ON H.IdUsuario = U.IdUsuario;
	go
	-- Procedimiento para inserción de usuario
CREATE PROCEDURE InsertarUsuario (
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @LoginUsuario VARCHAR(50),
    @LoginClave VARCHAR(100),
    @IdRol INT,
    @Estado NVARCHAR(50),
    @UsuarioModificacion NVARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UsuarioID INT;

    -- Nueva inserción
    INSERT INTO USUARIO (Nombres, Apellidos, LoginUsuario, LoginClave, IdRol, Estado)
    VALUES (@Nombres, @Apellidos, @LoginUsuario, @LoginClave, @IdRol, @Estado);

    -- Obtener el ID del usuario recién insertado
    SET @UsuarioID = SCOPE_IDENTITY(); -- Obtener el ID generado

    -- Insertar en el historial para datos de cadena
  -- Insertar en el historial para datos de cadena
INSERT INTO HistorialUsuario (IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, UsuarioModificacion, TipoOperacion)
VALUES 
    (@UsuarioID, 'Nombre', NULL, @Nombres, @UsuarioModificacion, 'INSERT'),
    (@UsuarioID, 'Apellido', NULL, @Apellidos, @UsuarioModificacion, 'INSERT'),
    (@UsuarioID, 'LoginUsuario', NULL, CONVERT(VARCHAR(100), @LoginUsuario), @UsuarioModificacion, 'INSERT'),
    (@UsuarioID, 'LoginClave', NULL, @LoginClave, @UsuarioModificacion, 'INSERT'), -- Incluir la contraseña cifrada
    (@UsuarioID, 'IdRol', NULL, CONVERT(VARCHAR(10), @IdRol), @UsuarioModificacion, 'INSERT'),
    (@UsuarioID, 'Estado', NULL, 'Activo', @UsuarioModificacion, 'INSERT');
END;

go



-- Procedimiento para actualización de usuario
CREATE PROCEDURE ActualizarUsuario (
    @UsuarioID INT,
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @LoginUsuario VARCHAR(50),
    @IdRol INT,
    @UsuarioModificacion NVARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;
	  DECLARE @TipoOperacion NVARCHAR(20) = 'UPDATE';
    -- Obtener los valores antiguos antes de la actualización
    DECLARE @OldNombres VARCHAR(100);
    DECLARE @OldApellidos VARCHAR(100);
    DECLARE @OldLoginUsuario VARCHAR(50);
    DECLARE @OldIdRol INT;


    SELECT
        @OldNombres = Nombres,
        @OldApellidos = Apellidos,
        @OldLoginUsuario = LoginUsuario,
        @OldIdRol = IdRol
    FROM USUARIO
    WHERE IdUsuario = @UsuarioID;

    -- Actualización

	 UPDATE USUARIO
    SET
        Nombres = ISNULL(@Nombres, Nombres),
        Apellidos = ISNULL(@Apellidos, Apellidos),
        LoginUsuario = ISNULL(@LoginUsuario, LoginUsuario),
        IdRol = ISNULL(@IdRol, IdRol)
    WHERE IdUsuario = @UsuarioID;

	-- Registrar cambios en la tabla HistorialConfiguraciones
-- Registrar cambios en la tabla HistorialConfiguraciones
IF @Nombres != ISNULL(@OldNombres, '') OR @OldNombres IS NULL
BEGIN
    INSERT INTO HistorialUsuario(IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
    VALUES (@UsuarioID, 'Nombre', @OldNombres, @Nombres, GETDATE(), @UsuarioModificacion, @TipoOperacion);
END

IF @Apellidos != ISNULL(@OldApellidos, '') OR @OldApellidos IS NULL
BEGIN
    INSERT INTO HistorialUsuario(IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
    VALUES (@UsuarioID, 'Apellido', @OldApellidos, @Apellidos, GETDATE(), @UsuarioModificacion, @TipoOperacion);
END

IF @LoginUsuario != ISNULL(@OldLoginUsuario, '') OR @OldLoginUsuario IS NULL
BEGIN
    INSERT INTO HistorialUsuario(IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
    VALUES (@UsuarioID, 'LoginUsuario', @OldLoginUsuario, @LoginUsuario, GETDATE(), @UsuarioModificacion, @TipoOperacion);
END

IF @IdRol != ISNULL(@OldIdRol, -1) OR @OldIdRol IS NULL
BEGIN
    INSERT INTO HistorialUsuario(IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
    VALUES (@UsuarioID, 'ROl', CONVERT(VARCHAR(10), @OldIdRol), CONVERT(VARCHAR(10), @IdRol), GETDATE(), @UsuarioModificacion, @TipoOperacion);
END

END;
GO

CREATE PROCEDURE ActualizarContrasena (
    @UsuarioID INT,
    @LoginClave VARCHAR(100), -- Agregado para la nueva contraseña
    @UsuarioModificacion NVARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;
	  DECLARE @TipoOperacion NVARCHAR(20) = 'UPDATE';
    -- Obtener los valores antiguos antes de la actualización
   
    DECLARE @OldLoginClave VARCHAR(100); -- Agregado para la contraseña antigua

    SELECT @OldLoginClave = LoginClave
    FROM USUARIO
    WHERE IdUsuario = @UsuarioID;

    -- Actualización
    UPDATE USUARIO
    SET
        LoginClave = ISNULL(@LoginClave, LoginClave) -- Agregado para la nueva contraseña
    WHERE IdUsuario = @UsuarioID;

    IF @LoginClave IS NOT NULL AND @LoginClave != @OldLoginClave
    BEGIN
        -- Registrar cambio de contraseña en el historial
        INSERT INTO HistorialUsuario(IdUsuario, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@UsuarioID, 'LoginClave', @OldLoginClave, @LoginClave, GETDATE(), @UsuarioModificacion, @TipoOperacion);
    END
END;
go 

CREATE PROCEDURE InsertarPromocionInventario
    @ID_Promocion INT,
    @ID_Inventario INT
AS
BEGIN
    BEGIN TRY
        -- Verificar si la promoción e inventario existen
        IF NOT EXISTS (SELECT 1 FROM Promociones WHERE ID_Promocion = @ID_Promocion)
        BEGIN
            THROW 50000, 'La promoción especificada no existe.', 1;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Inventario WHERE ID_Inventario = @ID_Inventario)
        BEGIN
            THROW 50000, 'El inventario especificado no existe.', 1;
            RETURN;
        END

        -- Verificar si ya existe una relación para evitar duplicados
        IF EXISTS (SELECT 1 FROM PromocionInventario WHERE ID_Promocion = @ID_Promocion AND ID_Inventario = @ID_Inventario)
        BEGIN
            THROW 50000, 'La relación entre la promoción e inventario ya existe.', 1;
            RETURN;
        END

        -- Insertar la relación en PromocionInventario
        INSERT INTO PromocionInventario (ID_Promocion, ID_Inventario)
        VALUES (@ID_Promocion, @ID_Inventario);
      
    END TRY
    BEGIN CATCH
        -- Manejar errores
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH;
END;

go
-- Procedimiento almacenado para aplicar promociones al Inventario
CREATE PROCEDURE AplicarPromocionesAlInventario
AS
BEGIN
    BEGIN TRY
        -- Actualizar Descuento y PrecioVenta basado en las promociones activas
        UPDATE I
        SET
            I.Descuento = 
                CASE 
                    WHEN P.DescuentoPorcentaje > 0 THEN P.DescuentoPorcentaje
                    ELSE I.Descuento -- Mantener el valor actual si no hay descuento porcentaje en la promoción
                END,
            I.PrecioVenta = 
                CASE 
                    WHEN P.DescuentoMonto > 0 THEN I.PrecioVenta - P.DescuentoMonto
                    ELSE I.PrecioVenta -- Mantener el valor actual si no hay descuento monto en la promoción
                END
        FROM
            Inventario I
        INNER JOIN
            PromocionInventario PI ON I.ID_Inventario = PI.ID_Inventario
        INNER JOIN
            Promociones P ON PI.ID_Promocion = P.ID_Promocion
        WHERE
            P.Estado = 'Activo' AND
            (
                (P.DescuentoPorcentaje > 0 AND I.PrecioVenta >= (I.PrecioVenta * (P.DescuentoPorcentaje / 100))) OR
                (P.DescuentoMonto > 0 AND I.PrecioVenta >= P.DescuentoMonto)
            ); -- Solo aplicar promociones activas y verificar que no se genere un valor negativo

        -- Insertar en el historial de precios solo si hay cambios
        INSERT INTO HistorialPrecioVenta (ID_Inventario, PrecioAntiguo, PrecioNuevo, FechaInicio, FechaFin, UsuarioModificacion, Justificacion)
        SELECT 
            I.ID_Inventario, 
            I.PrecioVenta, 
            I.PrecioVenta - P.DescuentoMonto, -- PrecioNuevo después de aplicar la promoción
            P.FechaInicio, 
            P.FechaFin,
            'UsuarioEjemplo', -- Reemplaza esto con el usuario real si lo tienes
            P.Justificacion
        FROM
            Inventario I
        INNER JOIN
            PromocionInventario PI ON I.ID_Inventario = PI.ID_Inventario
        INNER JOIN
            Promociones P ON PI.ID_Promocion = P.ID_Promocion
        WHERE
            P.Estado = 'Activo' AND
            (
                (P.DescuentoPorcentaje > 0 AND I.PrecioVenta >= (I.PrecioVenta * (P.DescuentoPorcentaje / 100))) OR
                (P.DescuentoMonto > 0 AND I.PrecioVenta >= P.DescuentoMonto)
            ) AND
            NOT EXISTS (
                SELECT 1
                FROM HistorialPrecioVenta HPV
                WHERE HPV.ID_Inventario = I.ID_Inventario
                    AND HPV.FechaInicio = P.FechaInicio
            );

        PRINT 'Promociones aplicadas al Inventario correctamente.';
    END TRY
    BEGIN CATCH
        -- Manejar errores
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH;
END;

go
CREATE PROCEDURE InsertarPromocionInventarioYAplicar
    @ID_Promocion INT,
    @ID_Inventario INT
AS
BEGIN
    BEGIN TRY
        -- Insertar la relación en PromocionInventario
        EXEC InsertarPromocionInventario @ID_Promocion, @ID_Inventario;

        -- Verificar si la inserción fue exitosa antes de aplicar las promociones
        IF @@ROWCOUNT > 0
        BEGIN
            -- Aplicar promociones al Inventario después de insertar la relación
            EXEC AplicarPromocionesAlInventario;
        END
        ELSE
        BEGIN
            PRINT 'Error: La inserción en PromocionInventario no fue exitosa.';
        END
    END TRY
    BEGIN CATCH
        -- Manejar errores
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH;
END;
go 
CREATE VIEW VistaHistorialUsuario AS
SELECT
    H.PKHistorialUsuari,
    U.LoginUsuario ,
    H.ColumnaModificada,
    H.ValorAntiguo,
    H.ValorNuevo,
    H.FechaModificacion,
    H.UsuarioModificacion,
    H.TipoOperacion,
    U.NumSesiones,
    U.FechaInicioSesion,
    U.FechaFinSesion
FROM
    HistorialUsuario H
JOIN
    USUARIO U ON H.IdUsuario = U.IdUsuario;
	/*  Insert into   Empleados (Nombre,Apellido,Direccion,Telefono,idUsuario,Estado) values ('omar', 'Navas', 'ni se','4444',1, 'Activo') */
	  go 
	  CREATE PROCEDURE ProcesoDevolucionVenta
    @CodigoVenta NVARCHAR(100),
    @DetalleDevolucion XML,
    @ID_Empleado INT,
    @Fecha DATE
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si la venta existe
        IF NOT EXISTS (SELECT 1 FROM Ventas WHERE CodigoVenta = @CodigoVenta)
        BEGIN
            THROW 50000, 'La venta especificada no existe.', 1;
            RETURN;
        END

        -- Tabla temporal para almacenar los detalles de la devolución
        DECLARE @Devoluciones TABLE
        (
            ID_Inventario INT,
            CantidadDevuelta INT,
            Motivo VARCHAR(200)
        );

        -- Variables para el cursor
        DECLARE @ID_Inventario INT;
        DECLARE @CantidadDevuelta INT;
        DECLARE @Motivo VARCHAR(200);
        DECLARE @MontoTotalDevuelto DECIMAL(10, 2) = 0;
        DECLARE @CodigoNotaCredito NVARCHAR(100);
        DECLARE @ID_Devolucion INT;

        -- Insertar los detalles de devolución en la tabla temporal
        INSERT INTO @Devoluciones (ID_Inventario, CantidadDevuelta, Motivo)
        SELECT
            D.Detalle.value('(ID_Inventario)[1]', 'INT'),
            D.Detalle.value('(CantidadDevuelta)[1]', 'INT'),
            D.Detalle.value('(Motivo)[1]', 'VARCHAR(200)')
        FROM @DetalleDevolucion.nodes('/DetalleDevolucion/Detalle') AS D(Detalle);

        -- Iterar sobre las devoluciones y procesar cada una
        DECLARE DevolucionesCursor CURSOR FOR
        SELECT ID_Inventario, CantidadDevuelta, Motivo
        FROM @Devoluciones;

        OPEN DevolucionesCursor;
        FETCH NEXT FROM DevolucionesCursor INTO @ID_Inventario, @CantidadDevuelta, @Motivo;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Obtener información del detalle de la venta
            DECLARE @MontoDevuelto DECIMAL(10, 2);

SELECT @MontoDevuelto = ((PrecioVenta - Descuento) + (PrecioVenta - Descuento) * 0.15) * @CantidadDevuelta
FROM DetalleVenta
WHERE CodigoVenta = @CodigoVenta AND ID_Inventario = @ID_Inventario;


            -- Restar la cantidad devuelta al detalle de la venta original
            UPDATE DetalleVenta
            SET Cantidad = Cantidad - @CantidadDevuelta
            WHERE CodigoVenta = @CodigoVenta AND ID_Inventario = @ID_Inventario;



     

            -- Insertar la devolución en la tabla DevolucionesVentas
            INSERT INTO DevolucionesVentas (CodigoVenta, ID_Inventario, ID_Empleado, CantidadDevuelta, Motivo, Fecha)
            VALUES (@CodigoVenta, @ID_Inventario, @ID_Empleado, @CantidadDevuelta, @Motivo, @Fecha);
			-- Declarar una variable para almacenar la suma del Total
DECLARE @SumaTotalDetalleVenta DECIMAL(10, 2);
			      -- Calcular los nuevos valores para Total, IVA y Subtotal
       -- Verificar si la cantidad devuelta es 0 y si el ID del inventario coincide
IF (SELECT Cantidad FROM DetalleVenta WHERE CodigoVenta = @CodigoVenta AND ID_Inventario = @ID_Inventario) = 0
BEGIN
    -- Bloque de código si la cantidad devuelta es 0
    UPDATE Ventas
    SET Estado = 'Devolución',
        Total = 0
    WHERE CodigoVenta = @CodigoVenta;

    -- Opcional: Desactivar el detalle de la venta afectada
    UPDATE DetalleVenta
    SET Total = 0,
        Subtotal = 0,
        IVA = 0,
        Estado = 'Devolución'
    WHERE CodigoVenta = @CodigoVenta AND ID_Inventario = @ID_Inventario;
END
ELSE
BEGIN
-- Calcular la suma del Total para el CodigoVenta específico
SELECT @SumaTotalDetalleVenta = SUM(Total)
FROM DetalleVenta
WHERE CodigoVenta = @CodigoVenta;

-- Actualizar el campo Total en la tabla Ventas con la suma calculada
UPDATE Ventas
SET Total = @SumaTotalDetalleVenta
WHERE CodigoVenta = @CodigoVenta;
    -- Bloque de código si la cantidad devuelta no es 0
    UPDATE DetalleVenta
    SET
        Total = PrecioVenta * Cantidad,
        Subtotal = Total - Descuento,
        IVA = Subtotal * 0.15  -- Ajustar el cálculo del IVA al 15%
    WHERE CodigoVenta = @CodigoVenta AND ID_Inventario = @ID_Inventario;
END

            -- Obtener el ID de la devolución recién insertada
            SET @ID_Devolucion = SCOPE_IDENTITY();

            -- Actualizar las existencias en Inventario (reponer las unidades devueltas)
            UPDATE Inventario
            SET UnidadesExistencias = UnidadesExistencias + @CantidadDevuelta
            WHERE ID_Inventario = @ID_Inventario;

            SET @MontoTotalDevuelto = @MontoTotalDevuelto + @MontoDevuelto;

            FETCH NEXT FROM DevolucionesCursor INTO @ID_Inventario, @CantidadDevuelta, @Motivo;
        END;

        CLOSE DevolucionesCursor;
        DEALLOCATE DevolucionesCursor;

        -- Actualizar el estado de la venta a 'Devolución'
        UPDATE Ventas
        SET Estado = 'Devolución'
        WHERE CodigoVenta = @CodigoVenta;

        -- Crear la nota de crédito
        SET @CodigoNotaCredito = 'NC_' + CONVERT(NVARCHAR(50), NEWID());

-- Agrega estas líneas para redondear el monto:
DECLARE @MontoRedondeado DECIMAL(10, 2);
SET @MontoRedondeado = CASE
    WHEN (@MontoTotalDevuelto * 100) % 2 = 0 THEN -- Si el decimal 5 sigue a una cifra par
        ROUND(@MontoTotalDevuelto, 0) -- Redondea a la baja (0 decimales)
    ELSE -- Si el decimal 5 sigue a una cifra impar
        CEILING(@MontoTotalDevuelto) -- Redondea al alza
END;
        INSERT INTO NotasCredito (CodigoNotaCredito, ID_Devolucion, Monto, Fecha)
        VALUES (@CodigoNotaCredito, @ID_Devolucion, @MontoRedondeado, @Fecha);

        COMMIT TRANSACTION;
        PRINT 'Devolución procesada correctamente con Nota de Crédito (' + @CodigoNotaCredito + ').';
    END TRY
    BEGIN CATCH
        -- Manejar errores
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        PRINT 'Error: ' + @ErrorMessage;
        PRINT 'Error Severity: ' + CAST(@ErrorSeverity AS NVARCHAR(10));
        PRINT 'Error State: ' + CAST(@ErrorState AS NVARCHAR(10));
        PRINT 'CodigoVenta: ' + ISNULL(@CodigoVenta, 'NULL');
        PRINT 'DetalleDevolucion: ' + ISNULL(CONVERT(NVARCHAR(MAX), @DetalleDevolucion), 'NULL');
        PRINT 'ID_Empleado: ' + ISNULL(CAST(@ID_Empleado AS NVARCHAR(10)), 'NULL');
        PRINT 'Fecha: ' + ISNULL(CONVERT(NVARCHAR(10), @Fecha), 'NULL');
    END CATCH;
END;


go 

CREATE PROCEDURE GestionarVenta
    @CodigoVenta NVARCHAR(100),
    @FechaVenta DATE,
    @EstadoVenta NVARCHAR(50),
		@Subtotal DECIMAL(10, 2),
	@IVA DECIMAL(10, 2),
    @Total DECIMAL(10, 2),
    @DetallesVenta XML,
    @CodigoNotaCredito NVARCHAR(100) = NULL -- Nuevo parámetro para el código de la nota de crédito
AS
BEGIN
    BEGIN TRY
        -- Declarar variables locales
        DECLARE @ID_Venta INT;

        -- Iniciar una transacción
        BEGIN TRANSACTION;

        -- Si el estado es 'Completada' y se proporciona un código de nota de crédito
        IF @EstadoVenta = 'Completada' AND @CodigoNotaCredito IS NOT NULL
        BEGIN
            -- Verificar si la nota de crédito está activa
            IF NOT EXISTS (SELECT 1 FROM NotasCredito WHERE CodigoNotaCredito = @CodigoNotaCredito AND EstadoNotaCredito = 'Activa')
            BEGIN
                THROW 50000, 'La nota de crédito no está activa o no existe.', 1;
                RETURN;
            END

            -- Insertar la venta principal
            INSERT INTO Ventas (CodigoVenta, Fecha, Total,Subtotal ,IVA , Estado)
            VALUES (@CodigoVenta, @FechaVenta, @Total,@Subtotal,@IVA, @EstadoVenta);

            -- Obtener el ID de la venta recién insertada
            SET @ID_Venta = SCOPE_IDENTITY();

            -- Procesar cada detalle de la venta
            INSERT INTO DetalleVenta (
                CodigoVenta,
                ID_Inventario,
                ID_Empleado,
                PrecioVenta,
                Cantidad,
                Descuento,
                Total,
                Subtotal,
                IVA,
                Fecha,
                Estado
            )
            SELECT
                @CodigoVenta,
                D.Detalle.value('(ID_Inventario)[1]', 'INT'),
                D.Detalle.value('(ID_Empleado)[1]', 'INT'),
                D.Detalle.value('(PrecioVenta)[1]', 'MONEY'),
                D.Detalle.value('(Cantidad)[1]', 'INT'),
                D.Detalle.value('(Descuento)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Total)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Subtotal)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(IVA)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Fecha)[1]', 'DATE'),
                'Completada'
            FROM @DetallesVenta.nodes('/DetallesVenta/Detalle') AS D(Detalle);

            -- Actualizar el estado de la venta principal
            UPDATE Ventas
            SET Estado = 'Completada'
            WHERE ID_Venta = @ID_Venta;

            -- Actualizar el estado de los detalles de la venta
            UPDATE DetalleVenta
            SET Estado = 'Completada'
            WHERE CodigoVenta = @CodigoVenta;
			  -- Actualizar el estado de  DevolucionesVentas 
			 UPDATE DevolucionesVentas
    SET EstadoDevolucion = 'Procesada'
    WHERE CodigoVenta = @CodigoVenta;
            -- Actualizar las existencias en el inventario
            UPDATE Inventario
            SET UnidadesExistencias = UnidadesExistencias - D.Detalle.value('(Cantidad)[1]', 'INT')
            FROM @DetallesVenta.nodes('/DetallesVenta/Detalle') AS D(Detalle)
            WHERE Inventario.ID_Inventario = D.Detalle.value('(ID_Inventario)[1]', 'INT');

            -- Actualizar el estado de la nota de crédito a 'Utilizada', por ejemplo
            UPDATE NotasCredito
            SET EstadoNotaCredito = 'Utilizada'
            WHERE CodigoNotaCredito = @CodigoNotaCredito;
        END
        ELSE
        BEGIN
            -- Si no se proporciona un código de nota de crédito, realizar las acciones estándar sin considerar la nota de crédito
            -- Insertar la venta principal
            INSERT INTO Ventas (CodigoVenta, Fecha, Total,Subtotal ,IVA , Estado)
            VALUES (@CodigoVenta, @FechaVenta, @Total,@Subtotal,@IVA, @EstadoVenta);
            -- Obtener el ID de la venta recién insertada
            SET @ID_Venta = SCOPE_IDENTITY();

            -- Procesar cada detalle de la venta
            INSERT INTO DetalleVenta (
                CodigoVenta,
                ID_Inventario,
                ID_Empleado,
                PrecioVenta,
                Cantidad,
                Descuento,
                Total,
                Subtotal,
                IVA,
                Fecha,
                Estado
            )
            SELECT
                @CodigoVenta,
                D.Detalle.value('(ID_Inventario)[1]', 'INT'),
                D.Detalle.value('(ID_Empleado)[1]', 'INT'),
                D.Detalle.value('(PrecioVenta)[1]', 'MONEY'),
                D.Detalle.value('(Cantidad)[1]', 'INT'),
                D.Detalle.value('(Descuento)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Total)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Subtotal)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(IVA)[1]', 'DECIMAL(10,2)'),
                D.Detalle.value('(Fecha)[1]', 'DATE'),
                'Completada'
            FROM @DetallesVenta.nodes('/DetallesVenta/Detalle') AS D(Detalle);

            -- Actualizar el estado de la venta principal
            UPDATE Ventas
            SET Estado = 'Completada'
            WHERE ID_Venta = @ID_Venta;

            -- Actualizar el estado de los detalles de la venta
            UPDATE DetalleVenta
            SET Estado = 'Completada'
            WHERE CodigoVenta = @CodigoVenta;

            -- Actualizar las existencias en el inventario
            UPDATE Inventario
            SET UnidadesExistencias = UnidadesExistencias - D.Detalle.value('(Cantidad)[1]', 'INT')
            FROM @DetallesVenta.nodes('/DetallesVenta/Detalle') AS D(Detalle)
            WHERE Inventario.ID_Inventario = D.Detalle.value('(ID_Inventario)[1]', 'INT');
        END

        -- Commit de la transacción
        COMMIT;
    END TRY
    BEGIN CATCH
        -- Rollback en caso de error
        ROLLBACK;

        -- Manejar el error (puedes registrar el error en una tabla de registro de errores, por ejemplo)
        -- También puedes propagar el error hacia arriba utilizando THROW para que la aplicación cliente lo maneje
        THROW;
    END CATCH;
END;
go
CREATE VIEW VistaDevolucionesConNotaCredito AS
SELECT
    DV.ID_Devolucion,
    DV.CodigoVenta,
    E.Nombre AS NombreEmpleado,
    DV.CantidadDevuelta,
    DV.Motivo,
    DV.Fecha,
    DV.EstadoDevolucion,
    NC.CodigoNotaCredito,
    PZ.Nombre AS NombreProducto -- Cambiado a NombreProducto
FROM DevolucionesVentas DV
JOIN NotasCredito NC ON DV.ID_Devolucion = NC.ID_Devolucion
JOIN Empleados E ON DV.ID_Empleado = E.ID_Empleado -- Agregado para obtener el nombre del empleado
JOIN Inventario I ON DV.ID_Inventario = I.ID_Inventario -- Agregado para obtener el nombre del producto
JOIN Productos_Zapatos PZ ON I.ID_ProductoZapatos = PZ.ID_ProductoZapatos; -- Agregado para obtener el nombre del producto
go 
CREATE VIEW VistaNotasCredito
AS
SELECT
    ID_NotaCredito,
    CodigoNotaCredito,
    ID_Devolucion,
    Monto,
    Fecha,
    EstadoNotaCredito
FROM
    NotasCredito;


	go


	CREATE PROCEDURE InsertarConfiguracionAcceso
    @ConfiguracionesXML XML
AS
BEGIN
    -- Verificar si el XML tiene el formato esperado
    IF NOT EXISTS (SELECT 1 FROM @ConfiguracionesXML.nodes('/Configuraciones/Configuracion') AS XT(XC))
    BEGIN
	                THROW 50000, 'El formato del XML no es válido.', 1;
                RETURN;
       
    END

    -- Insertar configuraciones de acceso desde el XML
    INSERT INTO ConfiguracionAcceso (IdRecurso, IdAccion, IdRol)
    SELECT
        XC.value('(IdRecurso)[1]', 'INT') AS IdRecurso,
        XC.value('(IdAccion)[1]', 'INT') AS IdAccion,
        XC.value('(IdRol)[1]', 'INT') AS IdRol
    FROM @ConfiguracionesXML.nodes('/Configuraciones/Configuracion') AS XT(XC)
    WHERE NOT EXISTS (
        SELECT 1
        FROM ConfiguracionAcceso
        WHERE IdRecurso = XC.value('(IdRecurso)[1]', 'INT')
          AND IdAccion = XC.value('(IdAccion)[1]', 'INT')
          AND IdRol = XC.value('(IdRol)[1]', 'INT')
    );

    -- ¡Éxito!
    PRINT 'Configuraciones de acceso insertadas correctamente.';
END;
go
CREATE VIEW VistaConfiguracionAcceso AS
SELECT
    ca.IdConfiguracion,
    r.NombreRol AS Rol,
    a.NombreAccion AS Accion,
    rec.NombreRecurso AS Recurso,
    ca.Estado
FROM ConfiguracionAcceso ca
JOIN Roles r ON ca.IdRol = r.IdRol
JOIN Acciones a ON ca.IdAccion = a.IdAccion
JOIN Recursos rec ON ca.IdRecurso = rec.IdRecurso;

go
CREATE PROCEDURE ObtenerDevolucionPorCodigoVenta
    @CodigoVenta NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID_Devolucion,
        CodigoVenta,
        ID_Inventario,
        ID_Empleado,
        CantidadDevuelta,
        Motivo,
        Fecha,
        EstadoDevolucion
    FROM
        DevolucionesVentas
    WHERE
        CodigoVenta = @CodigoVenta;
END;

go
CREATE VIEW VistaInventarioCantidadCategoria AS
SELECT 
    PZ.ID_Categoria,
    C.Nombre AS 'Categoría del Producto',
    SUM(I.UnidadesExistencias) AS 'Cantidad en Inventario'
FROM 
    Inventario AS I
JOIN 
    Productos_Zapatos AS PZ ON I.ID_ProductoZapatos = PZ.ID_ProductoZapatos
JOIN
    Categorias AS C ON PZ.ID_Categoria = C.ID_Categoria
GROUP BY
    PZ.ID_Categoria, C.Nombre;

go
CREATE VIEW VistaInventario AS
SELECT 
    I.ID_Inventario,
    I.ID_BODEGA,
    I.ID_ProductoZapatos,
    I.ID_Marca,
    I.ID_Talla,
    I.ID_Colores,
    I.ID_MaterialZapatos,
    I.UnidadesExistencias,
    I.FechaIngreso,
    I.PrecioCompra,
    I.Descuento,
    I.PrecioVenta,
    I.ExistenciasMinimas,
    I.Estado,
    PZ.Nombre AS NombreProducto,
    M.Nombre AS NombreMarca,
    T.NumeroTalla AS TallaProducto,
    C.Color AS ColorProducto,
    MZ.TipoMaterial AS MaterialProducto,
    CA.Nombre AS NombreCategoria  -- Se agrega la columna NombreCategoria
FROM 
    Inventario AS I
JOIN 
    Productos_Zapatos AS PZ ON I.ID_ProductoZapatos = PZ.ID_ProductoZapatos
JOIN 
    Marcas AS M ON I.ID_Marca = M.ID_Marca
JOIN 
    Tallas AS T ON I.ID_Talla = T.ID_Talla
JOIN 
    Colores AS C ON I.ID_Colores = C.ID_Colores
JOIN 
    MaterialesZapatos AS MZ ON I.ID_MaterialZapatos = MZ.ID_MaterialZapatos
JOIN
    Categorias AS CA ON PZ.ID_Categoria = CA.ID_Categoria;  -- Se agrega la tabla Categorias y la relación con Productos_Zapatos



	go
	CREATE PROCEDURE ObtenerDetallesVentaPorCodigo
    @CodigoVenta NVARCHAR(100)
AS
BEGIN
    -- Verificar si la venta existe
    IF NOT EXISTS (SELECT 1 FROM Ventas WHERE CodigoVenta = @CodigoVenta)
    BEGIN
        -- Si no se encuentra la venta, terminar la ejecución
        RETURN;
    END

    -- Seleccionar los detalles de la venta y los productos asociados
    SELECT
        V.CodigoVenta,
        V.Fecha,
        V.Estado,
		V.Total as TotalGeneral,
		V.Subtotal as SubtotalGeneral,
		V.IVA as IvaGeneral,
        DV.ID_Inventario,
        DV.Cantidad,
        DV.PrecioVenta,
        DV.Descuento,
        DV.Total,
        DV.Subtotal,
        DV.IVA,
        I.ID_ProductoZapatos as Codigo,
        P.Nombre AS Nombre,
        I.ID_Marca,
        M.Nombre AS NombreMarca,
        I.ID_Talla,
        T.NumeroTalla AS NombreTalla,
        I.ID_Colores,
        Co.Color AS NombreColor,
        I.ID_MaterialZapatos,
        Mat.Nombre AS NombreMaterial,
        I.ID_BODEGA,
        B.Nombre AS NombreBodega,
        DV.ID_Empleado,
        E.Nombre AS NombreEmpleado
    FROM Ventas V
    INNER JOIN DetalleVenta DV ON V.CodigoVenta = DV.CodigoVenta
    INNER JOIN Inventario I ON DV.ID_Inventario = I.ID_Inventario
    LEFT JOIN Productos_Zapatos P ON I.ID_ProductoZapatos = P.ID_ProductoZapatos
    LEFT JOIN Marcas M ON I.ID_Marca = M.ID_Marca
    LEFT JOIN Tallas T ON I.ID_Talla = T.ID_Talla
    LEFT JOIN Colores Co ON I.ID_Colores = Co.ID_Colores
    LEFT JOIN MaterialesZapatos Mat ON I.ID_MaterialZapatos = Mat.ID_MaterialZapatos
    LEFT JOIN BODEGA B ON I.ID_BODEGA = B.ID_BODEGA
    LEFT JOIN Empleados E ON DV.ID_Empleado = E.ID_Empleado
    WHERE V.CodigoVenta = @CodigoVenta;
END;

go
CREATE PROCEDURE ObtenerDevolucionPorCodigoVenta
    @CodigoVenta NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID_Devolucion,
        CodigoVenta,
        ID_Inventario,
        ID_Empleado,
        CantidadDevuelta,
        Motivo,
        Fecha,
        EstadoDevolucion
    FROM
        DevolucionesVentas
    WHERE
        CodigoVenta = @CodigoVenta;
END;



go 
CREATE VIEW Vista_Inventario AS
SELECT 
    I.ID_Inventario,
    B.ID_BODEGA,
    PZ.ID_ProductoZapatos as Codigo,
    M.ID_Marca,
    T.ID_Talla,
    C.ID_Colores,
    MZ.ID_MaterialZapatos,
    B.Nombre AS NombreBodega,
    PZ.Nombre AS NombreProductoZapatos,
    M.Nombre AS NombreMarca,
    T.NumeroTalla,
    C.Color,
    MZ.Nombre AS NombreMaterialZapatos,
    I.UnidadesExistencias,
    I.FechaIngreso,
    I.PrecioCompra,
    I.Descuento,
    I.PrecioVenta,
    I.ExistenciasMinimas,
    I.Estado
FROM 
    Inventario I
JOIN 
    BODEGA B ON I.ID_BODEGA = B.ID_BODEGA
JOIN 
    Productos_Zapatos PZ ON I.ID_ProductoZapatos = PZ.ID_ProductoZapatos
JOIN 
    Marcas M ON I.ID_Marca = M.ID_Marca
JOIN 
    Tallas T ON I.ID_Talla = T.ID_Talla
JOIN 
    Colores C ON I.ID_Colores = C.ID_Colores
JOIN 
    MaterialesZapatos MZ ON I.ID_MaterialZapatos = MZ.ID_MaterialZapatos;
