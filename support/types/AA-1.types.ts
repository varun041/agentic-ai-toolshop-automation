// TypeScript interfaces for AA-1 (User Authentication & Account Management).
// Request/response shapes are ground truth from live network capture against
// https://api.practicesoftwaretesting.com on 2026-08-11 (Stage 4) — not assumed
// from Swagger, which was a client-rendered SPA that could not be scraped statically.

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  dob: string; // YYYY-MM-DD
  country: string; // ISO country code, e.g. "US"
  postcode: string;
  house_number: string;
  street?: string; // auto-filled by postcode-lookup, submitted alongside
  city?: string; // auto-filled by postcode-lookup
  state?: string; // auto-filled by postcode-lookup
  phone: string;
  email: string;
  password: string;
}

export interface RegisterSuccessResponse {
  id: string;
}

export interface RegisterErrorResponse {
  message: string; // e.g. "A customer with this email address already exists."
                    // or "The given password has appeared in a data leak. Please choose a different password."
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  access_token: string;
  token_type: string;
}

export interface LoginErrorResponse {
  message: string; // "Invalid email or password" — identical for wrong-password
                    // and non-existent-email cases (no user enumeration, AA-12 AC2)
}

export interface MeResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  // NOTE: email is intentionally absent — the /account/profile email field is
  // read-only in the current app state (Stage 4 Drift #2). Do not add it back
  // to this interface until that's resolved; it would not match live behavior.
}

export interface ProfileUpdateSuccessResponse {
  id: string;
}

export interface PostcodeLookupResponse {
  street: string;
  city: string;
  state: string;
}
