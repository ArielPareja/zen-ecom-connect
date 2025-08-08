export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as Record<string, string>;

  const res = await fetch(path, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // Handle auth errors: invalid/expired token
    if (res.status === 401 || res.status === 403) {
      try {
        const ct = res.headers.get('content-type') || '';
        let reason = res.status === 401 ? 'expired' : 'forbidden';
        if (ct.includes('application/json')) {
          const body = await res.json().catch(() => null) as any;
          const msg: string = body?.message || body?.error || '';
          if (/expire|expirad/i.test(msg)) reason = 'expired';
          if (/invalid|inválid/i.test(msg)) reason = 'invalid';
        }
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_auth');
        localStorage.setItem('auth_error', reason);
        const isLogin = window.location.pathname.startsWith('/admin/login');
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        if (!isLogin) {
          window.location.href = `/admin/login?next=${next}`;
        }
      } catch {
        // ignore
      }
    }
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
