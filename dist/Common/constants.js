"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = exports.categoryMap = exports.companiesCategories = exports.OrderStatus = exports.PaymentMethod = exports.PaymentStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["COMPANY"] = "COMPANY";
    UserRole["RIDER"] = "RIDER";
    UserRole["SHOPKEEPER"] = "SHOPKEEPER";
    UserRole["BOOKKEEPER"] = "BOOKKEEPER";
})(UserRole || (exports.UserRole = UserRole = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["RECEIVED"] = "RECEIVED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CREDIT"] = "CREDIT";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["NEW"] = "PENDING";
    OrderStatus["ACCEPTED"] = "ACCEPTED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["USER_CANCELLED"] = "USER_CANCELLED";
    OrderStatus["RECEIVED"] = "RECEIVED";
    OrderStatus["COMPANY_CANCELLED"] = "COMPANY_CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
exports.companiesCategories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Paintry Staples',
    'Beverages',
    'Snacks & Confactionery',
    'Frozen Foods',
    'Canned & Jarred Goods',
    'Pasta,Rice & Grains',
    'Condiments & Spices',
    'Breakfast Items',
    'Health & Organic Foods',
    'Baby Products',
    'Pet Supplies',
];
exports.categoryMap = {
    "FVGS": 'Fruits & Vegetables',
    "DE": 'Dairy & Eggs',
    "MT": "Meat & Seafood",
    "BK": "Bakery",
    "PS": "PaintryStaples",
    "BVGS": "Beverages",
    "SCT": 'Snacks & Confactionery',
    "FFDS": 'Frozen Foods',
    "CGDS": 'Canned & Jarred Goods',
    "PRGS": 'Pasta,Rice & Grains',
    "CPS": 'Condiments & Spices',
    "BRFI": "Breakfast Items",
    "HORFS": "Health & Organic Foods",
    "BPS": "Baby Products",
    "PTS": "Pet Supplies"
};
//for valdiation purpose
exports.roles = ['ADMIN', 'COMPANY', 'RIDER', 'SHOPKEEPER', 'BOOKKEEPER'];
