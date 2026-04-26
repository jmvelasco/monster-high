# Tasks: Implementación de "Mis Amigas"

## Fase 1: Dominio y Tipos (Pura Lógica)
- [x] [TDD] Definir la interfaz `FriendGroup` y tipos relacionados en `domain/amigas/`.
- [x] [TDD] Implementar validaciones de dominio (ej. nombre no vacío).

## Fase 2: Infraestructura (Persistencia)
- [ ] [TDD] Implementar `LocalStorageFriendGroupRepository`.
- [ ] [TDD] Implementar la lógica de migración de `monster-high-favorites` a `BFFs`.
- [ ] Asegurar que el repositorio cumple con la interfaz definida en el dominio.

## Fase 3: Aplicación (Hooks y Servicios)
- [ ] [TDD] Crear el hook `useFriendGroups` que orqueste las llamadas al repositorio.
- [ ] Implementar métodos: `getGroups()`, `createGroup()`, `addCharacterToGroup()`, `removeGroup()`.

## Fase 4: Navegación y Rutas
- [ ] Renombrar la ruta `/favorites` a `/amigas` en `App.tsx`.
- [ ] Actualizar el componente `Header` con el nuevo nombre y ruta.
- [ ] Asegurar que las pruebas de navegación sigan pasando.

## Fase 5: Interfaz de Usuario (UI)
- [ ] Crear la página `AmigasPage` para la gestión de grupos (Listado/Eliminación).
- [ ] Crear componente `GroupSelector` para la ficha de detalle del personaje.
- [ ] [TDD] Integrar el selector en `CharacterDetailPage`.
- [ ] Aplicar estilos "WOW" (vibrantes, modo oscuro, micro-animaciones) siguiendo el diseño de Monster High.

## Fase 6: Refactor y Cierre
- [ ] Audit contra `coding-standards.md` completado.
- [ ] Eliminar código obsoleto de la antigua implementación de favoritos.
- [ ] Verificar cobertura de tests (min 80%).
