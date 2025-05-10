import { NextFunction, Request } from 'express';
import { MongoProductRepository } from '../../Product/repository/product.repository';
import { MongoCompanyRepository } from '../repository/company.repository';
import { BadRequestError } from '../../../Utils/Error';
import { uploadBufferToCloudinary } from '../../../Utils/helpers';
import { Types } from 'mongoose';

const productRepository = new MongoProductRepository();
const companyRepository = new MongoCompanyRepository();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    let { price } = req.body;
    const userId = req.user._id;
    const files = req.files as Record<string, Express.Multer.File[]>;

    const companyDetails = await companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new BadRequestError('Company Not Found');
    }

    const companyId = companyDetails._id;
    const createdProduct = await productRepository.create({
        companyId,
        ...req?.body,
    });

    const images = files['productImage'];
    const data = await Promise.all(
        images.map(async (file) => {
            const { url } = await uploadBufferToCloudinary(
                file.buffer,
                file.originalname,
                'products'
            );
            return { image: url, productId: createdProduct._id as Types.ObjectId };
        })
    );
    return productRepository.createImage(data);
};

