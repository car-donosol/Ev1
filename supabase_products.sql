-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_offer INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  rating JSONB,
  stock INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  home BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar los productos
INSERT INTO products (id, title, price, price_offer, description, image, rating, stock, slug, category, home) VALUES
(1, 'Cala de Color', 12990, 9990, 'Planta ornamental con flores vibrantes y elegantes, ideal para interiores luminosos o terrazas.', '/cala de color.jpeg', '{"rate": 4.6, "count": 83}'::jsonb, 15, 'cala-de-color', 'interior', true),
(2, 'Calathea Burle Marx', 8990, 7490, 'Hojas decorativas con patrones únicos. Perfecta para interiores con luz indirecta.', '/calatheaBurleMarx.jpeg', '{"rate": 4.8, "count": 122}'::jsonb, 18, 'calathea-burle-marx', 'interior', false),
(3, 'Cuna de Moisés', 7490, 0, 'Clásica planta de interior, resistente y purificadora del aire, con flores blancas elegantes.', '/Cuna de moises.jpeg', '{"rate": 4.5, "count": 97}'::jsonb, 20, 'cuna-de-moises', 'interior', false),
(4, 'Dipladenia', 11500, 0, 'Planta trepadora con flores coloridas, perfecta para decorar balcones o jardines.', '/Dipladenia.jpeg', '{"rate": 4.7, "count": 64}'::jsonb, 12, 'dipladenia', 'exterior', false),
(5, 'Dólar Variegado', 8990, 0, 'Planta colgante de hojas pequeñas y tono plateado, ideal para ambientes luminosos.', '/DolarVariegado.jpeg', '{"rate": 4.4, "count": 51}'::jsonb, 25, 'dolar-variegado', 'interior', false),
(6, 'Ficus Trenzado', 13500, 0, 'Elegante ficus con troncos entrelazados, ideal como pieza central en interiores.', '/Ficus Trenzado.jpeg', '{"rate": 4.9, "count": 147}'::jsonb, 10, 'ficus-trenzado', 'interior', false),
(7, 'Ficus Enano Variegado', 7800, 6200, 'Compacto y de follaje bicolor, perfecto para decorar mesas o repisas interiores.', '/ficusEnanoVariegado.jpeg', '{"rate": 4.3, "count": 42}'::jsonb, 22, 'ficus-enano-variegado', 'interior', false),
(8, 'Gomero', 9500, 0, 'Planta de hojas grandes y brillantes, resistente y purificadora del aire.', '/Gomero.jpeg', '{"rate": 4.6, "count": 103}'::jsonb, 16, 'gomero', 'interior', false),
(9, 'Monstera Deliciosa', 14990, 0, 'Planta tropical icónica, con grandes hojas perforadas y estilo moderno.', '/monstera deliciosa.jpeg', '{"rate": 4.9, "count": 188}'::jsonb, 14, 'monstera-deliciosa', 'interior', false),
(10, 'Monstera Adansonii', 10990, 0, 'Conocida como ''Monstera Monkey'', sus hojas perforadas aportan un toque exótico.', '/MonsteraAdansonii.jpeg', '{"rate": 4.8, "count": 135}'::jsonb, 19, 'monstera-adansonii', 'interior', false),
(11, 'Peperomia Cucharita', 6890, 0, 'Pequeña planta de interior, de hojas carnosas y brillantes, muy fácil de cuidar.', '/peperomia cucharita.jpeg', '{"rate": 4.5, "count": 72}'::jsonb, 26, 'peperomia-cucharita', 'interior', false),
(12, 'Peperomia Hope', 7990, 0, 'Variedad colgante con hojas redondas y textura suave, perfecta para maceteros altos.', '/peperomia hope.jpeg', '{"rate": 4.4, "count": 61}'::jsonb, 23, 'peperomia-hope', 'interior', false),
(13, 'Sanseviera Laurentii', 11990, 0, 'También conocida como lengua de suegra, resistente y excelente purificadora del aire.', '/sanseviera laurentii.jpeg', '{"rate": 4.9, "count": 203}'::jsonb, 11, 'sanseviera-laurentii', 'exterior', false),
(14, 'Yuka', 9800, 0, 'Planta robusta de hojas largas y puntiagudas, ideal para exteriores o interiores amplios.', '/yuka.jpeg', '{"rate": 4.6, "count": 89}'::jsonb, 17, 'yuka', 'exterior', false);

-- Reiniciar la secuencia del ID para que el próximo producto comience en 15
SELECT setval('products_id_seq', 14, true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_home ON products(home) WHERE home = true;
