import { Category } from "../../../../models/category.model";
import { Title } from "../../../../models/title.model";

export interface TitleDialogInterface {
  status: string;
  selectedTitle: Title;
  titles: Title[];
  categories: Category[];
}
