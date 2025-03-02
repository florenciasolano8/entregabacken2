import { Router } from "express";
import ticketController from "../controllers/ticket.controller.js";
import checkAuthRoles from "../middlewares/roles.middleware.js";
import { level_2 } from "../config/authProfiles.js";

const router = Router();

// Obtener todos los tickets 
router.get("/", checkAuthRoles(level_2), async (req, res) => {
  try {
    const allTickets = await ticketController.findAll();
    res.status(200).json({ status: "success", payload: allTickets });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Obtengo un ticket por ID
router.get("/:id", checkAuthRoles(level_2), async (req, res) => {
  try {
    const ticket = await ticketController.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ status: "error", message: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", payload: ticket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Crea un nuevo ticket
router.post("/", async (req, res) => {
  try {
    const newTicket = await ticketController.create(req.body);
    res.status(201).json({ status: "success", payload: newTicket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Actualizo un ticket por ID
router.put("/:id", checkAuthRoles(level_2), async (req, res) => {
  try {
    const updatedTicket = await ticketController.update(req.params.id, req.body);
    if (!updatedTicket) {
      return res.status(404).json({ status: "error", message: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedTicket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

router.delete("/:id", checkAuthRoles(level_2), async (req, res) => {
  try {
    const deletedTicket = await ticketController.delete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ status: "error", message: "Ticket no encontrado" });
    }
    res.status(200).json({ status: "success", payload: deletedTicket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

export default router;
