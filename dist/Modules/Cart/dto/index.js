"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItemsDto = void 0;
const getCartItemsDto = (data) => {
    return data.length
        ? data.map((item) => {
            const isDiscounted = item.productId.status === "DISCOUNTED";
            const originalPricePerItem = item.productId.price;
            const discountedPricePerItem = isDiscounted
                ? item.productId.discountedPrice
                : item.productId.price;
            const actualPrice = originalPricePerItem * item.qty;
            const priceAfterDiscount = discountedPricePerItem * item.qty;
            const discountPercentage = isDiscounted
                ? ((actualPrice - priceAfterDiscount) / actualPrice) * 100
                : 0;
            return {
                cartId: item._id,
                qty: item.qty,
                actualEachPrice: originalPricePerItem,
                eachPriceAfterDiscount: discountedPricePerItem,
                actualPrice,
                priceAfterDiscount,
                productId: item.productId._id,
                isDiscounted,
                discountPercentage: parseFloat(discountPercentage.toFixed(2)),
                images: item.productId.images.map((img) => img === null || img === void 0 ? void 0 : img.image),
            };
        })
        : [];
};
exports.getCartItemsDto = getCartItemsDto;
