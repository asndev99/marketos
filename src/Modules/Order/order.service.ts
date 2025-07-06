import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../Utils/Error';
import { Types } from 'mongoose';
import { MongoProductRepository } from '../Product/repository/product.repository';
const productRepository = new MongoProductRepository();

const orderSummary = async (req: Request, res: Response) => {
    let orderCharges = 0;
    const { orderDetails } = req?.body;
    let orderSummary = await Promise.all(
        orderDetails.map(async (data: any) => {
            const product = await productRepository.findOneProduct({ _id: data?.productId });
            if (!product) throw new NotFoundError('Product not found !');

            const itemTotal =
                product?.discountedPrice !== null
                    ? product?.discountedPrice * data?.quantity
                    : product?.price * data?.quantity;
            orderCharges += itemTotal;
            return {
                productId: product?._id,
                image: product?.images[0]?.image,
                name: product?.name,
                description: product?.description,
                category: product?.category,
                price: product?.price,
                discount: product?.discountedPrice,
                itemCount: data?.quantity,
                itemTotal: itemTotal
            };
        })
    );

    return {
        orderSummary,
        orderCharges: Number(orderCharges.toFixed(2)),
    };
};

export default {
    orderSummary
}