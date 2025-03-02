import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
  async create(product) {
    return await ProductDAO.create(product);
  }

  async findById(id) {
    return await ProductDAO.findById(id);
  }

  async findAll({ category, sort, page, limit }) {
    return await ProductDAO.findAll({ category, sort, page, limit });
  }

  async update(id, product) {
    return await ProductDAO.update(id, product);
  }

  async delete(id) {
    return await ProductDAO.delete(id);
  }
}

export default new ProductRepository();
