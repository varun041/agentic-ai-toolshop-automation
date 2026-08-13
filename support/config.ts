import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/** Env-configurable so the suite can point at a different Toolshop instance
 * (e.g. a local/staging deployment) without touching test code or feature
 * files — see .env.example. Defaults to the live demo site used throughout
 * AA-1 so the suite still runs out of the box with no .env required. */
export const BASE_URL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';
