import { APIRequestContext, request } from '@playwright/test';
import {
  RegisterRequest,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  LoginSuccessResponse,
  LoginErrorResponse,
  MeResponse,
} from './types/AA-1.types';
import { API_BASE_URL } from './config';

export class ToolshopApi {
  private context?: APIRequestContext;
  private token?: string;

  setToken(token: string): void {
    this.token = token;
  }

  private async getContext(): Promise<APIRequestContext> {
    if (!this.context) {
      this.context = await request.newContext({ baseURL: API_BASE_URL });
    }
    return this.context;
  }

  async registerViaApi(
    payload: RegisterRequest
  ): Promise<{ status: number; body: RegisterSuccessResponse | RegisterErrorResponse }> {
    const ctx = await this.getContext();
    const response = await ctx.post('/users/register', { data: payload });
    return { status: response.status(), body: await response.json() };
  }

  async loginViaApi(
    email: string,
    password: string
  ): Promise<{ status: number; body: LoginSuccessResponse | LoginErrorResponse }> {
    const ctx = await this.getContext();
    const response = await ctx.post('/users/login', { data: { email, password } });
    const body = await response.json();
    if (response.status() === 200 && 'access_token' in body) {
      this.token = body.access_token;
    }
    return { status: response.status(), body };
  }

  async getMe(): Promise<{ status: number; body?: MeResponse }> {
    const ctx = await this.getContext();
    const response = await ctx.get('/users/me', {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    const status = response.status();
    if (status !== 200) {
      return { status };
    }
    return { status, body: await response.json() };
  }

  async dispose(): Promise<void> {
    await this.context?.dispose();
  }
}
