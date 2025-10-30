import express from 'express';
const cartRouter = express.Router();

import cartController from './cart.controller';

import { verifyUser } from '../../Middlewares/auth.middleware';
import { validateSchema } from '../../Middlewares/validateSchema';
import { addToCartSchema } from './validation/addToCartSchema';
import { removeItemFromCart } from './validation/removeItemFromCartSchema';
import { updateCartSchema } from './validation/updateCartSchema';

cartRouter.post('/update-cart', verifyUser, validateSchema(addToCartSchema), cartController.addToCart);
cartRouter.get('/', verifyUser, cartController.getMyCart);
// cartRouter.patch(
//     '/update-cart',
//     verifyUser,
//     validateSchema(updateCartSchema),
//     cartController.editCart
// );
// cartRouter.patch(
//     '/',
//     verifyUser,
//     validateSchema(removeItemFromCart),
//     cartController.removeFromCart
// );

export default cartRouter;
