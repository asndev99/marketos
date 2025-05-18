import express from 'express';
const cartRouter = express.Router();

import cartController from './cart.controller';

import { verifyUser } from '../../Middlewares/auth.middleware';
import { validateSchema } from '../../Middlewares/validateSchema';
import { addToCartSchema } from './validation/addToCartSchema';

cartRouter.post('/shop', verifyUser, validateSchema(addToCartSchema), cartController.addToCart);
cartRouter.get('/shop', verifyUser, cartController.getMyCart);
cartRouter.patch('/shop', verifyUser, cartController.removeFromCart);
export default cartRouter;
