import ProductDAO from "../dao/product.dao.js";
import ProductDTO from "../dto/product.dto.js";

class ProductController {
  async findAll(req, res) {
    try {
      const products = await ProductDAO.findAll();
      const productsDTO = products.map(product => new ProductDTO(product));
      res.status(200).json({ status: "success", payload: productsDTO });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async findById(req, res) {
    try {
      const product = await ProductDAO.findById(req.params.id);
      if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

      res.status(200).json({ status: "success", payload: new ProductDTO(product) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newProduct = await ProductDAO.create(req.body);
      res.status(201).json({ status: "success", payload: new ProductDTO(newProduct) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedProduct = await ProductDAO.update(req.params.id, req.body);
      if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

      res.status(200).json({ status: "success", payload: new ProductDTO(updatedProduct) });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedProduct = await ProductDAO.delete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

      res.status(200).json({ status: "success", payload: deletedProduct });
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
}

export default new ProductController();
