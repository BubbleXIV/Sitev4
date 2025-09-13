import React, { useState } from 'react';
import { Database } from '../types/supabase';
import { useMenuQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useCreateItemMutation, useUpdateItemMutation, useDeleteItemMutation } from '../helpers/useSupabaseQuery';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './Dialog';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { Plus, Edit, Trash2, Menu, DollarSign } from 'lucide-react';
import { z } from 'zod';
import styles from './MenuManagement.module.css';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  displayOrder: z.number().optional(),
});

const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().nullable().optional(),
  priceGil: z.number().int().positive("Price must be a positive number"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  categoryId: z.number(),
  displayOrder: z.number().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type ItemFormValues = z.infer<typeof itemSchema>;

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose }) => {
  const isEditing = !!category;
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();

  const form = useForm({
    schema: categorySchema,
    defaultValues: {
      name: category?.name ?? '',
      displayOrder: category?.displayOrder ?? undefined,
    },
  });

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditing) {
        await updateCategoryMutation.mutateAsync({ id: category.id, ...values });
      } else {
        await createCategoryMutation.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const isMutating = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        
        <div className={styles.formFields}>
          <FormItem name="name">
            <FormLabel>Category Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Drinks, Food, Specials"
                value={form.values.name}
                onChange={(e) => form.setValues(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="displayOrder">
            <FormLabel>Display Order (Optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1, 2, 3..."
                value={form.values.displayOrder?.toString() ?? ''}
                onChange={(e) => form.setValues(prev => ({ 
                  ...prev, 
                  displayOrder: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Saving...' : 'Save Category'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

interface ItemFormProps {
  item?: any;
  categories: any[];
  onClose: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, categories, onClose }) => {
  const isEditing = !!item;
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();

  const form = useForm({
    schema: itemSchema,
    defaultValues: {
      name: item?.name ?? '',
      description: item?.description ?? '',
      priceGil: item?.priceGil ?? 0,
      imageUrl: item?.imageUrl ?? '',
      categoryId: item?.categoryId ?? (categories[0]?.id ?? 0),
      displayOrder: item?.displayOrder ?? undefined,
    },
  });

  const handleSubmit = async (values: ItemFormValues) => {
    try {
      const submissionData = {
        ...values,
        imageUrl: values.imageUrl === "" ? null : values.imageUrl,
      };

      if (isEditing) {
        await updateItemMutation.mutateAsync({ id: item.id, ...submissionData });
      } else {
        await createItemMutation.mutateAsync(submissionData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const isMutating = createItemMutation.isPending || updateItemMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        
        <div className={styles.formFields}>
          <FormItem name="name">
            <FormLabel>Item Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Whiskey Sour, Grilled Salmon"
                value={form.values.name}
                onChange={(e) => form.setValues(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="description">
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the item..."
                value={form.values.description ?? ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="priceGil">
            <FormLabel>Price (Gil)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1000"
                value={form.values.priceGil.toString()}
                onChange={(e) => form.setValues(prev => ({ 
                  ...prev, 
                  priceGil: parseInt(e.target.value) || 0 
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="imageUrl">
            <FormLabel>Image URL (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.values.imageUrl ?? ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="categoryId">
            <FormLabel>Category</FormLabel>
            <FormControl>
              <select
                value={form.values.categoryId}
                onChange={(e) => form.setValues(prev => ({ 
                  ...prev, 
                  categoryId: parseInt(e.target.value) 
                }))}
                className={styles.select}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="displayOrder">
            <FormLabel>Display Order (Optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1, 2, 3..."
                value={form.values.displayOrder?.toString() ?? ''}
                onChange={(e) => form.setValues(prev => ({ 
                  ...prev, 
                  displayOrder: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Saving...' : 'Save Item'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export const MenuManagement: React.FC = () => {
  const { data: menuData, isFetching, error } = useMenuQuery();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const deleteItemMutation = useDeleteItemMutation();

  const [categoryDialog, setCategoryDialog] = useState<{ type: 'add' | 'edit' | null; data?: any }>({ type: null });
  const [itemDialog, setItemDialog] = useState<{ type: 'add' | 'edit' | null; data?: any }>({ type: null });
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'category' | 'item' | null; data?: any }>({ type: null });

  const handleDeleteCategory = async () => {
    if (!deleteDialog.data) return;
    try {
      await deleteCategoryMutation.mutateAsync({ id: deleteDialog.data.id });
      setDeleteDialog({ type: null });
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteDialog.data) return;
    try {
      await deleteItemMutation.mutateAsync({ id: deleteDialog.data.id });
      setDeleteDialog({ type: null });
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <Skeleton style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading menu data: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const categories = menuData?.categories ?? [];

  return (
    <div className={styles.container}>
      {/* Category Dialog */}
      <Dialog open={!!categoryDialog.type} onOpenChange={(open) => !open && setCategoryDialog({ type: null })}>
        <DialogTrigger asChild>
          <Button onClick={() => setCategoryDialog({ type: 'add' })}>
            <Plus size={16} />
            Add Category
          </Button>
        </DialogTrigger>
        {categoryDialog.type && (
          <DialogContent>
            <CategoryForm
              category={categoryDialog.type === 'edit' ? categoryDialog.data : undefined}
              onClose={() => setCategoryDialog({ type: null })}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={!!itemDialog.type} onOpenChange={(open) => !open && setItemDialog({ type: null })}>
        {itemDialog.type && (
          <DialogContent>
            <ItemForm
              item={itemDialog.type === 'edit' ? itemDialog.data : undefined}
              categories={categories}
              onClose={() => setItemDialog({ type: null })}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog.type} onOpenChange={(open) => !open && setDeleteDialog({ type: null })}>
        {deleteDialog.type && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Delete {deleteDialog.type === 'category' ? 'Category' : 'Item'}?
              </DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete "{deleteDialog.data?.name}"? 
              {deleteDialog.type === 'category' && " All items in this category will also be deleted."}
              This action cannot be undone.
            </p>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setDeleteDialog({ type: null })}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteDialog.type === 'category' ? handleDeleteCategory : handleDeleteItem}
                disabled={deleteCategoryMutation.isPending || deleteItemMutation.isPending}
              >
                {(deleteCategoryMutation.isPending || deleteItemMutation.isPending) ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className={styles.menuList}>
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <h3>{category.name}</h3>
                  <Badge variant="outline">{category.items.length} items</Badge>
                </div>
                <div className={styles.categoryActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setItemDialog({ type: 'add', data: { categoryId: category.id } })}
                  >
                    <Plus size={16} />
                    Add Item
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setCategoryDialog({ type: 'edit', data: category })}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteDialog({ type: 'category', data: category })}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className={styles.itemsList}>
                {category.items.length > 0 ? (
                  category.items.map(item => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          {item.description && (
                            <p className={styles.itemDescription}>{item.description}</p>
                          )}
                          <div className={styles.itemPrice}>
                            <DollarSign size={16} />
                            {item.priceGil.toLocaleString()} Gil
                          </div>
                        </div>
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className={styles.itemImage}
                          />
                        )}
                      </div>
                      <div className={styles.itemActions}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setItemDialog({ type: 'edit', data: item })}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteDialog({ type: 'item', data: item })}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyItems}>
                    <p>No items in this category yet.</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Menu size={48} />
            <h3>No menu categories yet</h3>
            <p>Create your first category to start building your menu.</p>
          </div>
        )}
      </div>
    </div>
  );
};
