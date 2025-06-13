import { writable } from 'svelte/store';

export interface ModalOptions {
	id: string;
	title?: string;
	description?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	closable?: boolean;
	backdrop?: boolean;
	component?: any;
	props?: Record<string, any>;
}

export interface Modal extends ModalOptions {
	open: boolean;
}

// Create the modal store
export const modals = writable<Modal[]>([]);

// Open a modal
export const openModal = (options: ModalOptions): void => {
	const modal: Modal = {
		...options,
		closable: options.closable ?? true,
		backdrop: options.backdrop ?? true,
		size: options.size ?? 'md',
		open: true
	};

	modals.update(current => {
		// Remove existing modal with same ID if exists
		const filtered = current.filter(m => m.id !== options.id);
		return [...filtered, modal];
	});
};

// Close a modal by ID
export const closeModal = (id: string): void => {
	modals.update(current => 
		current.map(modal => 
			modal.id === id ? { ...modal, open: false } : modal
		)
	);

	// Remove closed modal after animation
	setTimeout(() => {
		modals.update(current => current.filter(modal => modal.id !== id));
	}, 300);
};

// Close all modals
export const closeAllModals = (): void => {
	modals.update(current => 
		current.map(modal => ({ ...modal, open: false }))
	);

	// Remove all modals after animation
	setTimeout(() => {
		modals.set([]);
	}, 300);
};

// Check if any modal is open
export const hasOpenModal = writable(false);

// Update hasOpenModal when modals change
modals.subscribe(modalList => {
	hasOpenModal.set(modalList.some(modal => modal.open));
});
