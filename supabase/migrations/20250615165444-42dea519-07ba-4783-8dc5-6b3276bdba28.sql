
-- 1. Erweiterung user profile (profiles_ext) um Präferenzen und Ziele
ALTER TABLE public.profiles_ext
  ADD COLUMN IF NOT EXISTS favorite_foods   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS disliked_foods   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS goals            TEXT[] DEFAULT '{}';

-- 2. Food-Katalog (Lebensmittel und Getränke)
CREATE TABLE IF NOT EXISTS public.foods (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        JSONB NOT NULL,   -- {de:..., en:..., es:..., fr:...}
  category    TEXT NOT NULL,    -- vegetable, fruit, grain, meat, fish, dairy, spice, beverage, etc.
  properties  JSONB,
  created_at  timestamptz DEFAULT now()
);

-- 3. Saisonen und Zuordnung saisonaler Foods
CREATE TABLE IF NOT EXISTS public.seasons (
  id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name   TEXT UNIQUE NOT NULL,
  months INT[] NOT NULL                    -- [3,4,5] etc. (März-Mai => Frühling)
);

CREATE TABLE IF NOT EXISTS public.foods_seasons (
  food_id   uuid REFERENCES public.foods(id) ON DELETE CASCADE,
  season_id uuid REFERENCES public.seasons(id),
  PRIMARY KEY (food_id, season_id)
);

-- 4. Initial-Seed für Foods: Gemüse, Getreide, Milchprodukte, Fleisch, Fisch, Gewürze, Getränke (beverage)
INSERT INTO public.foods (slug, name, category, properties) VALUES
  -- Gemüse & Obst
  ('tomato',        '{"de":"Tomate","en":"Tomato","es":"Tomate","fr":"Tomate"}',          'vegetable',      '{"gluten":false,"sugar_g":2}'),
  ('lettuce',       '{"de":"Salat","en":"Lettuce","es":"Lechuga","fr":"Laitue"}',         'vegetable',      '{"gluten":false,"sugar_g":0.5}'),
  ('apple',         '{"de":"Apfel","en":"Apple","es":"Manzana","fr":"Pomme"}',            'fruit',          '{"gluten":false,"sugar_g":10}'),
  -- Getreide & Hülsenfrüchte
  ('pasta',         '{"de":"Pasta","en":"Pasta","es":"Pasta","fr":"Pâtes"}',              'grain',          '{"gluten":true,"fiber_g":3}'),
  ('rice',          '{"de":"Reis","en":"Rice","es":"Arroz","fr":"Riz"}',                  'grain',          '{"gluten":false,"fiber_g":1}'),
  ('lentils',       '{"de":"Linsen","en":"Lentils","es":"Lentejas","fr":"Lentilles"}',    'legume',         '{"protein_g":9}'),
  -- Gewürze
  ('pepper',        '{"de":"Pfeffer","en":"Pepper","es":"Pimienta","fr":"Poivre"}',       'spice',          '{"gluten":false}'),
  ('oregano',       '{"de":"Oregano","en":"Oregano","es":"Orégano","fr":"Origan"}',       'spice',          '{"gluten":false}'),
  -- Milchprodukte
  ('milk',          '{"de":"Milch","en":"Milk","es":"Leche","fr":"Lait"}',                'dairy',          '{"lactose":true}'),
  ('cheese',        '{"de":"Käse","en":"Cheese","es":"Queso","fr":"Fromage"}',            'dairy',          '{"lactose":true}'),
  -- Fleisch & Fisch
  ('chicken',       '{"de":"Hähnchen","en":"Chicken","es":"Pollo","fr":"Poulet"}',        'meat',           '{"gluten":false}'),
  ('beef',          '{"de":"Rindfleisch","en":"Beef","es":"Carne de vaca","fr":"Boeuf"}', 'meat',           '{"gluten":false}'),
  ('pork',          '{"de":"Schwein","en":"Pork","es":"Cerdo","fr":"Porc"}',              'meat',           '{"gluten":false}'),
  ('salmon',        '{"de":"Lachs","en":"Salmon","es":"Salmón","fr":"Saumon"}',           'fish',           '{"gluten":false}'),
  -- Getränke
  ('water',         '{"de":"Wasser","en":"Water","es":"Agua","fr":"Eau"}',                'beverage',       '{"calories":0}'),
  ('coffee',        '{"de":"Kaffee","en":"Coffee","es":"Café","fr":"Café"}',              'beverage',       '{"caffeine_mg":95}'),
  ('tea',           '{"de":"Tee","en":"Tea","es":"Té","fr":"Thé"}',                       'beverage',       '{"caffeine_mg":30}'),
  ('orange_juice',  '{"de":"Orangensaft","en":"Orange Juice","es":"Zumo de naranja","fr":"Jus d’orange"}', 'beverage', '{"calories":45}'),
  ('wine',          '{"de":"Wein","en":"Wine","es":"Vino","fr":"Vin"}',                   'beverage',       '{"alcohol_pct":12}')
ON CONFLICT (slug) DO NOTHING;

-- 5. Saisondaten als Seed
INSERT INTO public.seasons (name, months) VALUES
  ('Frühling',  ARRAY[3,4,5]),
  ('Sommer',    ARRAY[6,7,8]),
  ('Herbst',    ARRAY[9,10,11]),
  ('Winter',    ARRAY[12,1,2])
ON CONFLICT (name) DO NOTHING;

-- 6. Beispielhafte saisonale Food-Verknüpfung (nur exemplarisch, erweiterbar)
INSERT INTO public.foods_seasons (food_id, season_id)
SELECT f.id, s.id FROM public.foods f, public.seasons s
WHERE (f.slug, s.name) IN (
  ('tomato','Sommer'),
  ('lettuce','Frühling'),
  ('apple','Herbst')
)
ON CONFLICT DO NOTHING;

-- 7. RLS-Policies für alle neuen Tabellen
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods_seasons ENABLE ROW LEVEL SECURITY;

-- Public read for foods, seasons, foods_seasons
CREATE POLICY "Allow public read: foods" ON public.foods
  FOR SELECT USING (true);

CREATE POLICY "Allow public read: seasons" ON public.seasons
  FOR SELECT USING (true);

CREATE POLICY "Allow public read: foods_seasons" ON public.foods_seasons
  FOR SELECT USING (true);

-- Owner-only changes for profile_ext (Profil bleibt privat)
-- Getränke können später bei Bedarf in eigene Tabelle ausgelagert werden

