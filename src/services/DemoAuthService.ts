import type { AuthUser, IAuthService } from './IAuthService';
import { DEMO_CREW, getActiveDemoUser, setActiveDemoUser } from './demoClient';

/** Offline auth used in demo mode (`VITE_DEMO=1`). Always "signed in". */
export class DemoAuthService implements IAuthService {
  readonly fabricAuthEnabled = false;

  async signIn(): Promise<AuthUser> {
    return { ...getActiveDemoUser() };
  }

  async signOut(): Promise<void> {}

  async getCurrentUser(): Promise<AuthUser | null> {
    return { ...getActiveDemoUser() };
  }

  async initEmbeddedAuth(): Promise<AuthUser | null> {
    return { ...getActiveDemoUser() };
  }

  async switchUser(id: string): Promise<AuthUser> {
    return { ...setActiveDemoUser(id) };
  }

  listSwitchableUsers(): AuthUser[] {
    return DEMO_CREW.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  }
}
