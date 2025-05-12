import { companiesCategories } from '../../../Common/constants';
import { MongoCompanyRepository } from '../../Company/repository/company.repository';
import { Request } from 'express';

const companyRepository = new MongoCompanyRepository();

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

export default {
    getCategories,
    getPopularCompanies,
};
