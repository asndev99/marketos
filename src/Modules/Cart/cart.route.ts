import express from 'express';
const cartRouter = express.Router();
import { verifyUser } from '../../Middlewares/auth.middleware';
import cartController from './cart.controller';
import { validateSchema } from '../../Middlewares/validateSchema';
import { addToCartSchema } from './validation/addToCartSchema';

cartRouter.post('/shop', verifyUser, validateSchema(addToCartSchema), cartController.addToCart);
export default cartRouter;
