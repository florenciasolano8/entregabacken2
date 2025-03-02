import { Router } from "express";
import CartService from "../services/CartService.js";
import handlePolicies from "../middlewares/handle-policies.js";
import { ROLES } from "../config/auth.config.js";

const router = Router();

// Finaliza compra (Solo  usuarios logueados)
router.post("/:cid/purchase", handlePolicies([ROLES.USER]), async (req, res) => {
  try {
    const { cid } = req.params;
    const { email } = req.user; 

    const purchaseResult = await CartService.finalizePurchase(cid, email);

    res.status(200).json({ status: "success", payload: purchaseResult });
  } catch (error) {
    res.status(error.code || 500).json({ status: "error", message: error.message });
  }
});

export default router;
