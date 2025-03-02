import { Router } from "express";
import ticketController from "../controllers/ticket.controller.js";
import handlePolicies from "../middlewares/handle-policies.js";
import { ROLES } from "../config/auth.config.js";

const router = Router();

router.get("/", handlePolicies([ROLES.ADMIN]), async (req, res) => {
  try {
    const allTickets = await ticketController.findAll();
    res.status(200).json({ status: "success", payload: allTickets });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Obtener un ticket por ID (Solo el usuario que lo creó o ADMIN)
router.get("/:id", handlePolicies([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  try {
    const ticket = await ticketController.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ status: "error", message: "Ticket no encontrado" });
    }

    // Solo el usuario dueño del ticket o un admin puede verlo
    if (req.user.role !== ROLES.ADMIN && ticket.purchaser !== req.user.email) {
      return res.status(403).json({ status: "error", message: "Acceso denegado" });
    }

    res.status(200).json({ status: "success", payload: ticket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Crear nuevo ticket (Solo USUARIOS logueados)
router.post("/", handlePolicies([ROLES.USER]), async (req, res) => {
  try {
    const newTicketData = { ...req.body, purchaser: req.user.email };
    const newTicket = await ticketController.create(newTicketData);

    res.status(201).json({ status: "success", payload: newTicket });
  } catch (e) {
    res.status(500).json({ status: "error", code: 500, message: e.message });
  }
});

// Actualiza un ticket (Solo ADMIN)
router.put("/:id", handlePolicies([ROLES.ADMIN]), async (req, res) => {
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

// Elimina un ticket (Solo ADMIN)
router.delete("/:id", handlePolicies([ROLES.ADMIN]), async (req, res) => {
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
