import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../Utils/Error';
import mongoose, { Types, ClientSession } from 'mongoose';
import { MongoProductRepository } from '../Product/repository/product.repository';
import { MongoOrderRepository } from './repository/order.repository';
import { generateOrderID, generateTrackingNumber } from '../../Utils/helpers';
import { PaymentStatus, PaymentMethod, OrderStatus } from '../../Common/constants';

const productRepository = new MongoProductRepository();
const orderRepository = new MongoOrderRepository();

interface productValidation {
    companyId: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    orderTimePrice: number;
    paymentMethod: PaymentMethod;
}

const orderSummary = async (req: Request, res: Response) => {
    let orderCharges: number = 0;
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
                companyId: product?.companyId,
                image: product?.images[0]?.image,
                name: product?.name,
                description: product?.description,
                category: product?.category,
                price: product?.price,
                discount: product?.discountedPrice,
                itemCount: data?.quantity,
                itemTotal: itemTotal,
            };
        })
    );

    return {
        orderSummary,
        orderCharges: Number(orderCharges.toFixed(2)),
    };
};

const orderPlacement = async (req: Request, res: Response, session: ClientSession) => {
    const { orderDetails } = req?.body;
    const userId = req?.user?._id;
    let totalBill: number = 0;
    orderDetails.map((product: productValidation) => {
        totalBill += product?.totalPrice;
    });
    const generateID: string = generateOrderID();
    const trackingNumber: string = generateTrackingNumber();
    const date = new Date();

    const newOrder = await orderRepository.createOrder(
        {
            orderID: generateID,
            orderTime: date,
            orderTimeEpoch: date.getTime(),
            userId: userId,
            trackingNumber: trackingNumber,
            totalPrice: totalBill,
        },
        session
    );
    const allProducts = orderDetails.map((product: productValidation) => {
        return {
            orderId: newOrder?._id,
            productId: product?.productId,
            companyId: product?.companyId,
            quantity: product?.quantity,
            price: product?.totalPrice,
            orderTimeUnitProductPrice: product?.orderTimePrice,
            PaymentMethod: product?.paymentMethod,
        };
    });
    const data = await orderRepository.createOrderProduct(allProducts, session);
    const paymentData = data.map((productData) => {
        return {
            orderProductId: productData?._id,
            companyId: productData?.companyId,
            amount: productData?.price,
            paymentStatus: PaymentStatus.PENDING,
        };
    });
    await orderRepository.createPaymentTransaction(paymentData, session);
    return true;
};

const allOrders = async (req: Request, res: Response) => {
    const myOrders = await orderRepository.allOrders({ userId: req?.user?._id });
    return myOrders.map((order) => {
        let totalItems: number = 0;
        order?.orderProducts?.map((product) => {
            totalItems = totalItems + product?.quantity!;
        });
        return {
            _id: order?._id,
            orderTime: order?.orderTime,
            orderTimeEpoch: order?.orderTimeEpoch,
            totalPrice: order?.totalPrice,
            trackingNumber: order?.trackingNumber,
            orderID: order?.orderID,
            userId: order?.userId,
            noOfItems: totalItems,
        };
    });
};

const fetchSingleorder = async (req: Request, res: Response) => {
    const myOrder = await orderRepository.singleOrder({
        _id: req?.params?.id,
        userId: req?.user?._id,
    });
    return myOrder !== null
        ? {
              _id: myOrder?._id,
              orderTime: myOrder?.orderTime,
              orderTimeEpoch: myOrder?.orderTimeEpoch,
              totalPrice: myOrder?.totalPrice,
              trackingNumber: myOrder?.trackingNumber,
              orderID: myOrder?.orderID,
              userId: myOrder?.userId,
              noOfItems: myOrder?.orderProducts?.reduce(
                  (acc, product) => acc + (product?.quantity || 0),
                  0
              ),
              orderProducts: myOrder?.orderProducts?.map((product) => ({
                  _id: product?._id,
                  productId: product?.productId,
                  companyId: product?.companyId,
                  quantity: product?.quantity,
                  price: product?.price,
                  orderTimeUnitProductPrice: product?.orderTimeUnitProductPrice,
                  paymentMethod: product?.PaymentMethod,
                  isOrderPlaced: product?.isOrderPlaced,
                  paymentTransaction: {
                      _id: product?.paymentTransaction?._id,
                      amount: product?.paymentTransaction?.amount,
                      paymentStatus: product?.paymentTransaction?.paymentStatus,
                  },
              })),
          }
        : null;
};

export default {
    orderSummary,
    orderPlacement,
    allOrders,
    fetchSingleorder,
};
