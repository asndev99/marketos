import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../Utils/Error';
import { MongoCompanyRepository } from './repository/company.repository';
import { MongoUserRepository } from '../User/repository/user.repository';
import { uploadBufferToCloudinary } from '../../Utils/helpers';
import { MongoOrderRepository } from '../Order/repository/order.repository';
import { ShopRepository } from '../Shop/repository/shop.repository';
import { getDayName } from '../../Utils/helpers';
import { IOrderProductDocument } from '../Order/order.model';

const companyRepository = new MongoCompanyRepository();
const userRepository = new MongoUserRepository();
const orderRepository = new MongoOrderRepository();
const shopRepository = new ShopRepository();

const createCompanyDetails = async (req: Request, res: Response) => {
    let { companyName } = req.body;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const logoFile = files['logo']?.[0];
    const userId = req.user._id;

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

    companyRepository.create({
        userId,
        ...req.body,
        profileLogo: logo,
    });
    await userRepository.findByIdAndUpdate(userId.toString(), { isProfileCompleted: true });
};

const updateCompanyDetails = async (req: Request, res: Response) => {
    const files = req?.files as Record<string, Express.Multer.File[]>;
    const logoFile = files['logo']?.[0];
    const userId = req.user._id;

    const isCompanyAlreadyExist = await companyRepository.findOne({
        userId
    });

    if (!isCompanyAlreadyExist) {
        throw new BadRequestError('Company Not Found');
    }

    let logo;
    if (logoFile) {
        const { url } = await uploadBufferToCloudinary(
            logoFile.buffer,
            logoFile.originalname,
            'companies'
        );
        logo = url;
    }

    await companyRepository.update(isCompanyAlreadyExist?.id.toString(), {
        ...req?.body,
        ...(logo && { profileLogo: logo }),
    });
    return true;
};

const getCompanyDetails = async (req: Request, res: Response) => {
    return companyRepository.findOne({ userId: req.user._id });
};

const allOrders = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();
    const status = req?.query.status as string;
    const orders = await orderRepository.allOrdersForCompany(status, companyId);

    const uniqueUserIds = [...new Set(orders.map((o) => o.userId.toString()))];
    const userCache = new Map<string, any>();
    await Promise.all(
        uniqueUserIds.map(async (userId) => {
            const user = await userRepository.findById(userId);
            const shopkeeper = await shopRepository.findOne({ userId });

            if (user && shopkeeper) {
                const [longitude, latitude] = shopkeeper.location.coordinates;
                userCache.set(userId, {
                    ownerName: shopkeeper.ownerName,
                    shopName: shopkeeper.shopName,
                    mobileNumber: shopkeeper.mobileNumber,
                    shopAddress: shopkeeper.shopAddress,
                    landmark: shopkeeper.landMark,
                    latitude: latitude,
                    longitude: longitude,
                });
            }
        })
    );

    let result: any = [];
    await Promise.all(
        orders.map(async (order) => {
            const userId = order?.userId.toString();
            let total = 0;
            let finalTotal = 0;
            let products = order?.orderProducts.map((orderproduct) => {
                total = total + orderproduct?.price;
                finalTotal = finalTotal + orderproduct?.finalPrice;
                return {
                    orderProductId: orderproduct?._id,
                    productId: orderproduct?.productId,
                    productName: orderproduct?.product?.name,
                    productImage: orderproduct?.product?.images[0]?.image,
                    quantity: orderproduct?.quantity,
                    price: orderproduct?.price,
                    deliveredQuantity: orderproduct?.deliveredQuantity,
                    finalPrice: orderproduct?.finalPrice,
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
                actutalTotalAmount: total,
                finalTotalAmount: finalTotal,
                shopkeeprDetails: userCache.get(userId),
                products,
            });
        })
    );
    return { data: result.reverse() };
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
    let finalTotal = 0;
    let products = order?.orderProducts.map((orderproduct) => {
        total = total + orderproduct?.price;
        finalTotal = finalTotal + orderproduct?.finalPrice;
        return {
            orderProductId: orderproduct?._id,
            productId: orderproduct?.productId,
            productName: orderproduct?.product?.name,
            productImage: orderproduct?.product?.images[0]?.image,
            quantity: orderproduct?.quantity,
            price: orderproduct?.price,
            deliveredQuantity: orderproduct?.deliveredQuantity,
            finalPrice: orderproduct?.finalPrice,
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

    // const [longitude, latitude] = shopkeeper?.location.coordinates;
    return {
        _id: order?._id,
        trackingNumber: order?.trackingNumber,
        orderID: order?.orderID,
        orderTime: order?.orderTime,
        orderTimeEpoch: order?.orderTimeEpoch,
        actutalTotalAmount: total,
        finalTotalAmount: finalTotal,
        shopkeeperDetails: {
            ownerName: shopkeeper?.ownerName,
            shopName: shopkeeper?.shopName,
            mobileNumber: shopkeeper?.mobileNumber,
            shopAddress: shopkeeper?.shopAddress,
            landmark: shopkeeper?.landMark,
            latitude: shopkeeper?.location.coordinates[1] ?? null,
            longitude: shopkeeper?.location.coordinates[0] ?? null,
        },
        products,
    };
};

const updateOrder = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    // const companyId: string = company?.id.toString();
    const { orderUpdate } = req?.body;
    await orderRepository.orderUpdateForCompany(orderUpdate);
    return true;
};

const updateOrderPaymentStatus = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    // const companyId: string = company?.id.toString();
    const { paymentUpdate } = req?.body;
    await orderRepository.paymentUpdateForCompanyOrder(paymentUpdate);
    return true;
};

const OrderAnalytics = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();

    const orders = await orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === 'DELIVERED' || order.orderStatus === 'RECEIVED'
    );
    const companyCancelled = orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = orders.filter((order) => order.orderStatus === 'PENDING');

    const weeklyDeliveredOrders = orderByWeek(deliveredOrders);
    const weeklyCompanyCancelled = orderByWeek(companyCancelled);
    const weeklyPending = orderByWeek(pending);

    return {
        weeklyDeliveredOrders: weeklyDeliveredOrders,
        weeklyCompanyCancelled: weeklyCompanyCancelled,
        weeklyPending: weeklyPending,
    };
};

const IncomeAnalytics = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();

    const orders = await orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter((order) => order.orderStatus === 'DELIVERED');

    const weeklyDeliveredOrders = incomeByWeek(deliveredOrders);

    return {
        weeklyIncome: weeklyDeliveredOrders,
    };
};

const pieChart = async (req: Request, res: Response) => {
    const company = await companyRepository.findOne({ userId: req.user._id });
    const companyId: string = company?.id.toString();

    const orders = await orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === 'DELIVERED' || order.orderStatus === 'RECEIVED'
    );
    const companyCancelled = orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = orders.filter((order) => order.orderStatus === 'PENDING');

    return {
        weeklyDeliveredOrdersPercentage: Math.round((deliveredOrders.length / orders.length) * 100),
        weeklyCompanyCancelledPercentage: Math.round(
            (companyCancelled.length / orders.length) * 100
        ),
        weeklyPendingPercentage: Math.round((pending.length / orders.length) * 100),
    };
};

function orderByWeek(orderdata: IOrderProductDocument[]) {
    try {
        const end = new Date();
        end.setUTCHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);

        const gte = start;
        const lte = end;

        // Group booking data by week
        const weeklyOrder = orderdata?.reduce((acc: any, data: IOrderProductDocument) => {
            const day = data?.createdAt.getUTCDate();
            const month = data?.createdAt.getUTCMonth() + 1;
            const year = data?.createdAt.getUTCFullYear();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;

            const dayName = getDayName(formattedDate);

            if (!acc[formattedDate]) {
                acc[formattedDate] = {
                    day: dayName,
                    count: 0,
                };
            }
            acc[formattedDate].count += 1;
            return acc;
        }, {});

        // Populate missing days in the current week
        let from = new Date(gte);
        const missingDates: any = {};

        while (from <= lte) {
            const dateStr = from.toISOString().split('T')[0];
            if (!weeklyOrder[dateStr]) {
                const dayName = getDayName(dateStr);
                missingDates[dateStr] = { day: dayName, count: 0 };
            }
            from.setDate(from.getDate() + 1);
        }

        // Merge weekly bookings and missing dates
        const processedData = { ...weeklyOrder, ...missingDates };

        const sortedData = Object.keys(processedData)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((key) => ({
                x: processedData[key].day,
                y: Number(processedData[key].count),
            }));

        return { data: sortedData };
    } catch (error) {
        return [];
    }
}

function incomeByWeek(orderdata: IOrderProductDocument[]) {
    try {
        const end = new Date();
        end.setUTCHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);

        const gte = start;
        const lte = end;

        // Group booking data by week
        const weeklyOrder = orderdata?.reduce((acc: any, data: IOrderProductDocument) => {
            const day = data?.createdAt.getUTCDate();
            const month = data?.createdAt.getUTCMonth() + 1;
            const year = data?.createdAt.getUTCFullYear();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;

            const dayName = getDayName(formattedDate);

            if (!acc[formattedDate]) {
                acc[formattedDate] = {
                    day: dayName,
                    income: 0,
                };
            }
            acc[formattedDate].income += data?.finalPrice;
            return acc;
        }, {});

        // Populate missing days in the current week
        let from = new Date(gte);
        const missingDates: any = {};

        while (from <= lte) {
            const dateStr = from.toISOString().split('T')[0];
            if (!weeklyOrder[dateStr]) {
                const dayName = getDayName(dateStr);
                missingDates[dateStr] = { day: dayName, income: 0 };
            }
            from.setDate(from.getDate() + 1);
        }

        // Merge weekly bookings and missing dates
        const processedData = { ...weeklyOrder, ...missingDates };

        const sortedData = Object.keys(processedData)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((key) => ({
                x: processedData[key].day,
                y: Number(processedData[key].income),
            }));

        return { data: sortedData };
    } catch (error) {
        return [];
    }
}

export default {
    createCompanyDetails,
    getCompanyDetails,
    allOrders,
    singleOrder,
    updateOrder,
    OrderAnalytics,
    IncomeAnalytics,
    pieChart,
    updateCompanyDetails,
    updateOrderPaymentStatus
};
