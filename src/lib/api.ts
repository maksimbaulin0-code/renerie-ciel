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

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/api/services`);
  return res.json();
}

export async function fetchSlots(): Promise<Slot[]> {
  const res = await fetch(`${API_BASE}/api/slots`);
  return res.json();
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch(`${API_BASE}/api/portfolio`);
  return res.json();
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/api/reviews`);
  return res.json();
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/api/bookings?user_id=${userId}`);
  return res.json();
}

export async function updatePrice(id: number, price: number): Promise<void> {
  await fetch(`${API_BASE}/api/update-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price }),
  });
}

export async function deleteSlot(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/delete-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
