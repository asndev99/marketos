import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../Utils/Error';
import { MongoCompanyRepository } from './repository/company.repository';
import { MongoUserRepository } from '../User/repository/user.repository';
import { uploadBufferToCloudinary } from '../../Utils/helpers';
import { MongoOrderRepository } from '../Order/repository/order.repository';
import { ShopRepository } from '../Shop/repository/shop.repository';

const companyRepository = new MongoCompanyRepository();
const userRepository = new MongoUserRepository();
const orderRepository = new MongoOrderRepository();
const shopRepository = new ShopRepository();

const createCompanyDetails = async (req: Request, res: Response) => {
    let { numOfDistribution, companyName } = req.body;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const logoFile = files['logo']?.[0];
    const userId = req.user._id;

    numOfDistribution = Number(numOfDistribution);
    const isCompanyAlreadyExist = await companyRepository.findOne({
        userId,
        companyName,
    });

    if (isCompanyAlreadyExist) {
        throw new BadRequestError('Company already Created');
    }

    const { url: logo } = await uploadBufferToCloudinary(
        logoFile.buffer,
        logoFile.originalname,
        'companies'
    );

    const data = companyRepository.create({
        userId,
        ...req.body,
        profileLogo: logo,
    });
    await userRepository.findByIdAndUpdate(userId.toString(), { isProfileCompleted: true });
};

const getCompanyDetails = async (req: Request, res: Response) => {
    return companyRepository.findOne({ userId: req.user._id });
};

const allOrders = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();
    const orders = await orderRepository.allOrdersForCompany(companyId);

    const uniqueUserIds = [...new Set(orders.map((o) => o.userId.toString()))];
    const userCache = new Map<string, any>();
    await Promise.all(
        uniqueUserIds.map(async (userId) => {
            const user = await userRepository.findById(userId);
            const shopkeeper = await shopRepository.findOne({ userId });

            if (user && shopkeeper) {
                userCache.set(userId, {
                    ownerName: shopkeeper.ownerName,
                    shopName: shopkeeper.shopName,
                    mobileNumber: shopkeeper.mobileNumber,
                    shopAddress: shopkeeper.shopAddress,
                    landmark: shopkeeper.landMark,
                    latitude: shopkeeper.latitude,
                    longitude: shopkeeper.longitude,
                });
            }
        })
    );

    let result: any = [];
    await Promise.all(
        orders.map(async (order) => {
            const userId = order?.userId.toString();
            let total = 0;
            let products = order?.orderProducts.map((orderproduct) => {
                total = total + orderproduct?.price;
                return {
                    orderProductId: orderproduct?._id,
                    productId: orderproduct?.productId,
                    productName: orderproduct?.product?.name,
                    productImage: orderproduct?.product?.images[0]?.image,
                    quantity: orderproduct?.quantity,
                    price: orderproduct?.price,
                    orderTimeUnitProductPrice: orderproduct?.orderTimeUnitProductPrice,
                    isOrderPlaced: orderproduct?.isOrderPlaced,
                    orderStatus: orderproduct?.orderStatus,
                    PaymentMethod: orderproduct?.PaymentMethod,
                    paymentTransaction: {
                        paymentId: orderproduct?.paymentTransaction?._id,
                        amount: orderproduct?.paymentTransaction?.amount,
                        paymentStatus: orderproduct?.paymentTransaction?.paymentStatus,
                    },
                };
            });

            result.push({
                _id: order?._id,
                trackingNumber: order?.trackingNumber,
                orderID: order?.orderID,
                orderTime: order?.orderTime,
                orderTimeEpoch: order?.orderTimeEpoch,
                totalAmount: total,
                shopkeeprDetails: userCache.get(userId),
                products,
            });
        })
    );
    return result;
};

const singleOrder = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();
    const orderId = req.params.id;
    const order = await orderRepository.singleOrderForCompany(orderId, companyId);

    const userId = order?.userId.toString();

    const user = await userRepository.findById(userId);
    const shopkeeper = await shopRepository.findOne({ userId });
    let total = 0;
    let products = order?.orderProducts.map((orderproduct) => {
        total = total + orderproduct?.price;
        return {
            orderProductId: orderproduct?._id,
            productId: orderproduct?.productId,
            productName: orderproduct?.product?.name,
            productImage: orderproduct?.product?.images[0]?.image,
            quantity: orderproduct?.quantity,
            price: orderproduct?.price,
            orderTimeUnitProductPrice: orderproduct?.orderTimeUnitProductPrice,
            isOrderPlaced: orderproduct?.isOrderPlaced,
            orderStatus: orderproduct?.orderStatus,
            PaymentMethod: orderproduct?.PaymentMethod,
            paymentTransaction: {
                paymentId: orderproduct?.paymentTransaction?._id,
                amount: orderproduct?.paymentTransaction?.amount,
                paymentStatus: orderproduct?.paymentTransaction?.paymentStatus,
            },
        };
    });

    return {
        _id: order?._id,
        trackingNumber: order?.trackingNumber,
        orderID: order?.orderID,
        orderTime: order?.orderTime,
        orderTimeEpoch: order?.orderTimeEpoch,
        totalAmount: total,
        shopkeeperDetails: {
            ownerName: shopkeeper?.ownerName,
            shopName: shopkeeper?.shopName,
            mobileNumber: shopkeeper?.mobileNumber,
            shopAddress: shopkeeper?.shopAddress,
            landmark: shopkeeper?.landMark,
            latitude: shopkeeper?.latitude,
            longitude: shopkeeper?.longitude,
        },
        products,
    };
};

export default {
    createCompanyDetails,
    getCompanyDetails,
    allOrders,
    singleOrder
};
