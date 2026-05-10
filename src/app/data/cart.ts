"use client";

import { CustomizerProduct } from "./products";

export interface CartItem {
  id: string;
  product: CustomizerProduct;
  color: string;
  text: string;
  size: string;
  quantity: number;
  price: number;
  frontImage?: string;
  backImage?: string;
}

const CART_KEY = "threadly_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function notifyCartUpdate() {
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "id">): void {
  const cart = getCart();
  cart.push({ ...item, id: Date.now().toString(36) });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

export function updateCartItem(id: string, updates: Partial<Omit<CartItem, "id">>): void {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdate();
}
