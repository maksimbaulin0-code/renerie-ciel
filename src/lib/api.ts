const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Service {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface Slot {
  id: number;
  date: string;
  time: string;
  status: string;
}

export interface PortfolioItem {
  id: number;
  photo_url: string;
  description: string;
}

export interface Review {
  id: number;
  user_name: string;
  text: string;
  rating: number;
}

export interface Booking {
  id: number;
  name: string;
  price: number;
  date: string;
  time: string;
  comment: string;
  photo_wish: string;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const txt = await res.text();
      console.error(`API ${path} error ${res.status}:`, txt);
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (e) {
    console.error(`API ${path} failed:`, e);
    throw e;
  }
}

export async function fetchServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services");
}

export async function fetchSlots(): Promise<Slot[]> {
  return apiFetch<Slot[]>("/api/slots");
}

export async function fetchAllSlots(): Promise<Slot[]> {
  return apiFetch<Slot[]>("/api/all-slots");
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  return apiFetch<PortfolioItem[]>("/api/portfolio");
}

export async function fetchReviews(): Promise<Review[]> {
  return apiFetch<Review[]>("/api/reviews");
}

export async function fetchBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>("/api/bookings");
}

export async function addSlot(date: string, time: string): Promise<{ ok: boolean; id: number }> {
  return apiFetch("/api/add-slot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, time }),
  });
}

export async function deleteSlot(id: number): Promise<{ ok: boolean }> {
  return apiFetch("/api/delete-slot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function addService(name: string, price: number, category: string): Promise<{ ok: boolean; id: number }> {
  return apiFetch("/api/add-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category }),
  });
}

export async function deleteService(id: number): Promise<{ ok: boolean }> {
  return apiFetch("/api/delete-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function updatePrice(id: number, price: number): Promise<{ ok: boolean }> {
  return apiFetch("/api/update-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price }),
  });
}
