"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountedProductsDto = void 0;
// Discount Percentage = (Discount Amount / Original Price) * 100
const discountedProductsDto = (data) => {
    return data.length
        ? data.map((item) => {
            return Object.assign(Object.assign({}, item), { discountPercentage: (item.discountedPrice / item.price) * 100, images: item.images.length ? item.images.map((i) => {
                    return {
                        productUrl: i.image
                    };
                }) : [] });
        })
        : [];
};
exports.discountedProductsDto = discountedProductsDto;
