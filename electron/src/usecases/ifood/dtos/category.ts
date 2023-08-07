import { ItemDto } from "./item";

export interface CategoryDto {
  id: string;
  name: string;
  status: string;
  sequence: number;
  index: number;
  template: string;
  items: ItemDto[];
}
