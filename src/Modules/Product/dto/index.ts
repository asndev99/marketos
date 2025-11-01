import { IProductPopulatedDocument } from '../interface';
import { categoryMap } from '../../../Common/constants';

// Discount Percentage = (Discount Amount / Original Price) * 100
export const discountedProductsDto = (data: any[]) => {
    return data.length
        ? data.map((item: IProductPopulatedDocument) => {
              return {
                  ...item,
                  discountPercentage: item.discountedPrice !== null ? Math.round(( (item?.price - item.discountedPrice) / item.price ) * 100) : 0,
                  isDiscounted: item?.discountedPrice === null ? false : true,
                  categoryKey: Object.keys(categoryMap).find((key) => categoryMap[key] === item?.category),
                  images: item.images.length
                      ? item.images.map((i: any) => {
                            return {
                                productUrl: i.image,
                            };
                        })
                      : [],
              };
          })
        : [];
};
