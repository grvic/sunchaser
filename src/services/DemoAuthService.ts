import type { AuthUser, IAuthService } from './IAuthService';
import { DEMO_USER } from './demoClient';

/** Offline auth used in demo mode (`VITE_DEMO=1`). Always "signed in". */
export class DemoAuthService implements IAuthService {
  readonly fabricAuthEnabled = false;

  async signIn(): Promise<AuthUser> {
    return { ...DEMO_USER };
  }

  async signOut(): Promise<void> {}

  async getCurrentUser(): Promise<AuthUser | null> {
    return { ...DEMO_USER };
  }

  async initEmbeddedAuth(): Promise<AuthUser | null> {
    return { ...DEMO_USER };
  }
}
