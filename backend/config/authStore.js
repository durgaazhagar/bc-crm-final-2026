const bcrypt = require('bcryptjs');

// Simple in-memory user store for development fallback
const users = new Map();

const makeId = () => `mem_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

const findByEmail = async (email) => {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
};

const findById = async (id) => {
  return users.get(id) || null;
};

const createUser = async ({ name, email, password, role = 'admin' }) => {
  const existing = await findByEmail(email);
  if (existing) throw new Error('User already exists');
  const id = makeId();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = { id, name, email, password: hashed, role, createdAt: new Date() };
  users.set(id, user);
  return { id, name: user.name, email: user.email, role: user.role };
};

const setResetToken = async ({ email, resetPasswordToken, resetPasswordExpires }) => {
  const user = await findByEmail(email);
  if (!user) return null;
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;
  return user;
};

const findByResetToken = async (token) => {
  for (const user of users.values()) {
    if (user.resetPasswordToken === token && user.resetPasswordExpires > Date.now()) {
      return user;
    }
  }
  return null;
};

const updatePassword = async (user, password) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  users.set(user.id, user);
  return user;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  setResetToken,
  findByResetToken,
  updatePassword,
  // For testing
  _store: users,
};
