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
-- Tabla de Recursos (páginas o funcionalidades)
CREATE TABLE Recursos (
    IdRecurso INT PRIMARY KEY IDENTITY(1,1),
    NombreRecurso NVARCHAR(100) UNIQUE NOT NULL
);
GO
-- Tabla de Configuración de Acceso
CREATE TABLE ConfiguracionAcceso (
    IdConfiguracion INT PRIMARY KEY IDENTITY(1,1),
    Ruta NVARCHAR(255) UNIQUE NOT NULL,
    IdRecurso INT FOREIGN KEY REFERENCES Recursos(IdRecurso),
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol)
);
GO

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




-- Tabla Promociones
CREATE TABLE Promociones (
    ID_Promocion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion VARCHAR(200),
    FechaInicio DATE,
    FechaFin DATE,
    Estado Nvarchar(50) DEFAULT 'Activo',
);


GO

-- Tabla PRODUCTOS_PROMOCIONES
CREATE TABLE PRODUCTOS_PROMOCIONES (
    ID_PRODUCTOS_PROMOCIONES INT PRIMARY KEY IDENTITY(1,1),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion)
);-- Tabla Inventario
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
	CodigoVenta nvarchar(max) NOT NULL,
    Total DECIMAL(10, 2),
    Fecha DATE,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla DetalleVenta
CREATE TABLE DetalleVenta (
    ID_DetalleVenta INT PRIMARY KEY IDENTITY(1,1),
	ID_Venta INT FOREIGN KEY REFERENCES Ventas(ID_Venta) NOT NULL,
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


 -- Llenar la tabla de Recursos con datos de ejemplo
INSERT INTO Recursos (NombreRecurso)
VALUES
       ('Gestión de Roles'),
       ('Asignar Permisos a Roles'),
       ('Gestión de Usuarios'),
       ('Restablecer Contraseña'),
	   ('Gestión de Recursos'),
       ('Asignar Recursos a Roles'),
       ('Configuración del Negocio'),
       ('Historial de Configuraciones'),
	      ('Gestión de Marcas'),
       ('Gestión de Colores'),
       ('Gestión de Categorías'),
       ('Gestión de Tallas'),
	     ('Gestión de Materiales'),
       ('Gestión de Empleados'),
	   ('Gestión de  Zapatos Dañados'),
       ('Registro de Zapatos Dañados'),
         ('Gestión de Promociones'),
       ('Asociar Productos a Promociones'),
	    ('Gestión de Bodegas'),
	   ('Registro de Movimientos de Bodegas'),
       ('Gestión de Inventario'),
	    ('Registro de Ventas'),
	    ('Detalle de Ventas'),
		('Gestión de Devoluciones'),
		('Gestión de Proveedores'),
		('Registro de Compras'),
		('Detalle de Compras'),
		('Registro de Facturas'),
		('Detalle de Facturas');
	 go
	   -- Insertar datos en la tabla "Roles"
INSERT INTO Roles (NombreRol)
VALUES
    ('Administrador'),
    ('Usuario Regular'),
    ('Moderador'),
    ('Invitado');
go 
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
-- Tabla PRODUCTOS_PROMOCIONES
INSERT INTO PRODUCTOS_PROMOCIONES (ID_ProductoZapatos, ID_Promocion)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);
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




go
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
