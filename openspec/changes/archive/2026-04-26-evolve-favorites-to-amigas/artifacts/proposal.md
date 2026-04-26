# Proposal: Evolución de Favoritos a "Mis Amigas"

## Contexto y "Por qué"
El sistema actual de "Favoritos" es una implementación técnica plana basada en una lista de IDs en `localStorage`. Aunque funcional, carece de la profundidad narrativa y lúdica que requiere el universo de Monster High. 

Esta propuesta busca transformar esa lista plana en un sistema de **Colecciones Personalizadas (Grupos de Amigas)**. El objetivo es permitir que la usuaria no solo marque personajes, sino que los organice en grupos temáticos (ej. "Vampiras", "Monstruos", "BFFs"), aportando una capa de personalización y juego mucho más cercana al público objetivo.

Técnicamente, esto implica:
1. Evolucionar de un array de strings a una estructura de objetos con metadatos.
2. Implementar una arquitectura hexagonal en el frontend para desacoplar la lógica de gestión de grupos del almacenamiento (`localStorage`).
3. Mejorar la semántica de la navegación de `/favorites` a `/amigas`.

## Objetivos
- **Concepto "Amigas"**: Sustituir toda referencia a "Favoritos" por "Amigas" y "Grupos de Amigas".
- **Gestión de Grupos**: Permitir crear, renombrar y eliminar grupos personalizados.
- **Asignación Dinámica**: Facilitar la asignación de un personaje a un grupo (o creación de uno nuevo) directamente desde su ficha.
- **Persistencia Estructurada**: Migrar los datos de `localStorage` a un formato de colecciones.

## Non-goals
- Sincronización en la nube o backend (se mantendrá local por ahora).
- Funcionalidades sociales (compartir grupos con otras usuarias).
- Edición de los personajes en sí (solo organización).

## Valor de Negocio / UX
Transforma una utilidad técnica en una funcionalidad de "coleccionismo" y "organización" que fomenta la retención y la conexión emocional con el contenido de Monster High.
