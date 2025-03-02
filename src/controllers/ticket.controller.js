import TicketDAO from "../dao/ticket.dao.js";
import TicketDTO from "../dto/ticket.dto.js";

class TicketController {
  async findAll(req, res) {
    try {
      const tickets = await TicketDAO.findAll();
      const ticketsDTO = tickets.map(ticket => new TicketDTO(ticket));
      res.status(200).json({ status: "success", payload: ticketsDTO });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async findById(req, res) {
    try {
      const ticket = await TicketDAO.findById(req.params.id);
      if (!ticket) return res.status(404).json({ status: "error", message: "Ticket no encontrado" });

      res.status(200).json({ status: "success", payload: new TicketDTO(ticket) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newTicket = await TicketDAO.create(req.body);
      res.status(201).json({ status: "success", payload: new TicketDTO(newTicket) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedTicket = await TicketDAO.update(req.params.id, req.body);
      if (!updatedTicket) return res.status(404).json({ status: "error", message: "Ticket no encontrado" });

      res.status(200).json({ status: "success", payload: new TicketDTO(updatedTicket) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedTicket = await TicketDAO.delete(req.params.id);
      if (!deletedTicket) return res.status(404).json({ status: "error", message: "Ticket no encontrado" });

      res.status(200).json({ status: "success", payload: deletedTicket });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
}

export default new TicketController();
