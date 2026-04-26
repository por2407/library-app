const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cfg } = require('../config/env');
const { findUserByEmail, createUser, findUserById, updateUser } = require('../models/authModel');

exports.registerUser = async(name, email, password) => {
    const checkUser = await findUserByEmail(email);
    if (checkUser) {
        const error = new Error('User already exists');
        error.status = 409;
        throw error;
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    await createUser(name, email, hashedPassword);
    return;
}

exports.loginUser = async(email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, cfg.jwtSecret, { expiresIn: cfg.jwtExpiresIn });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

exports.getUserById = async(id) => {
    const user = await findUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.updateUserProfile = async(id, name, email) => {
    // Check if email is already taken by another user
    if (email) {
        const existingUser = await findUserByEmail(email);
        if (existingUser && existingUser.id !== id) {
            const error = new Error('Email already in use');
            error.status = 400;
            throw error;
        }
    }

    const updatedUser = await updateUser(id, { name, email });
    return updatedUser;
};