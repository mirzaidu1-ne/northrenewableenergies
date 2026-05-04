export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          category: string
          location: string | null
          capacity_kw: number | null
          completed_at: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          category: string
          location?: string | null
          capacity_kw?: number | null
          completed_at?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          category?: string
          location?: string | null
          capacity_kw?: number | null
          completed_at?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          content: string
          rating: number
          image_url: string | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          content: string
          rating: number
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          content?: string
          rating?: number
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image: string | null
          author: string
          published_at: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image?: string | null
          author: string
          published_at?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          cover_image?: string | null
          author?: string
          published_at?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string | null
          property_type: string | null
          monthly_bill: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message?: string | null
          property_type?: string | null
          monthly_bill?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          property_type?: string | null
          monthly_bill?: number | null
          status?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string | null
          image_url: string | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio?: string | null
          image_url?: string | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string | null
          image_url?: string | null
          order?: number
          created_at?: string
        }
      }
      page_content: {
        Row: {
          id: string
          page: string
          section: string
          content: Record<string, unknown>
          updated_at: string
        }
        Insert: {
          id?: string
          page: string
          section: string
          content: Record<string, unknown>
          updated_at?: string
        }
        Update: {
          id?: string
          page?: string
          section?: string
          content?: Record<string, unknown>
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Record<string, unknown>
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Record<string, unknown>
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Record<string, unknown>
          updated_at?: string
        }
      }
    }
  }
}
