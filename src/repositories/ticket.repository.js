import TicketDAO from "../dao/TicketDAO.js";
import TicketDTO from "../dto/TicketDTO.js";

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = await TicketDAO.create(ticketData);
    return new TicketDTO(ticket);
  }
}

export default new TicketRepository();
