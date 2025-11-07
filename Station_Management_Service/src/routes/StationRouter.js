import express from "express";
import { createStation,getAllStation,getStationById,deleteStation,updateStation,updateStationStatus,searchStations } from "../controllers/StationController.js"; 

const router=express.Router();

router.post('/', createStation);
// router.get('/search', searchStations); // GET /api/stations/search?keyword=...
router.get('/', getAllStation); // GET /api/stations -> Lấy tất cả + count
router.get('/:id', getStationById);
router.delete('/:id', deleteStation);
router.put('/:id', updateStation);
router.patch('/:id/status', updateStationStatus);

export default router;  