import { api } from './http';
import type { ApiResponse } from '../types/api';
import type { User, AuthSession, LoginCredentials, UserRole } from '../types/user';

// Mock test credentials for local demo
const MOCK_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr_adm_01',
    name: 'Kelvin Kamau (Super Admin)',
    email: 'admin@nasafisha.nakuru.go.ke',
    role: 'admin',
    assignedZone: 'All Nakuru Zones',
  },
  citizen: {
    id: 'usr_ctz_01',
    name: 'Wanjiru Mwangi',
    phone: '+254 712 345 678',
    role: 'citizen',
    assignedZone: 'Nakuru East - Section 58',
  },
  field: {
    id: 'usr_fld_01',
    name: 'Brian Omondi',
    badgeNumber: 'FLD-2026-44',
    role: 'field',
    assignedZone: 'Zone B — Bondeni / Kivumbini',
  },
  contractor: {
    id: 'usr_cnt_01',
    name: 'Winfred Njeri (Compliance Lead)',
    companyName: 'Nakuru Green Clean Franchise Ltd',
    contractorId: 'CNT-NK-003',
    role: 'contractor',
    assignedZone: 'Nakuru East Franchise Area',
  },
};

export const authApi = {
  /**
   * Unified login supporting admin, citizen, field, and contractor credentials
   */
  async login(payload: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const response = await api.post<AuthSession>('/auth/login', payload);
      return response;
    } catch {
      // Mock fallback for standalone frontend development
      const targetUser = MOCK_USERS[payload.role] || {
        id: `usr_${Date.now()}`,
        name: payload.email || payload.phone || payload.contractorCode || 'Authorized User',
        role: payload.role,
      };

      const mockSession: AuthSession = {
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(targetUser))}.mock_signature_2026`,
        user: targetUser,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      return {
        success: true,
        data: mockSession,
        message: `Authenticated successfully as ${payload.role}`,
      };
    }
  },

  /**
   * Contractor portal specific login
   */
  async loginContractor(contractorCode: string, accessKey: string): Promise<ApiResponse<AuthSession>> {
    return this.login({
      contractorCode,
      password: accessKey,
      role: 'contractor',
    });
  },

  /**
   * Citizen OTP authentication (FR-001)
   */
  async loginCitizen(phone: string, otp: string): Promise<ApiResponse<AuthSession>> {
    return this.login({
      phone,
      otp,
      role: 'citizen',
    });
  },

  /**
   * Staff login (Admin)
   */
  async loginStaff(email: string, password: string): Promise<ApiResponse<AuthSession>> {
    return this.login({
      email,
      password,
      role: 'admin',
    });
  },

  /**
   * Field crew PIN authentication (FR-002)
   */
  async loginField(badgeNumber: string, pin: string): Promise<ApiResponse<AuthSession>> {
    return this.login({
      contractorCode: badgeNumber,
      password: pin,
      role: 'field',
    });
  },

  /**
   * Validate current session
   */
  async me(): Promise<ApiResponse<User>> {
    try {
      return await api.get<User>('/auth/me');
    } catch {
      const savedUserStr = localStorage.getItem('nasafisha_auth_user');
      if (savedUserStr) {
        return {
          success: true,
          data: JSON.parse(savedUserStr),
          message: 'Session valid',
        };
      }
      throw {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No active session' },
      };
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('nasafisha_auth_token');
    localStorage.removeItem('nasafisha_auth_user');
    return {
      success: true,
      data: null,
      message: 'Logged out successfully',
    };
  },
};

export default authApi;
