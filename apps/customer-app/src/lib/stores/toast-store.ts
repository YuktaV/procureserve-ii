import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	description?: string;
	duration?: number;
	dismissible?: boolean;
}

export interface ToastOptions {
	type: ToastType;
	title: string;
	description?: string;
	duration?: number;
	dismissible?: boolean;
}

// Create the toast store
export const toasts = writable<Toast[]>([]);

// Generate unique ID for each toast
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Add a new toast
export const addToast = (options: ToastOptions): string => {
	const id = generateId();
	const toast: Toast = {
		id,
		type: options.type,
		title: options.title,
		description: options.description,
		duration: options.duration ?? 5000,
		dismissible: options.dismissible ?? true
	};

	toasts.update(current => [...current, toast]);

	// Auto-dismiss after duration
	if (toast.duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, toast.duration);
	}

	return id;
};

// Remove a specific toast
export const removeToast = (id: string) => {
	toasts.update(current => current.filter(toast => toast.id !== id));
};

// Clear all toasts
export const clearToasts = () => {
	toasts.set([]);
};

// Convenience functions for different toast types
export const toastSuccess = (title: string, description?: string) => 
	addToast({ type: 'success', title, description });

export const toastError = (title: string, description?: string) => 
	addToast({ type: 'error', title, description });

export const toastWarning = (title: string, description?: string) => 
	addToast({ type: 'warning', title, description });

export const toastInfo = (title: string, description?: string) => 
	addToast({ type: 'info', title, description });
