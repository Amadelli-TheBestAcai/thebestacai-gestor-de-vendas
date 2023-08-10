export interface CatalogItemDto {
  itemId: string;
  categoryId: string;
  itemExternalCode: string;
  categoryName: string;
  categoryIndex: number;
  itemName: string;
  itemDescription: string;
  logosUrls: string[];
  itemIndex: number;
  itemPrice: {
    value: number;
  };
  itemMinSalePrice: number;
  itemSchedules: string[];
  itemQuantity: number;
  itemUnit: string;
  itemOptionGroups: {
    optionGroupId: string;
    name: string;
    minQuantity: number;
    maxQuantity: number;
    optionGroupIndex: number;
    options: {
      optionId: string;
      name: string;
      logosUrls: string[];
      quantity: string;
      price: {
        value: string;
      };
    }[];
  }[];
  itemSellingOption: {
    minimum: number;
    incremental: number;
    availableUnits: string[];
  };
  itemGeneralTags: string[];
  itemProductTags: [
    {
      group: string;
      tags: string[];
    }
  ];
}
