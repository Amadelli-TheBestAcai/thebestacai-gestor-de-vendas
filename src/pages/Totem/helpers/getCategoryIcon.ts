import pot_easter from "../../../assets/totem/svg/pot_easter.svg";
import others_easter from "../../../assets/totem/svg/others_easter.svg";
import bottle_easter from "../../../assets/totem/svg/bottle_easter.svg";
import self_service_easter from "../../../assets/totem/svg/self_service_easter.svg";

interface Category {
  id: number;
  name: string;
  sort?: number;
  created_at?: string;
  deleted_at?: string;
}

export const getCategoryIcon = (_category: Category) => {
  if (_category?.name?.toLocaleLowerCase()?.includes("pote")) {
    return pot_easter;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("bebida")) {
    return bottle_easter;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("self")) {
    return self_service_easter;
  }
  return others_easter;
};
