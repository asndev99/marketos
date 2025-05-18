// Discount Percentage = (Discount Amount / Original Price) * 100
export const discountedProductsDto = (data: any[]) => {
    return data.length
        ? data.map((item) => {
              return {
                  ...item,
                  discountPercentage: (item.discountedPrice / item.price) * 100,
              };
          })
        : [];
};
