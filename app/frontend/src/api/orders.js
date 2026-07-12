import { api } from './client'

export function createOrder(payload) {
  return api.post('/orders', payload)
}

export function getOrderByNumber(orderNumber) {
  return api.get(`/orders/by-number/${encodeURIComponent(orderNumber)}`)
}

export function getUserOrders(userId) {
  return api.get(`/orders/user/${userId}`)
}
