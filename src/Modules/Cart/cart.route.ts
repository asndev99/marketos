import express from 'express';
const cartRouter = express.Router();

import cartController from './cart.controller';

import { verifyUser } from '../../Middlewares/auth.middleware';
import { validateSchema } from '../../Middlewares/validateSchema';
import { addToCartSchema } from './validation/addToCartSchema';

cartRouter.post('/update-cart', verifyUser, validateSchema(addToCartSchema), cartController.addToCart);
cartRouter.get('/', verifyUser, cartController.getMyCart);

export default cartRouter;
