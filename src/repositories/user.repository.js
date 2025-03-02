import UserDAO from "../daos/user.dao.js";

class UserRepository {
  async create(user) {
    return await UserDAO.create(user);
  }

  async findById(id) {
    return await UserDAO.findById(id);
  }

  async findByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  async update(id, user) {
    return await UserDAO.update(id, user);
  }

  async delete(id) {
    return await UserDAO.delete(id);
  }
}

export default new UserRepository();
