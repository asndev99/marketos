import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../Utils/Error';
import { MongoProductRepository } from './repository/product.repository';
import { MongoCompanyRepository } from '../Company/repository/company.repository';
import { Types } from 'mongoose';
interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[];
    };
}
import { uploadBufferToCloudinary } from '../../Utils/helpers';

const companyRepository = new MongoCompanyRepository();
const productRepository = new MongoProductRepository();

const createNewProduct = async (req: MulterRequest, res: Response) => {
    let { price } = req.body;
    const userId = req?.user?._id;
    const companyDetails = await companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new BadRequestError('Company Not Found');
    }
    const companyId = companyDetails?._id;
    const createdProduct = await productRepository.create({
        companyId,
        ...req?.body,
    });
    const images = req?.files['productImage'];
    const data = await Promise.all(
        images.map(async (file) => {
            const { url } = await uploadBufferToCloudinary(
                file?.buffer,
                file.originalname,
                'products'
            );
            return { image: url, productId: createdProduct?._id as Types.ObjectId };
        })
    );
    await productRepository.createImage(data);

    return createdProduct?._id;
};

const getAllProducts = async (req: Request, res: Response) => {
    const userId = req?.user?._id;
    const companyDetails = await companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new BadRequestError('Company Not Found');
    }
    return await productRepository.findAll({ companyId: companyDetails?.id });
};

const getProduct = async (req: Request, res: Response) => {
    const userId = req?.user?._id;
    const { id } = req?.params;
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid product ID');
    }
    const companyDetails = await companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new BadRequestError('Company Not Found');
    }
    const data = await productRepository.findOneProduct({ _id: id, companyId: companyDetails?._id });
    if (!data) throw new NotFoundError('Product not found !');

    return data;
};

const editProduct = async (req: MulterRequest, res: Response) => {
    const userId = req?.user?._id;
    const { id } = req?.params;
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid product ID');
    }
    const companyDetails = await companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new BadRequestError('Company Not Found');
    }
    const data = await productRepository.findOneProduct({ _id: id });
    if (!data) throw new NotFoundError('Product not found !');

    if (Array.isArray(req.body?.imageIDs)) {
        const ids = req.body.imageIDs.map((id: string) => ({
            _id: new Types.ObjectId(id),
        }));
        await productRepository.deleteProductImages(ids);
    }

    const uploadedImages = req.files?.['productImage'];
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
        const imageData = await Promise.all(
            uploadedImages.map(async (file) => {
                const { url } = await uploadBufferToCloudinary(
                    file.buffer,
                    file.originalname,
                    'products'
                );
                return {
                    image: url,
                    productId: new Types.ObjectId(id),
                };
            })
        );
        await productRepository.createImage(imageData);
    }

    let discountedPrice = req.body?.discountedPrice;
    if (discountedPrice === 'null' || discountedPrice === null) {
        discountedPrice = null;
    }

    const updateData = {
        ...req.body,
        discountedPrice,
    };

    // Remove unnecessary fields
    delete updateData.imageIDs;

    await productRepository.updateProduct(new Types.ObjectId(id), updateData);
    return true;
};

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    return await productRepository.deleteProduct(new Types.ObjectId(id));
};

export default {
    createNewProduct,
    getAllProducts,
    getProduct,
    editProduct,
    deleteProduct,
};
