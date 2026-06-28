const PREFERRED_SERVICE_KEY = "aks-preferred-service";

export function setPreferredService(id: string) {
  sessionStorage.setItem(PREFERRED_SERVICE_KEY, id);
}

export function getPreferredService(): string | null {
  return sessionStorage.getItem(PREFERRED_SERVICE_KEY);
}
