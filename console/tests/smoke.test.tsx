import { describe, it, expect } from 'vitest';

describe('Page Component Exports', () => {
  it('all page components can be imported', async () => {
    const [{ Home }, { Companies }, { Jobs }, { Rankings }, { Analytics }, { About }] = await Promise.all([
      import('../src/pages/Home'),
      import('../src/pages/Companies'),
      import('../src/pages/Jobs'),
      import('../src/pages/Rankings'),
      import('../src/pages/Analytics'),
      import('../src/pages/About'),
    ]);

    expect(Home).toBeDefined();
    expect(Companies).toBeDefined();
    expect(Jobs).toBeDefined();
    expect(Rankings).toBeDefined();
    expect(Analytics).toBeDefined();
    expect(About).toBeDefined();
  });
});

describe('Layout Component Exports', () => {
  it('layout components can be imported', async () => {
    const { MainLayout } = await import('../src/components/layout/MainLayout');
    const { LazyOutlet } = await import('../src/components/layout/LazyOutlet');

    expect(MainLayout).toBeDefined();
    expect(LazyOutlet).toBeDefined();
  });
});

describe('Router Configuration', () => {
  it('router has valid route tree', async () => {
    const { router } = await import('../src/router');
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBeGreaterThan(0);
  });
});
