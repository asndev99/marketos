import { UserRole } from '../../../Common/constants';
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
        _getTotalProducts(),
        _getOrderCount(),
    ]);

    return { totalShopKeepers, totalCompanies, totalProducts, totalOrders };
};

export const getOrderStatusDistribution = async () => {
    return OrderProductModel.aggregate([
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
    ]);
};

const _getTotalUsersCountByType = async (role: UserRole) => {
    return UserModel.countDocuments({
        isProfileCompleted: true,
        isDeleted: false,
        role: role,
    });
};

const _getTotalProducts = async () => {
    return ProductModel.countDocuments({
        isDeleted: false,
    });
};

const _getOrderCount = async () => {
    return UserOrderModel.countDocuments({});
};
