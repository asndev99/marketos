

const createProduct = (req: any, res: any, next: any) => {
  try {
  } catch (error) {
    console.log("Error in creating product", error);
    next(error);
  }
};

export default {
  createProduct,
};
