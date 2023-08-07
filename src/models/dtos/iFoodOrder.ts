export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface DeliveryAddress {
    streetName: string;
    streetNumber: string;
    formattedAddress: string;
    neighborhood: string;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    coordinates: Coordinates;
}

export interface Delivery {
    mode: string;
    deliveredBy: string;
    deliveryDateTime: string;
    observations: string;
    deliveryAddress: DeliveryAddress;
}

export interface Merchant {
    id: string;
    name: string;
}

export interface Phone {
    number: string;
    localizer: string;
    localizerExpiration: string;
}

export interface Customer {
    id: string;
    name: string;
    documentNumber: string;
    phone: Phone;
    ordersCountOnMerchant: number;
    segmentation: string;
}

export interface Item {
    index: number;
    id: string;
    uniqueId: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    optionsPrice: number;
    totalPrice: number;
    price: number;
}

export interface PaymentMethod {
    value: number;
    currency: string;
    method: string;
    type: string;
    card?: {
        brand: string;
    };
    prepaid: boolean;
}

export interface Total {
    subTotal: number;
    deliveryFee: number;
    benefits: number;
    orderAmount: number;
    additionalFees: number;
}

export interface AdditionalInfo {
    metadata: {
        customerEmail: string;
        developerEmail: string;
        developerId: string;
    };
}

export interface Order {
    id: string;
    delivery: Delivery;
    orderType: string;
    orderTiming: string;
    displayId: string;
    createdAt: string;
    preparationStartDateTime: string;
    isTest: boolean;
    merchant: Merchant;
    customer: Customer;
    items: Item[];
    salesChannel: string;
    total: Total;
    payments: {
        prepaid: number;
        pending: number;
        methods: PaymentMethod[];
    };
    additionalInfo: AdditionalInfo;
}
