// ❌ VIOLACIÓN HEXAGONAL DIRECTA
// Tu regla de ESLint prohíbe explícitamente que el dominio importe de la capa de infraestructura
import { WikiScraper } from '../../infrastructure/scraper/WikiScraper';

export interface InsubordinateEntity {
  id: string;
  scraperInstance: typeof WikiScraper; // Uso ilegal del detalle de infraestructura
}
