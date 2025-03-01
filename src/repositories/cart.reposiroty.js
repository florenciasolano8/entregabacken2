import CartDAO from "../daos/cart.dao.js";

class CartRepository {
 
    async create(cart) {
    return await CartDAO.create(cart);
  }

  async findById(id) {
    return await CartDAO.findById(id);
  }

  async save(cart) {
    return await CartDAO.save(cart);
  }

}

export default new CartRepository();