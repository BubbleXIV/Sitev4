import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = 'https://aypjimhfxadmqxxarmhw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cGppbWhmeGFkbXF4eGFybWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTYyMzAsImV4cCI6MjA3MzI5MjIzMH0.XsNE12hoUa5yaZrOXU3OKpRQ6d-SpbSNXs41j8kCZPE'

console.log('Supabase initialized with hardcoded credentials');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  AVATARS: 'avatars',
  MENU_IMAGES: 'menu-images'
} as const

// Helper functions for file uploads
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? false,
        contentType: file.type
      })

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    console.log('File uploaded successfully:', { path: data.path, publicUrl });

    return {
      path: data.path,
      fullPath: data.fullPath,
      publicUrl
    }
  } catch (error) {
    console.error('Upload function error:', error);
    throw error;
  }
}

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('File deleted successfully:', path);
  } catch (error) {
    console.error('Delete function error:', error);
    throw error;
  }
}

export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (error) {
    console.error('Get public URL error:', error);
    throw error;
  }
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('staff')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}
