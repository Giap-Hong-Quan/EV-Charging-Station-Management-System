import express from "express";
import { createStation,getAllStation } from "../controllers/StationController.js"; 

const router=express.Router();

router.post('/',createStation);
router.get('/',getAllStation)
export default router;