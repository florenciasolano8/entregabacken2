import ProductModel from "../models/product.model.js";

class ProductDAO {
  async create(productData) {
    return await ProductModel.create(productData);
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async findAll({ page = 1, limit = 10, category } = {}) {
    const query = category ? { category: category.toUpperCase() } : {}; 
    return await ProductModel.paginate(query, { page, limit });
  }

  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();
