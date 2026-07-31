import TechnologyCatalogService from '../../services/technologyCatalogService';

describe('technologyCatalogService', () => {
  const original = process.env.VITE_TECHNOLOGIES_JSON;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.VITE_TECHNOLOGIES_JSON;
    } else {
      process.env.VITE_TECHNOLOGIES_JSON = original;
    }
  });

  test('should parse technologies from environment JSON', async () => {
    process.env.VITE_TECHNOLOGIES_JSON = JSON.stringify([
      {
        id: 'react',
        name: 'React',
        url: 'https://react.dev',
        image: 'https://example.com/react.svg',
        layer: 'frontend',
        featured: true,
      },
    ]);

    const result = await TechnologyCatalogService.getTechnologies();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('React');
    expect(result[0].featured).toBe(true);
  });

  test('should return empty array when JSON is missing', async () => {
    delete process.env.VITE_TECHNOLOGIES_JSON;
    const result = await TechnologyCatalogService.getTechnologies();
    expect(result).toEqual([]);
  });

  test('should return empty array when JSON is invalid', async () => {
    process.env.VITE_TECHNOLOGIES_JSON = '{not-json';
    const result = await TechnologyCatalogService.getTechnologies();
    expect(result).toEqual([]);
  });
});
