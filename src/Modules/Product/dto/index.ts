import { IProductPopulatedDocument } from "../interface";

// Discount Percentage = (Discount Amount / Original Price) * 100
export const discountedProductsDto = (data: any[]) => {
    return data.length
        ? data.map((item:IProductPopulatedDocument) => {
            return {
                ...item,
                discountPercentage: (item.discountedPrice / item.price) * 100,
                images: item.images.length ? item.images.map((i: any) => {
                    return {
                        productUrl:i.image
                    }   
                }) : []
              }
        })
        : [];
};
