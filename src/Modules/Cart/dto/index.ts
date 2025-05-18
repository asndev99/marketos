import { CartItemDto } from '../interface';

export const getCartItemsDto = (data: any): CartItemDto[] => {
    return data.length
        ? data.map((item: any) => {
              const isDiscounted = !!item.productId.discountedPrice;
              const price = isDiscounted ? item.productId.discountedPrice! : item.productId.price;
              const total = price * item.qty;

              return {
                  cartId: item._id,
                  qty: item.qty,
                  price,
                  total,
                  productId: item.productId._id,
                  isDiscounted: isDiscounted,
                  images: item.productId.images.map((item: any) => item?.image),
              };
          })
        : [];
};
