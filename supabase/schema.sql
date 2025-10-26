-- ============================================
-- DATAVISM SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  reputation TEXT DEFAULT 'Curious Citizen',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  bio TEXT,
  github_username TEXT,
  twitter_handle TEXT,
  investigations_count INTEGER DEFAULT 0,
  global_rank INTEGER,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress table (old week-based progress)
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_id INTEGER NOT NULL,
  challenge_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  code TEXT,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_id, challenge_id)
);

-- Create user_progress table (new level-based progress)
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id VARCHAR(50) NOT NULL,
  completed_challenges JSONB DEFAULT '[]',
  total_xp INTEGER DEFAULT 0,
  current_challenge INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one progress record per user per level
  UNIQUE(user_id, level_id)
);

-- Create investigations table
CREATE TABLE investigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  impact_score INTEGER DEFAULT 0,
  evidence JSONB,
  collaborators UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create squads table
CREATE TABLE squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'investigation' | 'learning' | 'strike'
  leader_id UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 1,
  xp_total INTEGER DEFAULT 0,
  investigations_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create squad_members table
CREATE TABLE squad_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Progress policies
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR ALL
  USING (auth.uid() = user_id);

-- User Progress policies (new level-based)
CREATE POLICY "Users can view own user_progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Investigations policies
CREATE POLICY "Published investigations are viewable by everyone"
  ON investigations FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Users can create investigations"
  ON investigations FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own investigations"
  ON investigations FOR UPDATE
  USING (auth.uid() = author_id);

-- Squads policies
CREATE POLICY "Squads are viewable by everyone"
  ON squads FOR SELECT
  USING (true);

CREATE POLICY "Users can create squads"
  ON squads FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Squad leaders can update squads"
  ON squads FOR UPDATE
  USING (auth.uid() = leader_id);

-- Squad members policies
CREATE POLICY "Squad members are viewable by everyone"
  ON squad_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join squads"
  ON squad_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave squads"
  ON squad_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER investigations_updated_at
  BEFORE UPDATE ON investigations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update squad member count
CREATE OR REPLACE FUNCTION update_squad_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE squads 
    SET member_count = member_count + 1 
    WHERE id = NEW.squad_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE squads 
    SET member_count = member_count - 1 
    WHERE id = OLD.squad_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for squad member count
CREATE TRIGGER squad_member_count_trigger
  AFTER INSERT OR DELETE ON squad_members
  FOR EACH ROW EXECUTE FUNCTION update_squad_member_count();

-- ============================================
-- INITIAL DATA (OPTIONAL)
-- ============================================

-- Insert some sample squads (uncomment if desired)
/*
INSERT INTO squads (name, description, type, leader_id) VALUES
  ('Data Liberation Front', 'Fighting corporate data hoarding', 'investigation', (SELECT id FROM profiles LIMIT 1)),
  ('Python Rookies', 'Learning Python together', 'learning', (SELECT id FROM profiles LIMIT 1)),
  ('Tax Haven Hunters', 'Exposing offshore tax evasion', 'strike', (SELECT id FROM profiles LIMIT 1));
*/

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_progress_user_week ON progress(user_id, week_id);
CREATE INDEX idx_progress_completed ON progress(completed, created_at DESC);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_level_id ON user_progress(level_id);
CREATE INDEX idx_investigations_status ON investigations(status, created_at DESC);
CREATE INDEX idx_investigations_author ON investigations(author_id);
CREATE INDEX idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user ON squad_members(user_id);

-- ============================================
-- VIRAL FEATURES - Week 1-2 Addition
-- ============================================

-- Liberation Codes (shared after completing levels)
CREATE TABLE liberation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(8) UNIQUE NOT NULL,
  level_completed INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  shares_count INTEGER DEFAULT 0,

  -- Ensure one code per user per level
  UNIQUE(user_id, level_completed)
);

-- Activity Feed (for live activity on landing page + dashboard)
CREATE TABLE activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'signup', 'level_complete', 'squad_join', 'investigation_publish'
  action_data JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals (for viral growth)
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Ensure unique referral relationship
  UNIQUE(referrer_id, referred_id)
);

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Enable RLS
ALTER TABLE liberation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Liberation Codes policies
CREATE POLICY "Users can view all liberation codes"
  ON liberation_codes FOR SELECT
  USING (true);

CREATE POLICY "Users can create own liberation codes"
  ON liberation_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Activity Feed policies
CREATE POLICY "Public activities are viewable by everyone"
  ON activity_feed FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create own activity"
  ON activity_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity visibility"
  ON activity_feed FOR UPDATE
  USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Referrers can update own referrals"
  ON referrals FOR UPDATE
  USING (auth.uid() = referrer_id);

-- ============================================
-- INDEXES FOR NEW TABLES
-- ============================================

CREATE INDEX idx_liberation_codes_user ON liberation_codes(user_id);
CREATE INDEX idx_liberation_codes_code ON liberation_codes(code);
CREATE INDEX idx_liberation_codes_created ON liberation_codes(created_at DESC);

CREATE INDEX idx_activity_feed_public ON activity_feed(is_public, created_at DESC);
CREATE INDEX idx_activity_feed_user ON activity_feed(user_id, created_at DESC);
CREATE INDEX idx_activity_feed_type ON activity_feed(action_type, created_at DESC);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status, created_at DESC);