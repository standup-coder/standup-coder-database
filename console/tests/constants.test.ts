import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  APP_VERSION,
  NAV_ITEMS,
  SCALE_MAP,
  INDUSTRY_ICONS,
  CITY_GROUPS,
  PAGINATION_CONFIG,
  CHART_COLORS,
} from '../src/utils/constants';

describe('Constants', () => {
  it('has correct app name and version', () => {
    expect(APP_NAME).toBe('Standup Coder Database');
    expect(APP_VERSION).toBe('1.0.0');
  });

  it('has navigation items', () => {
    expect(NAV_ITEMS.length).toBeGreaterThan(0);
    expect(NAV_ITEMS[0]).toHaveProperty('key');
    expect(NAV_ITEMS[0]).toHaveProperty('label');
    expect(NAV_ITEMS[0]).toHaveProperty('path');
  });

  it('has scale mappings', () => {
    expect(SCALE_MAP['10000+人']).toEqual({ label: '大型企业', order: 5 });
    expect(SCALE_MAP['<100人']).toEqual({ label: '微型企业', order: 0 });
  });

  it('has industry icons', () => {
    expect(INDUSTRY_ICONS['人工智能']).toBe('🤖');
    expect(INDUSTRY_ICONS['大数据']).toBe('📊');
  });

  it('has city groups', () => {
    expect(CITY_GROUPS['一线城市']).toContain('北京');
    expect(CITY_GROUPS['一线城市']).toContain('上海');
  });

  it('has pagination config', () => {
    expect(PAGINATION_CONFIG.defaultPageSize).toBe(20);
    expect(PAGINATION_CONFIG.pageSizeOptions).toContain(50);
  });

  it('has chart colors', () => {
    expect(CHART_COLORS.length).toBeGreaterThan(0);
    expect(CHART_COLORS[0]).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
