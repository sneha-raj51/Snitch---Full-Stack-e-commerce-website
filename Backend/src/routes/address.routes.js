import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/address.controller.js";

const router = Router();

router.get('/', authenticateUser, getAddresses);
router.post('/', authenticateUser, addAddress);
router.patch('/:addressId', authenticateUser, updateAddress);
router.delete('/:addressId', authenticateUser, deleteAddress);

export default router;
