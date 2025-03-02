import CartDAO from "../dao/cart.dao.js";
import CartDTO from "../dto/cart.dto.js";

class CartController {
  async findAll(req, res) {
    try {
      const carts = await CartDAO.findAll();
      const cartsDTO = carts.map(cart => new CartDTO(cart));
      res.status(200).json({ status: "success", payload: cartsDTO });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async findById(req, res) {
    try {
      const cart = await CartDAO.findById(req.params.id);
      if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

      res.status(200).json({ status: "success", payload: new CartDTO(cart) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newCart = await CartDAO.create(req.body);
      res.status(201).json({ status: "success", payload: new CartDTO(newCart) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedCart = await CartDAO.update(req.params.id, req.body);
      if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

      res.status(200).json({ status: "success", payload: new CartDTO(updatedCart) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedCart = await CartDAO.delete(req.params.id);
      if (!deletedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

      res.status(200).json({ status: "success", payload: deletedCart });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
}

export default new CartController();
