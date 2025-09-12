import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListImages } from "../endpoints/images/list_GET.schema";
import { postUploadImage } from "../endpoints/images/upload_POST.schema";
import { postDeleteImage } from "../endpoints/images/delete_POST.schema";

export const imagesQueryKey = ["images"];

export const useImagesQuery = () => {
  return useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { images };
    },
  });
};

export const useUploadImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, bucket = 'images' }: { file: File; bucket?: string }) => {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      // Save image record to database
      const { data: imageRecord, error: dbError } = await supabase
        .from('images')
        .insert({
          filename: fileName,
          original_name: file.name,
          mime_type: file.type,
          size: file.size,
          storage_path: uploadData.path,
          public_url: publicUrl,
          bucket: bucket
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        ...imageRecord,
        url: publicUrl // For backward compatibility
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: number) => {
      // Get image record first
      const { data: image, error: fetchError } = await supabase
        .from('images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(image.bucket)
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
