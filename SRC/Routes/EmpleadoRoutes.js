import { Router } from "express";
import {
    GetEmpleados,
    GetEmpleado,
    saveEmpleado,
    UpdateEmpleado,
    DarDeBaja,
    Activar
} from "../Controllers/EmpleadoController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Empleados",isAuthenticated, checkAccess, GetEmpleados);
router.get("/Empleado", GetEmpleado);
router.post("/Empleado", saveEmpleado);
router.put("/Empleado/:id", UpdateEmpleado);
router.put('/Empleado/DarDeBaja/:id', DarDeBaja);
router.put('/Empleado/Activar/:id', Activar);

export default router;
