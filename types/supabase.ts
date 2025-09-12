export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number
          email: string
          display_name: string
          password_hash: string
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          display_name: string
          password_hash: string
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          display_name?: string
          password_hash?: string
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: number
          name: string
          role: string
          picture_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          role: string
          picture_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          role?: string
          picture_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff_alts: {
        Row: {
          id: number
          staff_id: number
          name: string
          role: string
          picture_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          staff_id: number
          name: string
          role: string
          picture_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          staff_id?: number
          name?: string
          role?: string
          picture_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: number
          name: string
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: number
          category_id: number
          name: string
          description: string | null
          price_gil: number
          image_url: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          category_id: number
          name: string
          description?: string | null
          price_gil: number
          image_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          category_id?: number
          name?: string
          description?: string | null
          price_gil?: number
          image_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      page_content: {
        Row: {
          id: number
          page_slug: string
          section_key: string
          content_type: string
          content: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          page_slug: string
          section_key: string
          content_type: string
          content?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          page_slug?: string
          section_key?: string
          content_type?: string
          content?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: number
          title: string
          slug: string
          content: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: number
          key: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: number
          filename: string
          original_name: string
          mime_type: string
          size: number
          storage_path: string
          public_url: string
          bucket: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          filename: string
          original_name: string
          mime_type: string
          size: number
          storage_path: string
          public_url: string
          bucket: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          filename?: string
          original_name?: string
          mime_type?: string
          size?: number
          storage_path?: string
          public_url?: string
          bucket?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
