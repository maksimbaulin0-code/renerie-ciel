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

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, init);
  return res.json();
}

export async function fetchServices(): Promise<Service[]> {
  return apiFetch("/api/services");
}

export async function fetchSlots(): Promise<Slot[]> {
  return apiFetch("/api/slots");
}

export async function fetchAllSlots(): Promise<Slot[]> {
  return apiFetch("/api/all-slots");
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  return apiFetch("/api/portfolio");
}

export async function fetchReviews(): Promise<Review[]> {
  return apiFetch("/api/reviews");
}

export async function fetchBookings(): Promise<Booking[]> {
  return apiFetch("/api/bookings");
}

export async function addSlot(date: string, time: string): Promise<{ ok: boolean; id: number }> {
  return apiFetch("/api/add-slot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, time }),
  });
}

export async function deleteSlot(id: number): Promise<void> {
  await apiFetch("/api/delete-slot", {
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

export async function deleteService(id: number): Promise<void> {
  await apiFetch("/api/delete-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function updatePrice(id: number, price: number): Promise<void> {
  await apiFetch("/api/update-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price }),
  });
}
