import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../Utils/Error';
import mongoose, { Types, ClientSession } from 'mongoose';
import { MongoProductRepository } from '../Product/repository/product.repository';
import { MongoOrderRepository } from './repository/order.repository';
import { generateOrderID, generateTrackingNumber } from '../../Utils/helpers';
import { PaymentStatus, PaymentMethod, OrderStatus } from '../../Common/constants';
import { MongoCartRepository } from '../Cart/repository/cart.repository';

const productRepository = new MongoProductRepository();
const orderRepository = new MongoOrderRepository();
const cartRepository = new MongoCartRepository();

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
            if (product?.status === 'INACTIVE' || product?.isDeleted)
                throw new BadRequestError(`${product.name} is no longer available`);

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
    const allProducts = await Promise.all(
        orderDetails.map(async (product: productValidation) => {
            await cartRepository.RemoveProductFromCart({
                productId: (product?.productId).toString(),
                userId: userId.toString(),
            });
            return {
                orderId: newOrder?._id,
                productId: product?.productId,
                companyId: product?.companyId,
                quantity: product?.quantity,
                price: product?.totalPrice,
                deliveredQuantity: product?.quantity,
                finalPrice: product?.totalPrice,
                orderTimeUnitProductPrice: product?.orderTimePrice,
                PaymentMethod: product?.paymentMethod,
            };
        })
    );
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
    // await Promise.all(
    //     orderDetails.map( async (product: productValidation) => {
    //         await cartRepository.RemoveProductFromCart({productId: (product?.productId).toString(), userId: userId.toString() })
    //     })
    // )
    return true;
};

const allOrders = async (req: Request, res: Response) => {
    const {from , to} = req?.query as {from: string, to: string};
    const myOrders = await orderRepository.allOrders({ userId: req?.user?._id, from, to });
    return myOrders
        .map((order) => {
            let totalItems: number = 0;
            let totalPrice: number = 0;
            order?.orderProducts?.map((product) => {
                // totalItems = totalItems + product?.deliveredQuantity!;
                totalItems += 1;
                totalPrice = totalPrice + product?.finalPrice;
            });
            return {
                _id: order?._id,
                orderTime: order?.orderTime,
                orderTimeEpoch: order?.orderTimeEpoch,
                // totalPrice: order?.totalPrice,
                totalPrice: totalPrice,
                trackingNumber: order?.trackingNumber,
                orderID: order?.orderID,
                userId: order?.userId,
                noOfItems: totalItems,
            };
        })
        .reverse();
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
              //   totalPrice: myOrder?.totalPrice,
              totalPrice: myOrder?.orderProducts?.reduce(
                  (acc, product) => acc + (product?.finalPrice || 0),
                  0
              ),
              trackingNumber: myOrder?.trackingNumber,
              orderID: myOrder?.orderID,
              userId: myOrder?.userId,
              noOfItems: myOrder?.orderProducts?.reduce(
                  (acc, product) => acc + (product?.deliveredQuantity || 0),
                  0
              ),
              products: myOrder?.orderProducts?.map((product) => ({
                  orderProductId: product?._id,
                  productId: product?.productId,
                  productName: product?.product?.name,
                  productImage: product?.product?.images[0]?.image,
                  companyId: product?.companyId,
                  quantity: product?.quantity,
                  price: product?.price,
                  deliveredQuantity: product?.deliveredQuantity,
                  finalPrice: product?.finalPrice,
                  orderTimeUnitProductPrice: product?.orderTimeUnitProductPrice,
                  paymentMethod: product?.PaymentMethod,
                  orderStatus: product?.orderStatus,
                  cancelReason: (product?.orderStatus === "COMPANY_CANCELLED" || product?.orderStatus === "USER_CANCELLED") ? product?.cancelReason : null,
                  isOrderPlaced: product?.isOrderPlaced,
                  paymentTransaction: {
                      paymentId: product?.paymentTransaction?._id,
                      amount: product?.paymentTransaction?.amount,
                      paymentStatus: product?.paymentTransaction?.paymentStatus,
                  },
              })),
          }
        : null;
};

const pieAnalytics = async (req: Request, res: Response) => {
    const allIds = await orderRepository.orderIds((req?.user?._id).toString());
    const orders = await orderRepository.shopOrderAnalytics(allIds);
    const _orders = orders.filter((order) => order.orderStatus !== 'DELIVERED');

    const receivedOrders = _orders.filter((order) => order.orderStatus === 'RECEIVED');
    const companyCancelled = _orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = _orders.filter((order) => order.orderStatus === 'PENDING');

    return {
        weeklyReceivedOrdersPercentage: Math.round((receivedOrders.length / _orders.length) * 100),
        weeklyCompanyCancelledPercentage: Math.round(
            (companyCancelled.length / _orders.length) * 100
        ),
        weeklyPendingPercentage: Math.round((pending.length / _orders.length) * 100),
    };
};

const updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = req?.params?.id;
    const status = req?.query?.status as string;
    const data = await orderRepository.updateOrderForShop(orderId, status);
    return data;
};

const updateOrderPaymentStatus = async (req: Request, res: Response) => {
    const orderId = req?.params?.id;
    const status = req?.query?.status as string;
    await orderRepository.paymentUpdateForCompanyOrder([
        {
            orderId: new Types.ObjectId(orderId),
            status,
            price: 0,
            quantity: 0,
        },
    ]);
    return true;
};

export default {
    orderSummary,
    orderPlacement,
    allOrders,
    fetchSingleorder,
    pieAnalytics,
    updateOrderStatus,
    updateOrderPaymentStatus,
};
