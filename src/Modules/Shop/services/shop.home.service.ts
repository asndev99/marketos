import { companiesCategories } from '../../../Common/constants';
import { MongoCompanyRepository } from '../../Company/repository/company.repository';
import { Request } from 'express';
import { MongoProductRepository } from '../../Product/repository/product.repository';
import { discountedProductsDto } from '../../Product/dto';

const companyRepository = new MongoCompanyRepository();
const productRepository = new MongoProductRepository();

const getCategories = async (req: Request) => {
    return companiesCategories;
};

const getPopularCompanies = async (req: Request) => {
    return companyRepository.findMany({
        filter: {
            isPopular: true,
        },
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: 'popularityRate',
        sortOrder: 'desc',
    });
};

const getDiscountedProducts = async (req: Request) => {
    const { data, meta } = await productRepository.FindMany({
        filter: {
            status: 'DISCOUNTED',
            isDeleted: false,
        },
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortOrder: 'desc',
    });
    const result = discountedProductsDto(data);
    return {
        data: result,
        meta,
    };
};

export default {
    getCategories,
    getPopularCompanies,
    getDiscountedProducts,
};
