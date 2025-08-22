import { categoryMap, companiesCategories } from '../../../Common/constants';
import { MongoCompanyRepository } from '../../Company/repository/company.repository';
import { Request } from 'express';
import { MongoProductRepository } from '../../Product/repository/product.repository';
import { discountedProductsDto } from '../../Product/dto';
import { FilterQuery } from 'mongoose';
import { ICompanyDocument } from '../../Company/company.model';
import { IProductDocument } from '../../Product/product.model';

const companyRepository = new MongoCompanyRepository();
const productRepository = new MongoProductRepository();

const getCategories = async (req: Request) => {
    return Object.keys(categoryMap).map((item) => ({
        key: item,
        value: categoryMap[item],
    }));
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

const getAllCompanies = async (req: Request) => {
    return companyRepository.findMany({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: 'popularityRate',
        sortOrder: 'desc',
    });
};

const getCategoryProducts = async (req: Request) => {
    const { data, meta } = await productRepository.FindMany({
        filter: {
            category: categoryMap[req.query.category as string],
            isDeleted: false,
            stockQuantity: {
                $gt: 0,
            },
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

const getCompanyProducts = async (req: Request) => {
    let filter: FilterQuery<IProductDocument> = {
        companyId: req.params.id.toString(),
        isDeleted: false,
    };

    if (req.query.categoryName && categoryMap[req.query.categoryName as string]) {
        filter.category = categoryMap[req.query.categoryName as string];
    }

    const { data, meta } = await productRepository.FindMany({
        filter: {
            companyId: req.params.id.toString(),
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

const getCompaniesByProducts = async (req: Request) => {
    return companyRepository.findMany({
        filter: { category: req.query.category as string },
    });
};

export default {
    getCategories,
    getPopularCompanies,
    getDiscountedProducts,
    getAllCompanies,
    getCategoryProducts,
    getCompanyProducts,
    getCompaniesByProducts,
};
