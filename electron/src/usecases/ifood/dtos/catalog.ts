import { CatalogItemDto } from "./catalogItem";
import { CategoryDto } from "./category";

export interface CatalogDto {
  catalogId: string;
  context: string[];
  status: string;
  modifiedAt: string;
  groupId: string;
  categories: CategoryDto[];
  items?: CatalogItemDto[];
}
