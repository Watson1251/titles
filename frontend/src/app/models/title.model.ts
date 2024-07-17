export interface Title {
  id: string;
  index: number;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  rarity: string;
  points: number;
  outof: number;
  descriptionAr: string;
  descriptionEn: string;
  notes: string;
}

export interface Info {
  id: string;
  index: number;
  userId: string;
  titleId: string;
  progress: number;
  status: string;
  timestamp: number;
  disabled: boolean;
}