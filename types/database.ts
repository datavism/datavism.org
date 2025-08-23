export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar: string | null
          reputation: string
          xp: number
          level: number
          bio: string | null
          github_username: string | null
          twitter_handle: string | null
          investigations_count: number
          global_rank: number | null
          achievements: string[]
          created_at: string
          updated_at: string
        }
      user_progress: {
        Row: {
          id: string
          user_id: string
          level_id: string
          completed_challenges: string[]
          total_xp: number
          current_challenge: number
          completed_at: string | null
          time_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level_id: string
          completed_challenges?: string[]
          total_xp?: number
          current_challenge?: number
          completed_at?: string | null
          time_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level_id?: string
          completed_challenges?: string[]
          total_xp?: number
          current_challenge?: number
          completed_at?: string | null
          time_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
        Insert: {
          id: string
          username: string
          avatar?: string | null
          reputation?: string
          xp?: number
          level?: number
          bio?: string | null
          github_username?: string | null
          twitter_handle?: string | null
          investigations_count?: number
          global_rank?: number | null
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar?: string | null
          reputation?: string
          xp?: number
          level?: number
          bio?: string | null
          github_username?: string | null
          twitter_handle?: string | null
          investigations_count?: number
          global_rank?: number | null
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          week_id: number
          challenge_id: string
          completed: boolean
          code: string | null
          xp_earned: number
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_id: number
          challenge_id: string
          completed?: boolean
          code?: string | null
          xp_earned?: number
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_id?: number
          challenge_id?: string
          completed?: boolean
          code?: string | null
          xp_earned?: number
          completed_at?: string | null
          created_at?: string
        }
      }
      investigations: {
        Row: {
          id: string
          author_id: string
          title: string
          description: string | null
          status: string
          impact_score: number
          evidence: any | null
          collaborators: string[]
          tags: string[]
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          description?: string | null
          status?: string
          impact_score?: number
          evidence?: any | null
          collaborators?: string[]
          tags?: string[]
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          description?: string | null
          status?: string
          impact_score?: number
          evidence?: any | null
          collaborators?: string[]
          tags?: string[]
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      squads: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          leader_id: string | null
          member_count: number
          xp_total: number
          investigations_completed: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          leader_id?: string | null
          member_count?: number
          xp_total?: number
          investigations_completed?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          leader_id?: string | null
          member_count?: number
          xp_total?: number
          investigations_completed?: number
          created_at?: string
        }
      }
      squad_members: {
        Row: {
          id: string
          squad_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          squad_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          squad_id?: string
          user_id?: string
          role?: string
          joined_at?: string
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
  }
}