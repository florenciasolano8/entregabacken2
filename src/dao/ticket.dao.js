import TicketModel from "../models/TicketModel.js";

class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }
}

export default new TicketDAO();
