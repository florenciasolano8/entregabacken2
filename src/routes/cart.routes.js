import { Router } from "express";
import CartService from "../services/CartService.js";

const router = Router();

router.post("/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    const { email } = req.body; // El email de usuario

    const purchaseResult = await CartService.finalizePurchase(cid, email);

    res.status(200).json({ status: "success", payload: purchaseResult });
  } catch (error) {
    res.status(error.code || 500).json({ status: "error", message: error.message });
  }
});

export default router;
