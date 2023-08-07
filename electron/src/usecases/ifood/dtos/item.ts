import { OptionGroupDto } from "./optionGroup";
import { PriceDto } from "./price";
import { ShiftDto } from "./shift";

export interface ItemDto {
  id: string;
  name: string;
  description: string;
  externalCode: string;
  status: string;
  sequence: number;
  index: number;
  productId: string;
  imagePath: string;
  price: PriceDto;
  shifts: ShiftDto[];
  serving: string;
  dietaryRestrictions: string[];
  optionGroups: OptionGroupDto[];
  hasOptionGroups: true;
  contextModifiers: null;
}
