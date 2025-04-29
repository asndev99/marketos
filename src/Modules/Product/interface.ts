export interface IProduct {
    name: String,
    description: String,
    category: String,
    sku: String,
    price: Number,
    currency: String,
    barcode: String,
    discountedPrice: Number,
    stockQuantity: Number,
    status: String,
    images: string[]
}