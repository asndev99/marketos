import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../Utils/Error';
import { MongoCompanyRepository } from './repository/company.repository';
import { MongoUserRepository } from '../User/repository/user.repository';
import { uploadBufferToCloudinary } from '../../Utils/helpers';
import { MongoOrderRepository } from '../Order/repository/order.repository';
import { IOrderProductPopulatedDocument } from '../Order/interface';

const companyRepository = new MongoCompanyRepository();
const userRepository = new MongoUserRepository();
const orderRepository = new MongoOrderRepository();

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
    console.log('companyId: ', companyId);
    const orders = await orderRepository.allOrdersForCompany(companyId);

    const groupedByOrderId: Record<string, IOrderProductPopulatedDocument[]> = orders.reduce(
        (acc, item) => {
            const orderId = item.orderId.toString();
            if (!acc[orderId]) {
                acc[orderId] = [];
            }
            acc[orderId].push(item);
            return acc;
        },
        {} as Record<string, IOrderProductPopulatedDocument[]>
    );

    const result = Object.entries(groupedByOrderId).map(([orderId, products]) => ({
        orderId,
        products,
    }));
    return result;
};

export default {
    createCompanyDetails,
    getCompanyDetails,
    allOrders,
};
