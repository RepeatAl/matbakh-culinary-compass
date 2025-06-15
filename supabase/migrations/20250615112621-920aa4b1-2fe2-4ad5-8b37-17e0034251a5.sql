
-- Erweiterte Profil-Tabelle für alle User (Zusatzinfos + Consent)
CREATE TABLE public.profiles_ext (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  language text CHECK (language IN ('de','en','es','fr')),
  consent_agb boolean DEFAULT false,
  consent_privacy boolean DEFAULT false,
  consent_marketing boolean DEFAULT false,
  consent_agb_at timestamp with time zone,
  consent_privacy_at timestamp with time zone,
  consent_marketing_at timestamp with time zone,
  -- weitere Felder für spätere Features (z.B. telefonnummer)
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS aktivieren und pro User absichern
ALTER TABLE public.profiles_ext ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own profiles_ext" ON public.profiles_ext
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can edit own profiles_ext" ON public.profiles_ext
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Automatische Zeitstempel für Änderungen
CREATE OR REPLACE FUNCTION public.set_profiles_ext_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_ext_updated_at ON public.profiles_ext;
CREATE TRIGGER set_profiles_ext_updated_at
  BEFORE UPDATE ON public.profiles_ext
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_profiles_ext_updated_at();
