import { PriceDto } from "./price";
import { ShiftDto } from "./shift";

export interface Option {
  id: string;
  name: string;
  productId: string;
  status: string;
  sequence: number;
  index: number;
  price: PriceDto;
}

export interface OptionGroupDto {
  id: string;
  name: string;
  min: number;
  max: number;
  sequence: number;
  index: number;
  status: string;
  options: Option[];
}
