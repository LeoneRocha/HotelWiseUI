export type TechnologyLayer = 'frontend' | 'backend' | 'resources';

export interface ITechnologyResource {
  id: string;
  name: string;
  url: string;
  image: string;
  layer: TechnologyLayer;
  featured?: boolean;
  invertIcon?: boolean;
  /** Versão exibida só no detalhe textual, quando informada */
  version?: string;
  /** Texto complementar opcional (ex.: runtime, papel) */
  description?: string;
}
