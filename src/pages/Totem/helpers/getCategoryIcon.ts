import pot_wordcup from "../../../assets/totem/svg/pot_wordcup.svg";
import others_wordcup from "../../../assets/totem/svg/others_wordcup.svg";
import bottle_wordcup from "../../../assets/totem/svg/bottle_wordcup.svg";
import self_service_wordcup from "../../../assets/totem/svg/self_service_wordcup.svg";

interface Category {
  id: number;
  name: string;
  sort?: number;
  created_at?: string;
  deleted_at?: string;
}

export const getCategoryIcon = (_category: Category) => {
  if (_category?.name?.toLocaleLowerCase()?.includes("pote")) {
    return pot_wordcup;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("bebida")) {
    return bottle_wordcup;
  }
  if (_category?.name?.toLocaleLowerCase()?.includes("self")) {
    return self_service_wordcup;
  }
  return others_wordcup;
};
