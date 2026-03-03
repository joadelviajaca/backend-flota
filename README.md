### 📄 Documentación de la API: Galactic Fleet Command

**URL Base:** `http://localhost:4000`

#### 🛡️ 1. Autenticación (Auth)

Todas las peticiones (excepto el Login y la comprobación de matrícula) requieren que envíes un token JWT válido en las cabeceras de tu petición.

- **Header requerido:** `Authorization: Bearer <tu_token>`

| **Método** | **Endpoint** | **Descripción** | **Body / Query** | **Respuesta Exitosa** |
| --- | --- | --- | --- | --- |
| **POST** | `/auth/login` | Iniciar sesión en el sistema. | `{ "codeName": "Admin", "password": "123456" }` | `200 OK` Devuelve el token y datos básicos directamente. |
| **GET** | `/auth/active-profile` | Recupera los datos del usuario logueado usando el token. | *Ninguno* | `200 OK` Devuelve el perfil completo del almirante. |

Estructura del token:
```json
{ 
    id: number, 
    role: string, 
    codeName: string,
    exp: number,
    iat: number 
}
```
#### ⏱️ 2. Comprobación de matrícula

Endpoint público diseñado para verificar si un código de matrícula ya está registrado antes de dar de alta una nave.

| **Método** | **Endpoint** | **Descripción** | **Body / Query** | **Respuesta Exitosa** |
| --- | --- | --- | --- | --- |
| **GET** | `/spaceships/check-registration` | Verifica la disponibilidad de una matrícula. | **Query:** `?code=SYS-001` | `200 OK` Devuelve `{ "isAvailable": false }` |

#### 🚀 3. Naves Espaciales (Spaceships)

Rutas protegidas con Token. Estructura esperada de Nave: `{ "id": number, "registrationCode": string, "name": string, "class": string, "status": string }`

| **Método** | **Endpoint** | **Descripción** | **Body / Query** | **Respuesta Exitosa** |
| --- | --- | --- | --- | --- |
| **GET** | `/spaceships` | Obtiene el listado de toda la flota. | *Ninguno* | `200 OK` Array directo `[ {...}, {...} ]` |
| **GET** | `/spaceships/:id` | Obtiene los detalles de una nave. | *Ninguno* | `200 OK` Objeto de la nave. |
| **POST** | `/spaceships` | Registra una nueva nave. | Objeto Nave (sin ID) | `201 Created` Nave creada con su ID. |
| **PUT** | `/spaceships/:id` | Actualiza una nave existente. | Objeto Nave actualizado | `200 OK` Nave actualizada. |
| **DELETE** | `/spaceships/:id` | Retira una nave de la flota. | *Ninguno* | `204 No Content` |

#### 👨‍🚀 4. Tripulación (Crew)

Rutas protegidas con Token. Estructura esperada de Tripulante: `{ "id": number, "name": string, "rank": string, "spaceshipId": number }`

| **Método** | **Endpoint** | **Descripción** | **Body / Query** | **Respuesta Exitosa** |
| --- | --- | --- | --- | --- |
| **GET** | `/crew` | Obtiene el listado de la tripulación. | *Ninguno* | `200 OK` Array directo `[ {...}, {...} ]` |
| **GET** | `/crew/:id` | Obtiene un tripulante concreto. | *Ninguno* | `200 OK` Objeto del tripulante. |
| **POST** | `/crew` | Alista un nuevo tripulante. | Objeto Tripulante (sin ID) | `201 Created` Tripulante creado con su ID. |
| **PUT** | `/crew/:id` | Actualiza rango o asignación. | Objeto Tripulante act. | `200 OK` Tripulante actualizado. |
| **DELETE** | `/crew/:id` | Da de baja a un tripulante. | *Ninguno* | `204 No Content` |

---