import express from "express";
import { createStation,getAllStation,getStationById,deleteStation,updateStation,updateStationStatus,searchStations } from "../controllers/StationController.js"; 

const router=express.Router();
router.get('/',searchStations)

router.post('/',createStation);
router.get('/',getAllStation);
router.get('/:id',getStationById);
router.delete('/:id',deleteStation);
router.put('/:id',updateStation);
router.patch('/:id/status',updateStationStatus);
export default router;