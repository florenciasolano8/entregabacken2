import Cart from "../models/cart.model.js";

class CartDAO {
  async create(cart) {
    const newCart = new Cart(cart);
    return await newCart.save();
  }

  async findById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async save(cart) {
    return await cart.save();
  }
}

export default new CartDAO();