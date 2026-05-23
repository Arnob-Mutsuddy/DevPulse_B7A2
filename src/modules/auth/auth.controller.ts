import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import {  createUser, findByEmail } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import config from '../../config/index';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Name, email and password are required');
      return;
    }
    if (role && !['contributor', 'maintainer'].includes(role)) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Role must be contributor or maintainer');
      return;
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Email already exists');
      return;
    }

    const hpass = await bcrypt.hash(password, 7);

    const user = await createUser(name, email, hpass, role || 'contributor');

    sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something wrong', err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Email and password are required');
      return;
    }

    const user = await findByEmail(email);
    if (!user) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Invalid email or password');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Invalid email or password');
      return;
    }

    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(
      payload,
      config.secret,
      { expiresIn: '7d' }
    );

    const { password: _, ...withoutPass } = user;

    sendSuccess(res, StatusCodes.OK, 'Login successful', {
      token,
      user: withoutPass,
    });
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something wrong', err);
  }
};