import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import App from '../../src/App.vue';
import { router } from '../../src/router';
import { useAuthStore } from '../../src/store/auth.store';

describe('layout wiring', () => {
  it('renders the correct shell for guest, citizen, field and admin', async () => {
    localStorage.clear();
    const pinia = createPinia();
    setActivePinia(pinia);

    const app = createApp(App);
    app.use(pinia);
    app.use(router);
    const el = document.createElement('div');
    document.body.appendChild(el);
    app.mount(el);
    const auth = useAuthStore();

    // Guest → CitizenLogin inside AuthLayout
    await router.replace('/');
    await nextTick();
    await nextTick();
    const guestHtml = el.innerHTML;
    expect(guestHtml).toContain('SRS-NASAFISHA-001');
    expect(guestHtml).toContain('Citizen login');

    // Citizen portal → CitizenLayout
    auth.setSession({ token: 't-citizen', user: { id: 'u1', name: 'Wanjiru', role: 'citizen' } });
    await router.replace('/citizen/reports');
    await nextTick();
    await nextTick();
    const citizenHtml = el.innerHTML;
    expect(citizenHtml).toContain('2026 Nakuru County');
    expect(citizenHtml).not.toContain('SRS-NASAFISHA-001');

    // Field portal → FieldLayout
    auth.setSession({ token: 't-field', user: { id: 'u2', name: 'Brian', role: 'field' } });
    await router.replace('/field/tickets');
    await nextTick();
    await nextTick();
    const fieldHtml = el.innerHTML;
    expect(fieldHtml).toContain('CREW ONLINE');
    expect(fieldHtml).not.toContain('County control');

    // Admin portal → AdminLayout
    auth.setSession({ token: 't-admin', user: { id: 'u3', name: 'Kelvin', role: 'admin' } });
    await router.replace('/admin');
    await nextTick();
    await nextTick();
    const adminHtml = el.innerHTML;
    expect(adminHtml).toContain('County control');

    app.unmount();
    el.remove();
    localStorage.clear();
  });
});
