import { Router } from "express";

import {Inicios } from "../Controllers/InicioController";


const router = Router();
router.get("/Inicios", Inicios);
export default router; 