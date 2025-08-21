# 🔧 **SUPABASE SETUP GUIDE**

## **1. Create Supabase Project**

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle einen kostenlosen Account
3. Klicke "New Project"
4. Wähle eine Organization
5. Projektname: `datavism-academy`
6. Database Password: **Sichere Passwort wählen & notieren!**
7. Region: `Europe (Frankfurt)` 
8. Klicke "Create new project"

⏳ **Warten**: Projekt-Setup dauert 2-3 Minuten

## **2. Database Schema Setup**

1. **SQL Editor öffnen**: 
   - Im Supabase Dashboard → "SQL Editor"
   - Klicke "New Query"

2. **Schema importieren**:
   - Kopiere den kompletten Inhalt aus `supabase/schema.sql`
   - Füge ihn in den SQL Editor ein
   - Klicke "Run" (▶️)

3. **Erfolg prüfen**:
   - Gehe zu "Table Editor"
   - Du solltest sehen: `profiles`, `progress`, `investigations`, `squads`, `squad_members`

## **3. Environment Variables**

1. **API Keys holen**:
   - Supabase Dashboard → "Settings" → "API"
   - Kopiere:
     - **Project URL**: `https://xxx.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1...`

2. **Environment Variables setzen**:
   ```bash
   cp .env.example .env.local
   ```

3. **`.env.local` editieren**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://deinprojekt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## **4. Authentication Setup**

1. **Email Authentication aktivieren**:
   - Dashboard → "Authentication" → "Settings"
   - Enable "Email" Provider
   - Konfirmation Email: **AN** (für Sicherheit)

2. **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

3. **Email Templates** (optional):
   - Customize confirmation email design
   - Add your branding

## **5. Row Level Security (RLS)**

✅ **Bereits konfiguriert** durch `schema.sql`

Die wichtigsten Policies:
- **Profiles**: Öffentlich lesbar, nur eigene editierbar
- **Progress**: Nur eigener Progress sichtbar
- **Investigations**: Nur veröffentlichte oder eigene sichtbar
- **Squads**: Öffentlich, aber nur Leader können editieren

## **6. Test Connection**

```bash
# Terminal
cd /Users/frankbultge/Documents/GitHub/datavism.org
npm run dev
```

1. **Registrierung testen**:
   - Gehe zu `http://localhost:3000/auth`
   - Erstelle einen Account
   - Check email für Bestätigung

2. **Database prüfen**:
   - Supabase Dashboard → "Table Editor" → "profiles"
   - Dein neuer User sollte erscheinen

3. **Academy testen**:
   - Login → Dashboard
   - Academy → Week 1
   - Challenge completieren
   - Progress sollte in Database erscheinen

## **🚨 TROUBLESHOOTING**

### **Problem: "Invalid JWT"**
```bash
# Solution: Überprüfe API Keys
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Problem: "Table doesn't exist"**
- Gehe zu SQL Editor
- Führe `schema.sql` nochmal aus
- Check "Table Editor" für alle Tabellen

### **Problem: "Row Level Security"**
```sql
-- Disable RLS temporär für Debug
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Nach Fix wieder aktivieren:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### **Problem: Email Confirmation**
- Check Spam folder
- In Development: Dashboard → Auth → Users → Click user → "Confirm User"

## **7. Production Deployment**

Für Production (Vercel):

1. **Vercel Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   ```

2. **Supabase Settings**:
   - Site URL: `https://datavism.vercel.app`
   - Redirect URLs: `https://datavism.vercel.app/auth/callback`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## **🎯 Success Checklist**

- [ ] ✅ Supabase Project erstellt
- [ ] ✅ Database Schema installiert
- [ ] ✅ Environment Variables gesetzt
- [ ] ✅ Authentication funktioniert
- [ ] ✅ User Registration funktioniert
- [ ] ✅ Academy Progress speichert in DB
- [ ] ✅ Dashboard zeigt User Stats
- [ ] ✅ Community Features laden

**🚀 Bei allen Checkboxen ✅ ist das System bereit für Launch!**