import TicketModel from "../models/ticket.model.js";

class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }
}

export default new TicketDAO();
