import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateprofile } from '../controllers/auth.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';

import { login, signup, logout } from '../controllers/auth.controller.js';


const router = express.Router(); // Create a router instance

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.put("/update-profile", protectRoute ,updateprofile);

router.get("/check", protectRoute , checkAuth)
export default router;