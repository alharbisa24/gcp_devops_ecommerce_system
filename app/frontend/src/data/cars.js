export const cars = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d7f6f?auto=format&fit=crop&w=900&q=80',
    price: 999,
    description: 'A titanium design with the A17 Pro chip and a versatile camera system.',
    storage: '256GB',
    chip: 'A17 Pro',
    display: '6.1-inch',
    color: 'Natural Titanium',
  },
  {
    id: 2,
    name: 'MacBook Air',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    price: 1199,
    description: 'Thin, light, and powerful with the latest M3 chip for everyday creativity.',
    storage: '512GB',
    chip: 'M3',
    display: '13.6-inch',
    color: 'Midnight',
  },
  {
    id: 3,
    name: 'iPad Air',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
    price: 599,
    description: 'A fast, colorful tablet for work, play, and everything in between.',
    storage: '128GB',
    chip: 'M1',
    display: '10.9-inch',
    color: 'Blue',
  },
]

export function getCarById(id) {
  return cars.find((car) => String(car.id) === String(id))
}
