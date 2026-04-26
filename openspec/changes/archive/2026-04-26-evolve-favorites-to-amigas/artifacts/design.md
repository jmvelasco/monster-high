# Design: Transición a "Mis Amigas" y Arquitectura Hexagonal

## Arquitectura de Carpetas (apps/web/src)
Para alinear el frontend con el backend y las directrices de arquitectura hexagonal, estructuraremos la funcionalidad en capas dentro de `apps/web/src`:

```text
src/
├── domain/amigas/
│   ├── FriendGroup.ts (Entidad y tipos)
│   └── FriendGroupRepository.ts (Interfaz del puerto)
├── application/amigas/
│   └── FriendGroupService.ts (Lógica de orquestación / Caso de uso)
├── infrastructure/amigas/
│   └── LocalStorageFriendGroupRepository.ts (Adaptador concreto)
└── components/amigas/ (Componentes UI / Adaptadores de entrada)
    ├── AmigasPage.tsx
    ├── GroupSelector.tsx
    └── CreateGroupModal.tsx
```

## Modelo de Datos (Dominio)
La entidad central será `FriendGroup`:

```typescript
export interface FriendGroup {
  readonly id: string;
  readonly name: string;
  readonly members: string[]; // Slugs de personajes
}
```

## Flujo de Datos
1. **Repository (Port)**: Define métodos como `findAll()`, `save(group)`, `delete(id)`.
2. **Infrastructure (Adapter)**: Implementa la persistencia en `localStorage`. Al cargar por primera vez, si existen antiguos "Favoritos", se migrarán a un grupo por defecto llamado "BFFs".
3. **Application (Service)**: Provee una API limpia a los componentes de React (`addGroup`, `removeCharacterFromGroup`, etc.).
4. **UI (React Hooks/Components)**: Un hook `useFriendGroups` actuará como puente entre la capa de aplicación y los componentes.

## Cambios en UI/UX
- **Ruta**: `/amigas` sustituye a `/favorites`.
- **Header**: Actualizar etiqueta y enlace.
- **Character Detail**:
    - Sustituir el botón de "corazón" por un botón de "Añadir a Amigas".
    - Al pulsar, se despliega un selector de grupos existentes y una opción de "Crear nuevo grupo".
- **Página de Amigas**:
    - Grid de grupos. Cada grupo muestra un resumen de sus integrantes.
    - Al seleccionar un grupo, se muestran las `CharacterCard` de sus miembros.

## Estrategia de Migración
Se implementará un "Migration Guard" en el repositorio de infraestructura. Si detecta la clave antigua `monster-high-favorites`, creará automáticamente el grupo "BFFs" con esos datos y eliminará la clave antigua para evitar inconsistencias.
