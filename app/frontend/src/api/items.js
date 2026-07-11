import { api } from './client'

function normalizeProduct(item) {
  return {
    id: item.id,
    name: item.title || item.model || 'Product',
    year: item.model || '',
    description: item.description || '',
    price: Number(item.price ?? 0),
    storage: item.storage,
    chip: item.chip,
    display: item.display,
    color: item.color,
    image: item.image || '',
    model: item.model || '',
    raw: item,
  }
}

export async function fetchProducts() {
  const items = await api.get('/items')
  return (Array.isArray(items) ? items : []).map(normalizeProduct)
}

export async function fetchProductById(id) {
  const item = await api.get(`/items/${id}`)
  return normalizeProduct(item)
}
