const User = require("../model/User");
const ApiError = require("../model/ApiError");
const { hashPassword } = require("../util/hashing");

class UserDao {
  async create({ email, password, name, occupation }) {
    if (email === undefined || email === "") {
      throw new ApiError(400, "Every user must have a email!");
    }
    if (password === undefined || password === "") {
      throw new ApiError(400, "Every user must have a password!");
    }

    if (name === undefined || name === "") {
      throw new ApiError(400, "Every user must have a name!");
    }
    if (occupation === undefined || occupation === "") {
      throw new ApiError(400, "Every user must have a occupation!");
    }
    const hash = await hashPassword(password);
    const user = await User.create({ email, password: hash, name, occupation });
    return user;
  }

  async update(id, {email, password, name, occupation}) {
      const user = await User.findByIdAndUpdate(
          id,
          {email, password, name, occupation},
          {new: true, runValidators: true}
      );

      if (user === null) {
          throw new ApiError(404, "There is no user with the given ID!");
      }

      return user;
  }

  async delete(id) {
      const user = await User.findByIdAndDelete(id);

      if (user === null) {
          throw new ApiError(404, "There is no user with the given ID!");
      }

      return user;
  }

  // returns an empty array if there is no user with the given ID
  async read(id) {
    const user = await User.findById(id);
    return user ? user : [];
  }
  // returns null if no user matches the search query
  async readOne(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async readAll() {
    const users = await User.find({});
    return users;
  }
}

module.exports = UserDao;
