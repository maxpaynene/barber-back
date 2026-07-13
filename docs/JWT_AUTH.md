# Autenticación JWT - Barbershop API

## ✅ Implementación Completa

La autenticación JWT está totalmente implementada con las siguientes características:

### 🔐 Características Implementadas

- ✅ Registro de usuarios con hash de contraseñas (bcrypt)
- ✅ Login con email y contraseña
- ✅ Autenticación con JWT
- ✅ Protección de rutas con Guards
- ✅ Control de roles (admin, barbero, cliente)
- ✅ Integración con Google OAuth (opcional)
- ✅ Validación de usuarios activos

## 📁 Estructura de Archivos

```
src/auth/
├── auth.module.ts              # Módulo principal
├── auth.service.ts             # Lógica de autenticación
├── auth.controller.ts          # Endpoints de autenticación
├── dto/
│   ├── login.dto.ts           # DTO para login
│   └── register.dto.ts        # DTO para registro
├── guards/
│   ├── jwt-auth.guard.ts      # Guard para proteger rutas
│   ├── google-auth.guard.ts   # Guard para Google OAuth
│   └── roles.guard.ts         # Guard para control de roles
├── strategies/
│   ├── jwt.strategy.ts        # Estrategia JWT Passport
│   └── google.strategy.ts     # Estrategia Google OAuth
└── decorators/
    ├── roles.decorator.ts     # Decorador @Roles()
    └── public.decorator.ts    # Decorador @Public()
```

## 🚀 Endpoints Disponibles

### 1. Registro de Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "avatar": "https://avatar.com/juan.jpg",
  "rolId": 3
}
```

**Respuesta:**

```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "avatar": "https://avatar.com/juan.jpg",
    "rol_id": 3,
    "active": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "rol_id": 3,
    "rolName": "Cliente"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Obtener Perfil (Requiere autenticación)

```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**

```json
{
  "id": 1,
  "email": "juan@example.com",
  "name": "Juan Pérez",
  "rolId": 3,
  "rolName": "Cliente"
}
```

## 🛡️ Uso en Controladores

### Proteger toda una ruta con JWT

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('example')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExampleController {
  // Todas las rutas requerirán autenticación
}
```

### Proteger rutas específicas

```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getProtectedData() {
  return { message: 'Datos protegidos' };
}
```

### Control por Roles

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(1) // Solo admin (rol_id = 1)
@ApiBearerAuth()
create(@Body() createDto: CreateDto) {
  return this.service.create(createDto);
}

@Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(1, 2) // Admin y Barbero (rol_id = 1 o 2)
@ApiBearerAuth()
update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  return this.service.update(+id, updateDto);
}
```

### Acceder al usuario autenticado

```typescript
import { Request } from '@nestjs/common';

@Get('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getMyData(@Request() req: any) {
  const user = req.user; // { id, email, name, rolId, rolName }
  return user;
}
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# JWT Configuration
JWT_SECRET=BARBER_SECRET_2026
JWT_EXPIRES_IN=7d

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## 🌐 Flujo Google OAuth

El backend soporta dos formas de iniciar el login con Google:

### Opción recomendada: navegación directa

```http
GET /api/auth/google
```

Esta ruta redirige al navegador a Google y es la forma estándar de iniciar OAuth.

### Opción compatible con frontend actual

```http
POST /api/auth/google
```

**Respuesta:**

```json
{
  "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

El frontend debe leer `authorizationUrl` y luego navegar a esa URL con `window.location.href`.

### Callback de Google

```http
GET /api/auth/google/callback
```

**Respuesta:**

```json
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "avatar": "https://avatar.com/juan.jpg",
    "rol_id": 3,
    "active": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### IDs de Roles

Por convención en el sistema:

- **1** = Admin
- **2** = Barbero
- **3** = Cliente (default)

## 🧪 Probar la API

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Hacer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Usar el token en una petición protegida

```bash
# Guarda el token recibido
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Úsalo en el header Authorization
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 📝 Notas Importantes

1. **Contraseñas seguras**: Las contraseñas se hashean con bcrypt (10 rounds)
2. **Token JWT**: Expira en 7 días por defecto (configurable)
3. **Usuarios inactivos**: Solo usuarios con `active: true` pueden autenticarse
4. **Roles**: El control de roles se basa en `rol_id` en la base de datos
5. **Swagger**: La documentación incluye `@ApiBearerAuth()` para probar con tokens

## 🔧 Ejemplo Completo: Controlador Protegido

Ver [src/barbers/barbers.controller.ts](../src/barbers/barbers.controller.ts) para un ejemplo de implementación completa con Guards y Roles.

## 📚 Recursos Adicionales

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](https://www.passportjs.org/packages/passport-jwt/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
