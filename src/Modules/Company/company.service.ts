import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../Utils/Error';
import { MongoCompanyRepository } from './repository/company.repository';
import { uploadBufferToCloudinary } from '../../Utils/helpers';

const companyRepository = new MongoCompanyRepository();

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

    return companyRepository.create({
        userId,
        ...req.body,
        profileLogo: logo,
    });
};

const getCompanyDetails = async (req: Request, res: Response) => {
    return companyRepository.findOne({ userId: req.user._id });
};

export default {
    createCompanyDetails,
    getCompanyDetails,
};
