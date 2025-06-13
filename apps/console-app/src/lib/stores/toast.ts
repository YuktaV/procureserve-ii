import { writable } from 'svelte/store'
import type { ToastMessage } from '$types'

export const toastStore = writable<ToastMessage[]>([])

export function addToast(toast: Omit<ToastMessage, 'id'>) {
  const id = Math.random().toString(36).substring(2, 15)
  const newToast: ToastMessage = {
    id,
    duration: 5000,
    ...toast
  }
  
  toastStore.update(toasts => [...toasts, newToast])
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(id)
  }, newToast.duration)
  
  return id
}

export function removeToast(id: string) {
  toastStore.update(toasts => toasts.filter(t => t.id !== id))
}

export function clearToasts() {
  toastStore.set([])
}