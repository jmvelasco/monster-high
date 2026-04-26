# Specs: Mis Amigas (Colecciones de Personajes)

## Escenario 1: Creación de un nuevo grupo de amigas
**Given** que una usuaria está en la página de gestión de amigas
**When** pulsa en "Crear nuevo grupo" e introduce el nombre "Vampiras"
**Then** el sistema debe crear un grupo vacío con ese nombre y mostrarlo en la lista.

### Criterios de Aceptación:
- El nombre del grupo no puede estar vacío.
- El ID del grupo debe ser único (generado automáticamente).
- El grupo recién creado aparece inmediatamente en la UI.

## Escenario 2: Asignación de un personaje a un grupo desde el detalle
**Given** que una usuaria está viendo la ficha de "Draculaura"
**When** selecciona el grupo "Vampiras" en el selector de amigas
**Then** "Draculaura" debe añadirse a la lista de miembros de ese grupo.

### Criterios de Aceptación:
- Si el personaje ya está en el grupo, no debe duplicarse.
- Se debe mostrar un feedback visual de éxito.

## Escenario 3: Migración de favoritos antiguos
**Given** que una usuaria tiene personajes en su antigua lista de favoritos
**When** accede a la nueva sección de "/amigas" por primera vez
**Then** el sistema debe crear automáticamente un grupo llamado "BFFs" conteniendo esos personajes.

### Criterios de Aceptación:
- La lista antigua se elimina del almacenamiento tras la migración.
- El usuario no pierde sus datos previos.

## Casos Borde y Errores
- **Nombre duplicado**: Si se intenta crear un grupo con un nombre que ya existe, se debe mostrar un aviso (aunque se permita si tienen IDs distintos, se recomienda unicidad visual).
- **Grupo vacío**: Un grupo puede existir sin miembros.
- **Eliminación de grupo**: Al eliminar un grupo, los personajes no se borran del catálogo general, solo de esa colección.
