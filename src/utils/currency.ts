"use client";

const TTL_MS = 60 * 60 * 1000;
// Cambiamos la key para invalidar caches anteriores rotos
const STORAGE_KEY = "fx_rates_CLP_v2";

type Rates = Record<string, number>;

// Tasas de respaldo aproximadas por si falla la API
const FALLBACK_RATES: Rates = {
  CLP: 1,
  USD: 0.0011, // ~900 CLP
  EUR: 0.0010, // ~980 CLP
};

function now() {
  return Date.now();
}

function readCache(): { timestamp: number; rates: Rates } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(payload: { timestamp: number; rates: Rates }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export async function fetchRatesCLP(): Promise<Rates> {
  const cached = readCache();
  if (cached && now() - cached.timestamp < TTL_MS) {
    // Verificar que el cache tenga datos útiles
    if (cached.rates["USD"] || cached.rates["EUR"]) {
      return cached.rates;
    }
  }

  try {
    // Usar open.er-api.com que es gratuito y no requiere key
    const res = await fetch("https://open.er-api.com/v6/latest/CLP", {
        // Evitar cache del navegador para esta request
        cache: "no-store" 
    });
    
    if (!res.ok) throw new Error("fx error");
    const data = await res.json();
    const rates: Rates = data?.rates ?? {};
    rates["CLP"] = 1;

    // Validar que obtuvimos tasas reales
    if (!rates["USD"] && !rates["EUR"]) {
        throw new Error("No rates found");
    }

    console.log("✅ Conexión exitosa: Usando tasas en vivo de open.er-api.com");
    writeCache({ timestamp: now(), rates });
    return rates;
  } catch (e) {
    console.warn("⚠️ No se pudo contactar a la API, usando tasas internas aproximadas:", e);
    // Si falla, usamos los fallbacks para que la UI no se rompa
    return FALLBACK_RATES;
  }
}

export function convertFromCLP(amountCLP: number, target: string, rates: Rates): number {
  // Si no existe la tasa, usamos 1 como último recurso, 
  // pero intentamos buscar en FALLBACK_RATES si rates está incompleto
  const r = rates[target] ?? FALLBACK_RATES[target] ?? 1;
  return amountCLP * r;
}

export function formatCurrency(amount: number, currency: string): string {
  const locale =
    currency === "CLP"
      ? "es-CL"
      : currency === "EUR"
      ? "es-ES"
      : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(amount);
}
