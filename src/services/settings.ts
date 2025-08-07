import { http } from "@/services/api";
import { SiteSettings } from "@/context/SettingsContext";

export async function getWhatsAppSettings(): Promise<SiteSettings["whatsapp"] | null> {
  try {
    return await http(`/api/user/nombrecomercio`);
  } catch {
    try {
      const raw = localStorage.getItem('app_settings_v1');
      if (raw) return JSON.parse(raw).whatsapp;
    } catch {}
    return null;
  }
}

export async function getSiteSettings(): Promise<Partial<SiteSettings> | null> {
  try {
    return await http(`/api/site/settings`);
  } catch {
    try {
      const raw = localStorage.getItem('app_settings_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }
}

export async function updateSiteSettings(body: Partial<SiteSettings>): Promise<void> {
  try {
    await http(`/api/site/settings`, { method: 'PATCH', body: JSON.stringify(body) });
  } catch {
    // persist local
    const current = JSON.parse(localStorage.getItem('app_settings_v1') || '{}');
    localStorage.setItem('app_settings_v1', JSON.stringify({ ...current, ...body }));
  }
}

export async function getFooter(): Promise<SiteSettings["footer"] | null> {
  try {
    return await http(`/api/site/footer`);
  } catch {
    try {
      const raw = localStorage.getItem('app_settings_v1');
      if (raw) return JSON.parse(raw).footer;
    } catch {}
    return null;
  }
}

export async function updateFooter(footer: Partial<SiteSettings["footer"]>): Promise<void> {
  try {
    await http(`/api/site/footer`, { method: 'PATCH', body: JSON.stringify(footer) });
  } catch {
    const current = JSON.parse(localStorage.getItem('app_settings_v1') || '{}');
    localStorage.setItem('app_settings_v1', JSON.stringify({ ...current, footer: { ...(current.footer||{}), ...footer } }));
  }
}
