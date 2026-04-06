const prisma = require("../config/prisma");

exports.findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

exports.createUser = async (name, email, hashedPassword) => {
  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

exports.findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, role: true },
  });
};
