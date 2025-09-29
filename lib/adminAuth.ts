// Gestion de l'authentification administrateur
export const ADMIN_PASSWORD = 'chrollolucifer';
export const ADMIN_SESSION_KEY = 'admin_authenticated';

export function authenticateAdmin(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    // Expire la session après 2 heures
    setTimeout(() => {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }, 2 * 60 * 60 * 1000);
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}