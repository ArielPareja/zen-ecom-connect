import React, { createContext, useContext, useEffect, useState } from "react";
import { getFooter, getSiteSettings, getWhatsAppSettings, updateFooter, updateSiteSettings } from "@/services/settings";

export type SiteSettings = {
  siteName: string;
  colors: { primary: string };
  whatsapp: { phone: string; greeting: string; endOfMessage: string };
  footer: { address?: string; email?: string; note?: string };
};

type SettingsContextType = {
  settings: SiteSettings;
  saveSettings: (s: Partial<SiteSettings>) => Promise<void>;
  saveFooter: (f: Partial<SiteSettings["footer"]>) => Promise<void>;
};

const defaultSettings: SiteSettings = {
  siteName: "Mi Tienda",
  colors: { primary: "#0ea5e9" },
  whatsapp: {
    phone: "",
    greeting: "¡Hola! Me gustaría realizar el siguiente pedido:",
    endOfMessage: "Por favor, confirma disponibilidad y forma de pago. ¡Gracias!",
  },
  footer: {},
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const raw = localStorage.getItem("app_settings_v1");
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    // Cargar desde API/mocks
    (async () => {
      try {
        const [site, wa, footer] = await Promise.all([
          getSiteSettings(),
          getWhatsAppSettings(),
          getFooter(),
        ]);
        const merged = {
          ...settings,
          ...(site || {}),
          whatsapp: wa || settings.whatsapp,
          footer: footer || settings.footer,
        } as SiteSettings;
        setSettings(merged);
        // Aplicar color primario al :root si viene en HEX
        if (merged.colors?.primary) {
          document.documentElement.style.setProperty("--primary", hexToHsl(merged.colors.primary));
        }
      } catch {
        // silencioso, usamos mocks/localStorage
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("app_settings_v1", JSON.stringify(settings));
  }, [settings]);

  const saveSettings = async (s: Partial<SiteSettings>) => {
    const next = { ...settings, ...s } as SiteSettings;
    setSettings(next);
    try {
      await updateSiteSettings(next);
    } catch {}
    if (next.colors?.primary) {
      document.documentElement.style.setProperty("--primary", hexToHsl(next.colors.primary));
    }
  };

  const saveFooter = async (f: Partial<SiteSettings["footer"]>) => {
    const next = { ...settings, footer: { ...settings.footer, ...f } } as SiteSettings;
    setSettings(next);
    try {
      await updateFooter(next.footer);
    } catch {}
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, saveFooter }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return ctx;
};

function hexToHsl(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0,2), 16) / 255;
  const g = parseInt(c.substring(2,4), 16) / 255;
  const b = parseInt(c.substring(4,6), 16) / 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
}
