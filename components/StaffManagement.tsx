import React, { useState } from 'react';
import { Database } from '../types/supabase';
import { useStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation, useCreateStaffAltMutation, useUpdateStaffAltMutation, useDeleteStaffAltMutation } from '../helpers/useSupabaseQuery';
import { Button } from './Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from './Dialog';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { z } from 'zod';
import { Plus, Edit, Trash2, UserPlus, Users, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import styles from './StaffManagement.module.css';

type StaffMember = Database['public']['Tables']['staff']['Row'] | Database['public']['Tables']['staff_alts']['Row'];

type StaffWithAlts = Database['public']['Tables']['staff']['Row'] & {
  alts: Database['public']['Tables']['staff_alts']['Row'][];
};

const staffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  pictureUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  bio: z.string().nullable().optional(),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
  staffMember?: StaffMember;
  mainStaffId?: number; // For creating alts
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ staffMember, mainStaffId, onClose }) => {
  const isEditing = !!staffMember;
  const isAlt = 'staffId' in (staffMember || {});

  const createStaffMutation = useCreateStaffMutation();
  const updateStaffMutation = useUpdateStaffMutation();
  const deleteStaffMutation = useDeleteStaffMutation();
  const createAltMutation = useCreateStaffAltMutation();
  const updateAltMutation = useUpdateStaffAltMutation();
  const deleteAltMutation = useDeleteStaffAltMutation();

  const form = useForm({
    schema: staffFormSchema,
    defaultValues: {
      name: staffMember?.name ?? '',
      role: staffMember?.role ?? '',
      pictureUrl: staffMember?.pictureUrl ?? '',
      bio: staffMember?.bio ?? '',
    },
  });

  const handleSubmit = async (values: StaffFormValues) => {
    try {
      const submissionData = {
        ...values,
        pictureUrl: values.pictureUrl === "" ? null : values.pictureUrl,
      };

      if (isEditing) {
        if (isAlt) {
          await updateAltMutation.mutateAsync({ id: staffMember.id, ...submissionData });
        } else {
          await updateStaffMutation.mutateAsync({ id: staffMember.id, ...submissionData });
        }
      } else {
        if (mainStaffId) {
          await createAltMutation.mutateAsync({ staffId: mainStaffId, ...submissionData });
        } else {
          await createStaffMutation.mutateAsync(submissionData);
        }
      }
      onClose();
    } catch (error) {
      console.error("Failed to save staff member:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      form.setFieldError('name', `Submission failed: ${errorMessage}`);
    }
  };

  const isMutating = createStaffMutation.isPending || updateStaffMutation.isPending || createAltMutation.isPending || updateAltMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} {mainStaffId ? 'Alt' : 'Staff Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this staff member.' : 'Fill in the details for the new staff member.'}
          </DialogDescription>
        </DialogHeader>
        <div className={styles.formFields}>
          <FormItem name="name">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Character Name"
                value={form.values.name}
                onChange={(e) => form.setValues(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="role">
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Bartender, Security"
                value={form.values.role}
                onChange={(e) => form.setValues(prev => ({ ...prev, role: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="pictureUrl">
            <FormLabel>Picture URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://example.com/image.png"
                value={form.values.pictureUrl ?? ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, pictureUrl: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="bio">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="A short bio..."
                value={form.values.bio ?? ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
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
            {isMutating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const DeleteConfirmationDialog: React.FC<{
  staffMember: StaffMember;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ staffMember, onClose, onConfirm, isDeleting }) => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete {staffMember.name}?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete this staff member.
        { 'alts' in staffMember && (staffMember as StaffWithAlts).alts.length > 0 && " All associated alts will also be deleted."}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost" onClick={onClose} disabled={isDeleting}>Cancel</Button>
      <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </DialogFooter>
  </DialogContent>
);

export const StaffManagement: React.FC<{ staffList: StaffWithAlts[] }> = ({ staffList }) => {
  const [dialogState, setDialogState] = useState<{ type: 'add' | 'edit' | 'add_alt' | null; data?: StaffMember | { mainStaffId: number } }>({ type: null });
  const [deleteDialogState, setDeleteDialogState] = useState<StaffMember | null>(null);

  const deleteStaffMutation = useDeleteStaffMutation();
  const deleteAltMutation = useDeleteStaffAltMutation();

  const handleDelete = async () => {
    if (!deleteDialogState) return;
    try {
      if ('staffId' in deleteDialogState) {
        await deleteAltMutation.mutateAsync({ id: deleteDialogState.id });
      } else {
        await deleteStaffMutation.mutateAsync({ id: deleteDialogState.id });
      }
      setDeleteDialogState(null);
    } catch (error) {
      console.error("Failed to delete staff member:", error);
    }
  };

  const isDeleting = deleteStaffMutation.isPending || deleteAltMutation.isPending;

  return (
    <div className={styles.container}>
      <Dialog open={!!dialogState.type} onOpenChange={(open) => !open && setDialogState({ type: null })}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogState({ type: 'add' })}>
            <UserPlus size={16} /> Add Staff Member
          </Button>
        </DialogTrigger>
        {dialogState.type && (
          <DialogContent>
            <StaffForm
              staffMember={dialogState.type === 'edit' ? dialogState.data as StaffMember : undefined}
              mainStaffId={dialogState.type === 'add_alt' ? (dialogState.data as { mainStaffId: number }).mainStaffId : undefined}
              onClose={() => setDialogState({ type: null })}
            />
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!deleteDialogState} onOpenChange={(open) => !open && setDeleteDialogState(null)}>
        {deleteDialogState && (
          <DeleteConfirmationDialog
            staffMember={deleteDialogState}
            onClose={() => setDeleteDialogState(null)}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </Dialog>

      <div className={styles.staffList}>
        {staffList.length > 0 ? (
          staffList.map(staff => (
            <div key={staff.id} className={styles.staffCard}>
              <div className={styles.staffMember}>
                <div className={styles.staffInfo}>
                  <Avatar>
                    <AvatarImage src={staff.pictureUrl ?? undefined} alt={staff.name} />
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={styles.staffName}>{staff.name}</p>
                    <p className={styles.staffRole}>{staff.role}</p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDialogState({ type: 'edit', data: staff })}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteDialogState(staff)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className={styles.altsSection}>
                <div className={styles.altsHeader}>
                  <h4 className={styles.altsTitle}><Users size={14} /> Alts ({staff.alts.length})</h4>
                  <Button variant="outline" size="sm" onClick={() => setDialogState({ type: 'add_alt', data: { mainStaffId: staff.id } })}>
                    <Plus size={14} /> Add Alt
                  </Button>
                </div>
                {staff.alts.length > 0 ? (
                  <div className={styles.altsList}>
                    {staff.alts.map(alt => (
                      <div key={alt.id} className={styles.altMember}>
                        <div className={styles.staffInfo}>
                          <Avatar>
                            <AvatarImage src={alt.pictureUrl ?? undefined} alt={alt.name} />
                            <AvatarFallback>{alt.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={styles.staffName}>{alt.name}</p>
                            <p className={styles.staffRole}>{alt.role}</p>
                          </div>
                        </div>
                        <div className={styles.actions}>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDialogState({ type: 'edit', data: alt })}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteDialogState(alt)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noAlts}>No alts for this staff member.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noStaff}>No staff members have been added yet.</p>
        )}
      </div>
    </div>
  );
};
