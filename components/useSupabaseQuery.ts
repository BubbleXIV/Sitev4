import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, uploadFile, deleteFile, STORAGE_BUCKETS } from './supabase'
import { Database } from '../types/supabase'

// Type definitions
type Tables = Database['public']['Tables']
type Staff = Tables['staff']['Row']
type StaffInsert = Tables['staff']['Insert']
type StaffUpdate = Tables['staff']['Update']
type StaffAlt = Tables['staff_alts']['Row']
type StaffAltInsert = Tables['staff_alts']['Insert']
type StaffAltUpdate = Tables['staff_alts']['Update']

export type StaffWithAlts = Staff & {
  alts: StaffAlt[]
}

// Query keys
export const queryKeys = {
  staff: ['staff'] as const,
  staffList: () => [...queryKeys.staff, 'list'] as const,
  menu: ['menu'] as const,
  menuData: () => [...queryKeys.menu, 'data'] as const,
  images: ['images'] as const,
  imagesList: () => [...queryKeys.images, 'list'] as const,
  siteSettings: ['site-settings'] as const,
  adminUsers: ['admin-users'] as const,
  pageContent: ['page-content'] as const,
  pages: ['pages'] as const,
}

// =============================================================================
// STAFF QUERIES
// =============================================================================

export const useStaffListQuery = () => {
  return useQuery({
    queryKey: queryKeys.staffList(),
    queryFn: async () => {
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('display_order', { ascending: true })

      if (staffError) throw staffError

      const { data: alts, error: altsError } = await supabase
        .from('staff_alts')
        .select('*')
        .order('display_order', { ascending: true })

      if (altsError) throw altsError

      const staffWithAlts: StaffWithAlts[] = staff.map(member => ({
        ...member,
        alts: alts.filter(alt => alt.staff_id === member.id)
      }))

      return { staff: staffWithAlts }
    }
  })
}

export const useStaffQuery = () => useStaffListQuery()

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: StaffInsert) => {
      const { data: staff, error } = await supabase
        .from('staff')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & StaffUpdate) => {
      const { data: staff, error } = await supabase
        .from('staff')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

export const useCreateStaffAltMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: StaffAltInsert) => {
      const { data: alt, error } = await supabase
        .from('staff_alts')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return alt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

export const useUpdateStaffAltMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & StaffAltUpdate) => {
      const { data: alt, error } = await supabase
        .from('staff_alts')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return alt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

export const useDeleteStaffAltMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('staff_alts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff })
    }
  })
}

// =============================================================================
// MENU QUERIES
// =============================================================================

export const useMenuQuery = () => {
  return useQuery({
    queryKey: queryKeys.menuData(),
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (categoriesError) throw categoriesError

      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true })

      if (itemsError) throw itemsError

      const categoriesWithItems = categories.map(category => ({
        ...category,
        items: items.filter(item => item.category_id === category.id)
      }))

      return { categories: categoriesWithItems }
    }
  })
}

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Tables['menu_categories']['Insert']) => {
      const { data: category, error } = await supabase
        .from('menu_categories')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Tables['menu_categories']['Update']) => {
      const { data: category, error } = await supabase
        .from('menu_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Tables['menu_items']['Insert']) => {
      const { data: item, error } = await supabase
        .from('menu_items')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Tables['menu_items']['Update']) => {
      const { data: item, error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu })
    }
  })
}

// =============================================================================
// IMAGE QUERIES
// =============================================================================

export const useImagesQuery = () => {
  return useQuery({
    queryKey: queryKeys.imagesList(),
    queryFn: async () => {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { images: images || [] }
    }
  })
}

export const useUploadImageMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const file = formData.get('image') as File
      if (!file) throw new Error('No file provided')

      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}.${extension}`
      
      // Upload to Supabase Storage
      const uploadResult = await uploadFile(STORAGE_BUCKETS.IMAGES, filename, file)

      // Save image record to database
      const { data: image, error } = await supabase
        .from('images')
        .insert({
          filename,
          original_name: file.name,
          mime_type: file.type,
          size: file.size,
          url: uploadResult.publicUrl
        })
        .select()
        .single()

      if (error) throw error
      return image
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images })
    }
  })
}

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (imageId: number) => {
      // Get image record first
      const { data: image, error: fetchError } = await supabase
        .from('images')
        .select('filename')
        .eq('id', imageId)
        .single()

      if (fetchError) throw fetchError

      // Delete from storage
      await deleteFile(STORAGE_BUCKETS.IMAGES, image.filename)

      // Delete from database
      const { error: deleteError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (deleteError) throw deleteError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images })
    }
  })
}

// =============================================================================
// SITE SETTINGS QUERIES
// =============================================================================

export const useSiteSettingsQuery = () => {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: async () => {
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error
      return { settings: settings || [] }
    }
  })
}

export const useUpdateSiteSettingMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data: setting, error } = await supabase
        .from('site_settings')
        .upsert({ key, value })
        .select()
        .single()

      if (error) throw error
      return setting
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings })
    }
  })
}

// =============================================================================
// ADMIN USERS QUERIES
// =============================================================================

export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return { users: users || [] }
    }
  })
}

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Tables['admin_users']['Insert']) => {
      const { data: user, error } = await supabase
        .from('admin_users')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers })
    }
  })
}

export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Tables['admin_users']['Update']) => {
      const { data: user, error } = await supabase
        .from('admin_users')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers })
    }
  })
}

export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers })
    }
  })
}

// =============================================================================
// PAGE CONTENT QUERIES
// =============================================================================

export const usePageContentQuery = () => {
  return useQuery({
    queryKey: queryKeys.pageContent,
    queryFn: async () => {
      const { data: content, error } = await supabase
        .from('page_content')
        .select('*')

      if (error) throw error
      return { content: content || [] }
    }
  })
}

export const useUpdatePageContentMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ page, section, content }: { page: string; section: string; content: any }) => {
      const { data: pageContent, error } = await supabase
        .from('page_content')
        .upsert({ page, section, content })
        .select()
        .single()

      if (error) throw error
      return pageContent
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pageContent })
    }
  })
}

// =============================================================================
// PAGES QUERIES (for dynamic pages)
// =============================================================================

export const usePagesQuery = () => {
  return useQuery({
    queryKey: queryKeys.pages,
    queryFn: async () => {
      const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return { pages: pages || [] }
    }
  })
}

export const usePageQuery = (slug: string) => {
  return useQuery({
    queryKey: [...queryKeys.pages, slug],
    queryFn: async () => {
      const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return page
    },
    enabled: !!slug
  })
}

// Services-specific query (if you have a services table)
export const useServicesQuery = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return { services: services || [] }
    }
  })
}
