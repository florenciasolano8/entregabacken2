import UserModel from "../models/user.model.js";

class UserDAO {
  async create(userData) {
    return await UserModel.create(userData);
  }

  async findById(id) {
    return await UserModel.findById(id).populate("cart");
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).populate("cart");
  }

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}

export default new UserDAO();
