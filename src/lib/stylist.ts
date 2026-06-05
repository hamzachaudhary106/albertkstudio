const PREFERRED_STYLIST_KEY = "aks-preferred-stylist";

export function setPreferredStylist(id: string) {
  sessionStorage.setItem(PREFERRED_STYLIST_KEY, id);
}

export function getPreferredStylist(): string | null {
  return sessionStorage.getItem(PREFERRED_STYLIST_KEY);
}
