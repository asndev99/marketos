import { categoryMap } from '../../../Common/constants';
import { MongoCompanyRepository } from '../../Company/repository/company.repository';
import { Request } from 'express';
import { MongoProductRepository } from '../../Product/repository/product.repository';
import { discountedProductsDto } from '../../Product/dto';
import { FilterQuery } from 'mongoose';
import { IProductDocument, ProductModel } from '../../Product/product.model';
import { validate } from 'uuid';

const companyRepository = new MongoCompanyRepository();
const productRepository = new MongoProductRepository();

const getCategories = async (req: Request) => {
    return Object.keys(categoryMap).map((item) => ({
        key: item,
        value: categoryMap[item],
    }));
};

const getPopularCompanies = async (req: Request) => {
    return companyRepository.findMany(undefined, {
        filter: {
            isPopular: true,
            isDeleted: false,
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
            // status: 'DISCOUNTED',
            discountedPrice: { $ne: null },
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
    return companyRepository.findMany(undefined, {
        filter: {
            isDeleted: false,
        },
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
            ...filter,
            companyId: req.params.id.toString(),
            isDeleted: false,
        },
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortOrder: 'desc',
    });
    const companyCategories = await companyRepository.findCompanyCategories(
        req.params.id.toString()
    );
    const categories = companyCategories.map((category) => {
        const key = Object.keys(categoryMap).find((key) => categoryMap[key] === category);
        return {
            key: key,
            value: category,
        };
    });
    const result = discountedProductsDto(data);
    return {
        data: { data: result, categories },
        meta,
    };
};

const getCompaniesByProducts = async (req: Request) => {
    const mappedCategory = categoryMap[req.query.category as string];
    return companyRepository.findMany(mappedCategory, {
        filter: { isDeleted: false },
    });
};

const similarProducts = async (req: Request) => {
    const sameCategoryProducts = await getCategoryProducts(req);
    const sameCompanyProducts = await getCompanyProducts(req);

    return {
        sameCategoryProducts,
        sameCompanyProducts,
    };
};

const debounceSearch = async (req: Request) => {
    const { searchTerm } = req.query;
    if (!searchTerm) {
        return [];
    }

    if (searchTerm.toString().length <= 2) {
        return [];
    }

    return ProductModel.aggregate([
        {
            $search: {
                index: 'default',
                compound: {
                    should: [
                        {
                            text: {
                                query: searchTerm,
                                path: 'name',
                                score: { boost: { value: 5 } },
                            },
                        },
                        {
                            autocomplete: {
                                query: searchTerm,
                                path: 'name',
                                fuzzy: { maxEdits: 1 },
                            },
                        },
                    ],
                },
            },
        },
        { $limit: 20 },
        {
            $project: {
                _id: 1,
                name: 1,
                productId: 1,
                companyId: 1,
                category: 1,
            },
        },
    ]);
};

const search = async(req:Request) => {
    return "";
}

export default {
    search,
    debounceSearch,
    getCategories,
    getPopularCompanies,
    getDiscountedProducts,
    getAllCompanies,
    getCategoryProducts,
    getCompanyProducts,
    getCompaniesByProducts,
    similarProducts,
};
