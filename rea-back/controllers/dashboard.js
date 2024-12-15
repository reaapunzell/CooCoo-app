import express from 'express';
import User from '../model/User.js'
import Task from '../model/Task.js';
import Group from '../model/Group.js';
import { authenticateUser } from '../middlewares/tokenValidation.js';

const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY
const router = express.Router();

router.get