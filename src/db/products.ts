export const products = [
  {
    id: 1,
    title: "Cala de Color",
    price: 12990,
    description: "Planta ornamental con flores vibrantes y elegantes, ideal para interiores luminosos o terrazas.",
    image: "/cala de color.jpeg",
    rating: { rate: 4.6, count: 83 },
    stock: 15,
    slug: "cala-de-color",
    category: "interior"
  },
  {
    id: 2,
    title: "Calathea Burle Marx",
    price: 8990,
    description: "Hojas decorativas con patrones únicos. Perfecta para interiores con luz indirecta.",
    image: "/calatheaBurleMarx.jpeg",
    rating: { rate: 4.8, count: 122 },
    stock: 18,
    slug: "calathea-burle-marx",
    category: "interior"
  },
  {
    id: 3,
    title: "Cuna de Moisés",
    price: 7490,
    description: "Clásica planta de interior, resistente y purificadora del aire, con flores blancas elegantes.",
    image: "/Cuna de moises.jpeg",
    rating: { rate: 4.5, count: 97 },
    stock: 20,
    slug: "cuna-de-moises",
    category: "interior"
  },
  {
    id: 4,
    title: "Dipladenia",
    price: 11500,
    description: "Planta trepadora con flores coloridas, perfecta para decorar balcones o jardines.",
    image: "/Dipladenia.jpeg",
    rating: { rate: 4.7, count: 64 },
    stock: 12,
    slug: "dipladenia",
    category: "exterior"
  },
  {
    id: 5,
    title: "Dólar Variegado",
    price: 8990,
    description: "Planta colgante de hojas pequeñas y tono plateado, ideal para ambientes luminosos.",
    image: "/DolarVariegado.jpeg",
    rating: { rate: 4.4, count: 51 },
    stock: 25,
    slug: "dolar-variegado",
    category: "interior"
  },
  {
    id: 6,
    title: "Ficus Trenzado",
    price: 13500,
    description: "Elegante ficus con troncos entrelazados, ideal como pieza central en interiores.",
    image: "/Ficus Trenzado.jpeg",
    rating: { rate: 4.9, count: 147 },
    stock: 10,
    slug: "ficus-trenzado",
    category: "interior"
  },
  {
    id: 7,
    title: "Ficus Enano Variegado",
    price: 7800,
    description: "Compacto y de follaje bicolor, perfecto para decorar mesas o repisas interiores.",
    image: "/ficusEnanoVariegado.jpeg",
    rating: { rate: 4.3, count: 42 },
    stock: 22,
    slug: "ficus-enano-variegado",
    category: "interior"
  },
  {
    id: 8,
    title: "Gomero",
    price: 9500,
    description: "Planta de hojas grandes y brillantes, resistente y purificadora del aire.",
    image: "/Gomero.jpeg",
    rating: { rate: 4.6, count: 103 },
    stock: 16,
    slug: "gomero",
    category: "interior"
  },
  {
    id: 9,
    title: "Monstera Deliciosa",
    price: 14990,
    description: "Planta tropical icónica, con grandes hojas perforadas y estilo moderno.",
    image: "/monstera deliciosa.jpeg",
    rating: { rate: 4.9, count: 188 },
    stock: 14,
    slug: "monstera-deliciosa",
    category: "interior"
  },
  {
    id: 10,
    title: "Monstera Adansonii",
    price: 10990,
    description: "Conocida como 'Monstera Monkey', sus hojas perforadas aportan un toque exótico.",
    image: "/MonsteraAdansonii.jpeg",
    rating: { rate: 4.8, count: 135 },
    stock: 19,
    slug: "monstera-adansonii",
    category: "interior"
  },
  {
    id: 11,
    title: "Peperomia Cucharita",
    price: 6890,
    description: "Pequeña planta de interior, de hojas carnosas y brillantes, muy fácil de cuidar.",
    image: "/peperomia cucharita.jpeg",
    rating: { rate: 4.5, count: 72 },
    stock: 26,
    slug: "peperomia-cucharita",
    category: "interior"
  },
  {
    id: 12,
    title: "Peperomia Hope",
    price: 7990,
    description: "Variedad colgante con hojas redondas y textura suave, perfecta para maceteros altos.",
    image: "/peperomia hope.jpeg",
    rating: { rate: 4.4, count: 61 },
    stock: 23,
    slug: "peperomia-hope",
    category: "interior"
  },
  {
    id: 13,
    title: "Sanseviera Laurentii",
    price: 11990,
    description: "También conocida como lengua de suegra, resistente y excelente purificadora del aire.",
    image: "/sanseviera laurentii.jpeg",
    rating: { rate: 4.9, count: 203 },
    stock: 11,
    slug: "sanseviera-laurentii",
    category: "exterior"
  },
  {
    id: 14,
    title: "Yuka",
    price: 9800,
    description: "Planta robusta de hojas largas y puntiagudas, ideal para exteriores o interiores amplios.",
    image: "/yuka.jpeg",
    rating: { rate: 4.6, count: 89 },
    stock: 17,
    slug: "yuka",
    category: "exterior"
  }
];

export async function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 2000);
  });
}