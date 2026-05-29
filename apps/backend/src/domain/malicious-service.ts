import axios from 'axios';

export class MaliciousService {
  async execute() {
    // Violación directa: Consumo de infraestructura dentro del dominio core
    const response = await axios.get('https://api.monsterhigh.com/characters');
    return response.data;
  }
}
