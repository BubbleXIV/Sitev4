import React, { useState } from 'react';
import { useAdminUsersQuery, useCreateAdminUserMutation, useUpdateAdminUserMutation, useDeleteAdminUserMutation } from '../helpers/useAdminUsersQuery';
import { Button } from './Button';
import { Input } from './Input';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './Dialog';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import { UserPlus, Edit, Trash2, User, Mail, Shield } from 'lucide-react';
import { z } from 'zod';
import styles from './AdminUserManagement.module.css';

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().min(1, "Display name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const updateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().min(1, "Display name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  user?: any;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const isEditing = !!user;
  const createUserMutation = useCreateAdminUserMutation();
  const updateUserMutation = useUpdateAdminUserMutation();

  const form = useForm({
    schema: isEditing ? updateUserSchema : createUserSchema,
    defaultValues: {
      email: user?.email ?? '',
      displayName: user?.displayName ?? '',
      username: user?.username ?? '',
      password: '',
    },
  });

  const handleSubmit = async (values: CreateUserFormValues | UpdateUserFormValues) => {
    try {
      if (isEditing) {
        const updateData = { id: user.id, ...values };
        // Remove password if it's empty
        if (!values.password) {
          delete updateData.password;
        }
        await updateUserMutation.mutateAsync(updateData);
      } else {
        await createUserMutation.mutateAsync(values as CreateUserFormValues);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      form.setFieldError('email', `Save failed: ${errorMessage}`);
    }
  };

  const isMutating = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Admin User' : 'Add Admin User'}</DialogTitle>
        </DialogHeader>
        
        <div className={styles.formFields}>
          <FormItem name="email">
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={form.values.email}
                onChange={(e) => form.setValues(prev => ({ ...prev, email: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="displayName">
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input
                placeholder="John Doe"
                value={form.values.displayName}
                onChange={(e) => form.setValues(prev => ({ ...prev, displayName: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="username">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                placeholder="johndoe"
                value={form.values.username}
                onChange={(e) => form.setValues(prev => ({ ...prev, username: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="password">
            <FormLabel>
              Password {isEditing && <span className={styles.optional}>(leave blank to keep current)</span>}
            </FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={isEditing ? "Enter new password" : "Enter password"}
                value={form.values.password}
                onChange={(e) => form.setValues(prev => ({ ...prev, password: e.target.value }))}
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
            {isMutating ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export const AdminUserManagement: React.FC = () => {
  const { data: usersData, isFetching, error } = useAdminUsersQuery();
  const deleteUserMutation = useDeleteAdminUserMutation();

  const [userDialog, setUserDialog] = useState<{ type: 'add' | 'edit' | null; data?: any }>({ type: null });
  const [deleteDialog, setDeleteDialog] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await deleteUserMutation.mutateAsync({ id: deleteDialog.id });
      setDeleteDialog(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingList}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.userCardSkeleton}>
              <Skeleton style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} />
              <div className={styles.userInfoSkeleton}>
                <Skeleton style={{ width: '150px', height: '1.25rem' }} />
                <Skeleton style={{ width: '200px', height: '1rem' }} />
                <Skeleton style={{ width: '100px', height: '1rem' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading admin users: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const users = usersData?.users ?? [];

  return (
    <div className={styles.container}>
      {/* User Dialog */}
      <Dialog open={!!userDialog.type} onOpenChange={(open) => !open && setUserDialog({ type: null })}>
        <DialogTrigger asChild>
          <Button onClick={() => setUserDialog({ type: 'add' })}>
            <UserPlus size={16} />
            Add Admin User
          </Button>
        </DialogTrigger>
        {userDialog.type && (
          <DialogContent>
            <UserForm
              user={userDialog.type === 'edit' ? userDialog.data : undefined}
              onClose={() => setUserDialog({ type: null })}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        {deleteDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Admin User?</DialogTitle>
            </DialogHeader>
            <div className={styles.deletePreview}>
              <Avatar>
                <AvatarImage src={deleteDialog.avatarUrl || undefined} alt={deleteDialog.displayName} />
                <AvatarFallback>{deleteDialog.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p><strong>{deleteDialog.displayName}</strong></p>
                <p>{deleteDialog.email}</p>
                <p>Are you sure you want to delete this admin user? This action cannot be undone.</p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setDeleteDialog(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className={styles.usersList}>
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <Avatar>
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className={styles.userDetails}>
                  <h3 className={styles.userName}>{user.displayName}</h3>
                  <div className={styles.userMeta}>
                    <div className={styles.metaItem}>
                      <Mail size={14} />
                      {user.email}
                    </div>
                    <div className={styles.metaItem}>
                      <User size={14} />
                      @{user.username}
                    </div>
                    <div className={styles.metaItem}>
                      <Shield size={14} />
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                  <div className={styles.userDates}>
                    {user.createdAt && (
                      <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                    )}
                    {user.updatedAt && user.updatedAt !== user.createdAt && (
                      <span>Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.userActions}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setUserDialog({ type: 'edit', data: user })}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteDialog(user)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Shield size={48} />
            <h3>No admin users yet</h3>
            <p>Create your first admin user to manage the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};