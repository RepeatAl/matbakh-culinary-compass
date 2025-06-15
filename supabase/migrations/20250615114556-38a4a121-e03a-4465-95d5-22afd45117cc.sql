
-- 1) Allergien (Multiple-Choice) und Freitext-Ergänzung
ALTER TABLE public.profiles_ext
  ADD COLUMN allergies        text[]     DEFAULT '{}',
  ADD COLUMN other_allergies  text;

-- 2) Diabetes-Status & -Typ
ALTER TABLE public.profiles_ext
  ADD COLUMN is_diabetic    boolean    NOT NULL DEFAULT FALSE,
  ADD COLUMN diabetes_type  text       CHECK (diabetes_type IN ('Typ I','Typ II')),
  ADD COLUMN other_conditions text;

-- 3) Kein neues Feld für Disclaimer nötig – statisch im UI.
