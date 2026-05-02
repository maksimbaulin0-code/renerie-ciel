export const DEFAULT_API_URL = "http://localhost:8080";

function getApiBase(): string {
  if (typeof window === "undefined") return DEFAULT_API_URL;
  const saved = localStorage.getItem("alimsa_api_url");
  if (saved) return saved;
  // Если открыто через ngrok — используем текущий origin
  if (window.location.hostname.includes("ngrok")) {
    return window.location.origin;
  }
  return DEFAULT_API_URL;
}

export function setApiBase(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("alimsa_api_url", url);
  }
}

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
  const base = getApiBase();
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const txt = await res.text();
      console.error(`API ${path} error ${res.status}:`, txt);
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (e: any) {
    console.error(`API ${path} failed (base=${base}):`, e);
    if (e.message?.includes("Failed to fetch") || e.message?.includes("NetworkError")) {
      throw new Error(`Сервер недоступен (${base}). Убедитесь, что бот запущен и URL начинается с https://`);
    }
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
