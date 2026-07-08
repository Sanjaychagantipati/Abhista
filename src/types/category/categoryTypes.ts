export type CategoryType = 'BLUE_COLLAR' | 'WHITE_COLLAR';

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  categoryType: CategoryType;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  parentId: number | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  categoryType: CategoryType;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  parentId?: number | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  categoryType?: CategoryType;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  parentId?: number | null;
  isActive?: boolean;
  displayOrder?: number;
}
