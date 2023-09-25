interface DeliveryAddressDto {
  streetName: string;
  streetNumber: string;
  formattedAddress: string;
  neighborhood: string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface DeliveryDto {
  mode: string;
  deliveredBy: string;
  deliveryDateTime: string;
  observations: string;
  deliveryAddress: DeliveryAddressDto;
}

interface OrderItemDto {
  unitPrice: number;
  quantity: number;
  externalCode: string;
  totalPrice: number;
  index: number;
  unit: string;
  ean: string;
  price: number;
  scalePrices: {
    defaultPrice: number;
    scales: [
      {
        minQuantity: number;
        price: number;
      }
    ];
  };
  observations: string;
  imageUrl: string;
  name: string;
  options: [
    {
      unitPrice: number;
      unit: string;
      ean: string;
      quantity: number;
      externalCode: string;
      price: number;
      name: string;
      index: number;
      id: string;
      addition: number;
    }
  ];
  id: string;
  optionsPrice: number;
}

interface MerchantDto {
  id: string;
  name: string;
}

interface PhoneDto {
  number: string;
  localizer: string;
  localizerExpiration: string;
}

interface CustomerDto {
  id: string;
  name: string;
  documentNumber: string;
  phone: PhoneDto;
  ordersCountOnMerchant: number;
  segmentation: string;
}

interface TotalOrderDto {
  subTotal: number;
  deliveryFee: number;
  benefits: number;
  orderAmount: number;
  additionalFees: number;
}

interface OrderPaymentMethodDto {
  value: number;
  currency: string;
  method: string;
  type: string;
  card: {
    brand: string;
  };
  prepaid: boolean;
}

interface OrderPaymentDto {
  prepaid: number;
  pending: number;
  methods: OrderPaymentMethodDto[];
}

interface OrderAdditionalInfoDto {
  metadata: {
    customerEmail: string;
    developerEmail: string;
    developerId: string;
  };
}

export interface OrderDto {
  id: string;
  fullCode: string;
  code: string;
  delivery: DeliveryDto;
  orderType: string;
  orderTiming: string;
  displayId: string;
  createdAt: string;
  preparationStartDateTime: string;
  isTest: boolean;
  merchant: MerchantDto;
  customer: CustomerDto;
  items: OrderItemDto[];
  salesChannel: string;
  total: TotalOrderDto;
  payments: OrderPaymentDto;
  additionalInfo: OrderAdditionalInfoDto;
}

export interface IfoodDto {
  id: string;
  new_orders: number;
  is_opened?: boolean;
  merchant_id?: string;
  authorizationCode?: string;
  authorizationCodeVerifier?: string;
  merchant?: any;
  status?: string;
  token?: string;
  token_expired_at?: Date;
  refresh_token?: string;
  orders: OrderDto[];
  updated_at?: Date;
}
