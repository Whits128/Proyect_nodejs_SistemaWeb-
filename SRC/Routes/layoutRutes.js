import { Router } from "express";

import { layouts } from "../Controllers/layaoutController";


const router = Router();

router.get("/", layouts);

export default router; 