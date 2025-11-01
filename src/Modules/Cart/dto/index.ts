import { CartItemDto } from '../interface';

export const getCartItemsDto = (data: any, isSingleObject: boolean): CartItemDto[] => {
    const response = isSingleObject ? getCartItemDto(data) :
    data.length
        ? data.map((item: any) => {
              const isDiscounted = item.productId.status === 'DISCOUNTED';

              const originalPricePerItem = item.productId.price;
              const discountedPricePerItem = isDiscounted
                  ? item.productId.discountedPrice!
                  : item.productId.price;

              const actualPrice = originalPricePerItem * item.qty;
              const priceAfterDiscount = discountedPricePerItem * item.qty;

              const discountPercentage = isDiscounted
                  ? ((actualPrice - priceAfterDiscount) / actualPrice) * 100
                  : 0;
              return {
                  cartId: item._id,
                  qty: item.qty,
                  stockQuantity: item.productId.stockQuantity,
                  actualEachPrice: originalPricePerItem,
                  eachPriceAfterDiscount: discountedPricePerItem,
                  actualPrice,
                  priceAfterDiscount,
                  productId: item.productId._id,
                  companyId: item?.productId?.companyId,
                  productName: item?.productId?.name || 'No Name',
                  isDiscounted,
                  discountPercentage: parseFloat(discountPercentage.toFixed(2)),
                  images: item.productId.images.map((img: any) => img?.image),
              };
          })
        : [];

        return response;
};

const getCartItemDto = (item: any): any => {
    const isDiscounted = item.productId.status === 'DISCOUNTED';

    const originalPricePerItem = item.productId.price;
    const discountedPricePerItem = isDiscounted
        ? item.productId.discountedPrice!
        : item.productId.price;

    const actualPrice = originalPricePerItem * item.qty;
    const priceAfterDiscount = discountedPricePerItem * item.qty;

    const discountPercentage = isDiscounted
        ? ((actualPrice - priceAfterDiscount) / actualPrice) * 100
        : 0;
    return {
        cartId: item._id,
        qty: item.qty,
        stockQuantity: item.productId.stockQuantity,
        actualEachPrice: originalPricePerItem,
        eachPriceAfterDiscount: discountedPricePerItem,
        actualPrice,
        priceAfterDiscount,
        productId: item.productId._id,
        companyId: item?.productId?.companyId,
        productName: item?.productId?.name || 'No Name',
        isDiscounted,
        discountPercentage: parseFloat(discountPercentage.toFixed(2)),
        images: item.productId.images.map((img: any) => img?.image),
    };
};
