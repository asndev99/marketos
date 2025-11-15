import mongoose from 'mongoose';
import { UserRole } from '../../../Common/constants';
import { CompanyModel } from '../../Company/company.model';
import { OrderProductModel, UserOrderModel } from '../../Order/order.model';
import { ProductModel } from '../../Product/product.model';
import { UserModel } from '../../User/user.model';

// DCFC -> DIRECT CALL FROM CONTROLLER
// IFH  -> IN FILE HELPER

//DCFC
export const getBusinessOverview = async () => {
    const [totalShopKeepers, totalCompanies, totalProducts, totalOrders] = await Promise.all([
        _getTotalUsersCountByType(UserRole.SHOPKEEPER),
        _getTotalUsersCountByType(UserRole.COMPANY),
        _getTotalProducts({ isDeleted: false }),
        _getOrderCount(),
    ]);

    return { totalShopKeepers, totalCompanies, totalProducts, totalOrders };
};

export const getOrderStatusDistribution = async (where = {}) => {
    return OrderProductModel.aggregate([
        {
            $match: {
                ...where,
            },
        },
        {
            $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                statuses: { $push: { status: '$_id', count: '$count' } },
            },
        },
        { $unwind: '$statuses' },
        {
            $project: {
                _id: 0,
                status: '$statuses.status',
                count: '$statuses.count',
                percentage: {
                    $multiply: [{ $divide: ['$statuses.count', '$total'] }, 100],
                },
            },
        },
    ]);
};

export const topSellingProducts = async () => {
    return OrderProductModel.aggregate([
        {
            $match: {
                orderStatus: 'RECEIVED',
            },
        },
        {
            $group: {
                _id: '$productId',
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $lookup: {
                from: 'productimages',
                localField: '_id',
                foreignField: 'productId',
                as: 'images',
            },
        },

        {
            $lookup: {
                from: 'companies',
                localField: 'product.companyId',
                foreignField: '_id',
                as: 'company',
            },
        },
        { $unwind: '$company' },

        {
            $project: {
                _id: 0,
                productId: '$_id',
                name: '$product.name',
                count: 1,
                images: 1,
                company: {
                    _id: '$company._id',
                    name: '$company.companyName',
                },
            },
        },

        { $sort: { count: -1 } },
    ]);
};

export const listAllCompanies = async () => {
    return CompanyModel.find({}).populate({
        path: 'userId',
    });
};

export const productList = async (companyId: string) => {
    return ProductModel.find({
        companyId: new mongoose.Types.ObjectId(companyId),
        isDeleted: false,
    }).populate('images'); // <-- Add this
};

export const companyDetails = async (companyId: string) => {
    const [totalProducts, totalOrders, totalRevenue, orderStatusDistribution] = await Promise.all([
        _getTotalProducts({ isDeleted: false, companyId }),
        _getSpecificComapnyOrderCount(companyId),
        _getTotalCompanyRevenue(companyId),
        getOrderStatusDistribution({ companyId: new mongoose.Types.ObjectId(companyId) }),
    ]);

    return {
        totalProducts,
        totalOrders: totalOrders[0]?.totalOrders ?? 0,
        totalRevenue: totalRevenue?.amount ?? 0,
        orderStatusDistribution,
    };
};

const _getTotalCompanyRevenue = async (companyId: string) => {
    return {
        amount: 56000,
    };
};

const _getTotalUsersCountByType = async (role: UserRole) => {
    return UserModel.countDocuments({
        isProfileCompleted: true,
        isDeleted: false,
        role: role,
    });
};

const _getTotalProducts = async (where = {}) => {
    return ProductModel.countDocuments({
        ...where,
    });
};

//need some fields to avoid aggregation every time for calculating total products orders and revenue.
const _getCompanyRevenue = async (companyId: string) => {
    // return OrderProductModel
};

const _getSpecificComapnyOrderCount = async (companyId: string) => {
    return OrderProductModel.aggregate([
        {
            $match: {
                companyId: new mongoose.Types.ObjectId(companyId),
            },
        },
        {
            $group: {
                _id: '$orderId',
            },
        },
        {
            $count: 'totalOrders',
        },
    ]);
};

const _getOrderCount = async (where = {}) => {
    return UserOrderModel.countDocuments({
        ...where,
    });
};

export const listOrder = async (where = {}) => {
    return UserOrderModel.find(where).populate({
        path: 'userId',
        select: '_id',
        populate: {
            path: 'shop',
            model: 'Shop',
            select: 'shopName mobileNumber',
        },
    });
};

export const orderDetails = async (orderId: string) => {
    return OrderProductModel.find({
        orderId: new mongoose.Types.ObjectId(orderId),
    }).populate([
        {
            path: 'productId',
            select: 'name',
        },
        {
            path: 'companyId',
            select: 'companyName profileLogo',
        },
    ]);
};

export const listAllProducts = async () => {
    return ProductModel.find({
        isDeleted: false,
    });
};
