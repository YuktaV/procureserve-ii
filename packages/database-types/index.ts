export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          attachments: Json | null
          candidate_id: string | null
          company_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          notes: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profile_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      business_documents: {
        Row: {
          company_id: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          company_id?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_registrations: {
        Row: {
          activated_company_id: string | null
          comments: string | null
          company_address: string | null
          company_domain: string
          company_name: string
          company_phone: string | null
          contact_person_email: string
          contact_person_name: string
          contact_person_phone: string | null
          contact_person_title: string | null
          created_at: string | null
          decision_maker_email: string | null
          decision_maker_name: string | null
          decision_maker_title: string | null
          hear_about: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          activated_company_id?: string | null
          comments?: string | null
          company_address?: string | null
          company_domain: string
          company_name: string
          company_phone?: string | null
          contact_person_email: string
          contact_person_name: string
          contact_person_phone?: string | null
          contact_person_title?: string | null
          created_at?: string | null
          decision_maker_email?: string | null
          decision_maker_name?: string | null
          decision_maker_title?: string | null
          hear_about?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_company_id?: string | null
          comments?: string | null
          company_address?: string | null
          company_domain?: string
          company_name?: string
          company_phone?: string | null
          contact_person_email?: string
          contact_person_name?: string
          contact_person_phone?: string | null
          contact_person_title?: string | null
          created_at?: string | null
          decision_maker_email?: string | null
          decision_maker_name?: string | null
          decision_maker_title?: string | null
          hear_about?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_registrations_activated_company_id_fkey"
            columns: ["activated_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_agency_history: {
        Row: {
          agency_name: string | null
          candidate_id: string | null
          created_at: string | null
          created_by_user_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
        }
        Insert: {
          agency_name?: string | null
          candidate_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date: string
        }
        Update: {
          agency_name?: string | null
          candidate_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_agency_history_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profile_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_agency_history_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_agency_history_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_creation_methods: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          created_by_user_id: string | null
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          metadata: Json | null
          method: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          metadata?: Json | null
          method: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          metadata?: Json | null
          method?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_creation_methods_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profile_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_creation_methods_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_creation_methods_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          auth_user_id: string | null
          availability_date: string | null
          created_at: string | null
          email: string
          experience_level: string | null
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          name: string
          phone: string | null
          preferred_location: string | null
          profile_completed_at: string | null
          representing_agency: string | null
          resume_text: string | null
          resume_url: string | null
          skills: Json | null
          status: string | null
          updated_at: string | null
          vector_embedding: string | null
          visa_valid_until: string | null
          work_authorization: string | null
        }
        Insert: {
          auth_user_id?: string | null
          availability_date?: string | null
          created_at?: string | null
          email: string
          experience_level?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          preferred_location?: string | null
          profile_completed_at?: string | null
          representing_agency?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
          visa_valid_until?: string | null
          work_authorization?: string | null
        }
        Update: {
          auth_user_id?: string | null
          availability_date?: string | null
          created_at?: string | null
          email?: string
          experience_level?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          preferred_location?: string | null
          profile_completed_at?: string | null
          representing_agency?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
          visa_valid_until?: string | null
          work_authorization?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          bench_sales_enabled: boolean | null
          business_address: Json | null
          business_type: string | null
          created_at: string | null
          domain: string | null
          estimated_annual_volume: string | null
          id: string
          legal_entity_type: string | null
          logo_url: string | null
          name: string
          primary_contact: Json | null
          recruitment_enabled: boolean | null
          registration_status: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          settings: Json | null
          submitted_at: string | null
          tax_id: string | null
          time_zone: string | null
          updated_at: string | null
          working_hours: Json | null
        }
        Insert: {
          bench_sales_enabled?: boolean | null
          business_address?: Json | null
          business_type?: string | null
          created_at?: string | null
          domain?: string | null
          estimated_annual_volume?: string | null
          id?: string
          legal_entity_type?: string | null
          logo_url?: string | null
          name: string
          primary_contact?: Json | null
          recruitment_enabled?: boolean | null
          registration_status?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          settings?: Json | null
          submitted_at?: string | null
          tax_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Update: {
          bench_sales_enabled?: boolean | null
          business_address?: Json | null
          business_type?: string | null
          created_at?: string | null
          domain?: string | null
          estimated_annual_volume?: string | null
          id?: string
          legal_entity_type?: string | null
          logo_url?: string | null
          name?: string
          primary_contact?: Json | null
          recruitment_enabled?: boolean | null
          registration_status?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          settings?: Json | null
          submitted_at?: string | null
          tax_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      configurable_enums: {
        Row: {
          category: string
          company_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          values: Json
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          values?: Json
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          values?: Json
        }
        Relationships: [
          {
            foreignKeyName: "configurable_enums_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string | null
          company_id: string | null
          created_at: string | null
          duration_minutes: number | null
          feedback: Json | null
          id: string
          interviewer_id: string | null
          notes: string | null
          scheduled_at: string
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          company_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          interviewer_id?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          company_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          interviewer_id?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          requirements: Json | null
          status: string | null
          title: string
          updated_at: string | null
          vector_embedding: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          requirements?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          vector_embedding?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          requirements?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          vector_embedding?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_reviews: {
        Row: {
          company_id: string | null
          id: string
          review_notes: string | null
          review_status: string
          reviewed_at: string | null
          reviewed_by_email: string
        }
        Insert: {
          company_id?: string | null
          id?: string
          review_notes?: string | null
          review_status: string
          reviewed_at?: string | null
          reviewed_by_email: string
        }
        Update: {
          company_id?: string | null
          id?: string
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string
          id: string
          profile: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          profile?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          profile?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          company_id: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      business_registration_summary: {
        Row: {
          activated_company_id: string | null
          activated_company_name: string | null
          comments: string | null
          company_address: string | null
          company_domain: string | null
          company_name: string | null
          company_phone: string | null
          contact_person_email: string | null
          contact_person_name: string | null
          contact_person_phone: string | null
          contact_person_title: string | null
          created_at: string | null
          decision_maker_email: string | null
          decision_maker_name: string | null
          decision_maker_title: string | null
          hear_about: string | null
          id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_email: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_registrations_activated_company_id_fkey"
            columns: ["activated_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profile_status: {
        Row: {
          auth_user_id: string | null
          availability_date: string | null
          created_at: string | null
          email: string | null
          experience_level: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          linkedin_url: string | null
          name: string | null
          phone: string | null
          preferred_location: string | null
          profile_completed_at: string | null
          profile_status: string | null
          representing_agency: string | null
          resume_text: string | null
          resume_url: string | null
          skills: Json | null
          status: string | null
          updated_at: string | null
          vector_embedding: string | null
          visa_expiring_soon: boolean | null
          visa_valid_until: string | null
          work_authorization: string | null
        }
        Insert: {
          auth_user_id?: string | null
          availability_date?: string | null
          created_at?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          preferred_location?: string | null
          profile_completed_at?: string | null
          profile_status?: never
          representing_agency?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
          visa_expiring_soon?: never
          visa_valid_until?: string | null
          work_authorization?: string | null
        }
        Update: {
          auth_user_id?: string | null
          availability_date?: string | null
          created_at?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          preferred_location?: string | null
          profile_completed_at?: string | null
          profile_status?: never
          representing_agency?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
          visa_expiring_soon?: never
          visa_valid_until?: string | null
          work_authorization?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_business_registration: {
        Args: {
          registration_id: string
          reviewer_user_id?: string
        }
        Returns: string
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      update_candidate_agency: {
        Args: {
          p_candidate_id: string
          p_new_agency: string
          p_start_date?: string
          p_notes?: string
        }
        Returns: undefined
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

