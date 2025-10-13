import express from 'express';
import { createChargingPoint,getAllChargingPoint,getChargingPoint ,updateChargingPoint,deleteChargingPoint,updateChargingPointStatus,getPointsByStationId} from '../controllers/ChargingPointController.js';

const router =express.Router();
router.post('/',createChargingPoint);
router.get('/',getAllChargingPoint);
router.get('/:id',getChargingPoint);
router.put('/:id',updateChargingPoint);
router.delete('/:id',deleteChargingPoint);
router.patch('/:id/status',updateChargingPointStatus);
router.get('/:stationId/points',getPointsByStationId);
export default router;