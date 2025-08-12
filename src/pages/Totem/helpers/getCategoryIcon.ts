import pot from "../../../assets/totem/svg/pot.svg";
import others from "../../../assets/totem/svg/others.svg";
import bottle from "../../../assets/totem/svg/bottle.svg";
import self_service from "../../../assets/totem/svg/self_service.svg";

interface Category {
  id: number;
  name: string;
  sort?: number;
  created_at?: string;
  deleted_at?: string;
}

export const getCategoryIcon = (_category: Category) => {
  if (_category?.name?.toLocaleLowerCase()?.includes("pote")) {
    return pot;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("bebida")) {
    return bottle;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("self")) {
    return self_service;
  }
  return others;
};
