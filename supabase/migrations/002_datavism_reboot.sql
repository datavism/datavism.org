-- DATAVISM Reboot Migration
-- Adds missions, AI conversations, artifacts, and user mission tracking

-- ─── Missions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  briefing TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'recruit',
  objectives JSONB DEFAULT '[]',
  data_sources JSONB DEFAULT '[]',
  estimated_time VARCHAR(20),
  influence_reward INTEGER DEFAULT 100,
  status VARCHAR(20) DEFAULT 'active',
  is_curated BOOLEAN DEFAULT true,
  completion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── User Mission Progress ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id),
  status VARCHAR(20) DEFAULT 'active',
  completed_objectives JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, mission_id)
);

-- ─── AI Conversations ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id),
  messages JSONB DEFAULT '[]',
  model_used VARCHAR(100),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Artifacts (shareable outputs from missions) ──────────────────
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id),
  type VARCHAR(50),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Extend profiles for datavism reboot ──────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role VARCHAR(20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'motivation') THEN
    ALTER TABLE profiles ADD COLUMN motivation VARCHAR(20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'codename') THEN
    ALTER TABLE profiles ADD COLUMN codename TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'influence_score') THEN
    ALTER TABLE profiles ADD COLUMN influence_score INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'liberation_code') THEN
    ALTER TABLE profiles ADD COLUMN liberation_code VARCHAR(20);
  END IF;
END $$;

-- ─── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_missions_slug ON missions(slug);
CREATE INDEX IF NOT EXISTS idx_missions_category ON missions(category);
CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_user ON artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_public ON artifacts(is_public) WHERE is_public = true;

-- ─── RLS Policies ─────────────────────────────────────────────────
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Missions: readable by everyone
CREATE POLICY IF NOT EXISTS "Missions are viewable by everyone" ON missions
  FOR SELECT USING (true);

-- User missions: users can only see/modify their own
CREATE POLICY IF NOT EXISTS "Users can view own missions" ON user_missions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own missions" ON user_missions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own missions" ON user_missions
  FOR UPDATE USING (auth.uid() = user_id);

-- AI conversations: users can only see/modify their own
CREATE POLICY IF NOT EXISTS "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Artifacts: public ones viewable by all, own artifacts editable
CREATE POLICY IF NOT EXISTS "Public artifacts are viewable by everyone" ON artifacts
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own artifacts" ON artifacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own artifacts" ON artifacts
  FOR UPDATE USING (auth.uid() = user_id);
