import TicketDAO from "../dao/ticket.dao.js";
import TicketDTO from "../dto/ticket.dto.js";

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = await TicketDAO.create(ticketData);
    return new TicketDTO(ticket);
  }
}

export default new TicketRepository();
