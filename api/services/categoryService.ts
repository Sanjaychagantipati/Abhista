import { db } from '../utils/db.js';
import { CategoryType } from '@prisma/client';

export interface CategoryInput {
  name: string;
  slug: string;
  categoryType: 'BLUE_COLLAR' | 'WHITE_COLLAR';
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  parentId?: number | null;
  isActive?: boolean;
  displayOrder?: number;
}

export async function getActiveCategories() {
  return await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string) {
  return await db.serviceCategory.findUnique({
    where: { slug },
  });
}

export async function createCategory(input: CategoryInput) {
  // 1. Validations
  validateCategoryInput(input);

  // 2. Check Name Uniqueness
  const existingName = await db.serviceCategory.findUnique({
    where: { name: input.name },
  });
  if (existingName) {
    throw new Error('Category name already exists');
  }

  // 3. Check Slug Uniqueness
  const existingSlug = await db.serviceCategory.findUnique({
    where: { slug: input.slug },
  });
  if (existingSlug) {
    throw new Error('Category slug already exists');
  }

  // 4. Create Category
  return await db.serviceCategory.create({
    data: {
      name: input.name,
      slug: input.slug,
      categoryType: input.categoryType as CategoryType,
      description: input.description,
      imageUrl: input.imageUrl,
      icon: input.icon,
      parentId: input.parentId,
      isActive: input.isActive !== undefined ? input.isActive : true,
      displayOrder: input.displayOrder !== undefined ? input.displayOrder : 0,
    },
  });
}

export async function updateCategory(id: number, input: Partial<CategoryInput>) {
  // 1. Check if category exists
  const existingCategory = await db.serviceCategory.findUnique({
    where: { id },
  });
  if (!existingCategory) {
    throw new Error('Category not found');
  }

  // 2. Validate partial inputs
  if (input.categoryType) {
    validateCategoryType(input.categoryType);
  }
  if (input.name && input.name === '') {
    throw new Error('Category name cannot be blank');
  }
  if (input.slug && input.slug === '') {
    throw new Error('Category slug cannot be blank');
  }

  // 3. Check name uniqueness if changed
  if (input.name && input.name !== existingCategory.name) {
    const conflictName = await db.serviceCategory.findUnique({
      where: { name: input.name },
    });
    if (conflictName) {
      throw new Error('Category name already exists');
    }
  }

  // 4. Check slug uniqueness if changed
  if (input.slug && input.slug !== existingCategory.slug) {
    const conflictSlug = await db.serviceCategory.findUnique({
      where: { slug: input.slug },
    });
    if (conflictSlug) {
      throw new Error('Category slug already exists');
    }
  }

  // 5. Update category
  return await db.serviceCategory.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      categoryType: input.categoryType ? (input.categoryType as CategoryType) : undefined,
      description: input.description,
      imageUrl: input.imageUrl,
      icon: input.icon,
      parentId: input.parentId,
      isActive: input.isActive,
      displayOrder: input.displayOrder,
    },
  });
}

export async function deleteCategory(id: number) {
  // Check if category exists
  const existingCategory = await db.serviceCategory.findUnique({
    where: { id },
  });
  if (!existingCategory) {
    throw new Error('Category not found');
  }

  return await db.serviceCategory.delete({
    where: { id },
  });
}

// Validation Helpers
function validateCategoryInput(input: CategoryInput) {
  if (!input.name || input.name.trim() === '') {
    throw new Error('Category name is required');
  }
  if (!input.slug || input.slug.trim() === '') {
    throw new Error('Category slug is required');
  }
  if (!input.categoryType) {
    throw new Error('Category type is required');
  }
  validateCategoryType(input.categoryType);
}

function validateCategoryType(type: string) {
  if (type !== 'BLUE_COLLAR' && type !== 'WHITE_COLLAR') {
    throw new Error('Invalid category type. Must be BLUE_COLLAR or WHITE_COLLAR');
  }
}
