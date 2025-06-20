# 🕹️ Time Right API

## 🔭 Descripción General

**Time Right** es una API RESTful construida con Node.js, TypeScript, Express y TypeORM + SQLite, que permite a los usuarios competir para detener un temporizador lo más cerca posible de **10 segundos**. Un sistema de estadísticas mantenido con una tabla `UserStats` clasifica a los usuarios según su desempeño, y la funcionalidad de **Leaderboard en tiempo real** (WebSocket/SSE) permite ver el ranking actualizado al instante.

---

## 🧠 Arquitectura & Tech Stack

- **Backend**: Node.js, TypeScript, Express.
- **Base de datos**: SQLite (TypeORM).
- **Autenticación**: JWT (`jsonwebtoken` + `bcrypt`).
- **Testing**:
  - Unit tests: Jest.
  - Integration: Postman.
  - Postman Collection.
- **Despliegue**: CI/CD con GitHub Actions → Render.
- **WebSocket**: Transmisión en tiempo real del leaderboard.

---

## ⚙️ Endpoints Principales

| Método     | Ruta                             | Descripción                                        |
|------------|----------------------------------|------------------------------------------------------|
| POST       | `/api/v1/users`                  | Registro de usuarios                                |
| POST       | `/api/v1/auth/login`             | Inicio de sesión                                    |
| POST       | `/api/v1/games/:userId/start`    | Inicia sesión de juego (devuelve sessionToken)      |
| POST       | `/api/v1/games/:userId/stop`     | Detiene sesión y calcula desviación                 |
| GET        | `/api/v1/leaderboard`            | Top 10 usuarios ordenados por precisión             |
| WS         | `/` (WebSocket)                  | Envía leaderboard actualizado en tiempo real        |

---

## 📘 Documentación Swagger

Puedes acceder a la documentación Swagger desde:

```
GET /api/v1/docs
```

URL en local:
```
http://localhost:3000/api/v1/docs
```

URL en produccion:
```
https://time-right-api.onrender.com/api/v1/docs
```

---

## 🧪 Pruebas Unitarias (Jest)

- Casos cubiertos:
  - Registro de usuarios (success, duplicado)
  - Login (success, fallo por credenciales)
  - Inicio y detención del juego (success, error por token/session)
  - Leaderboard

### Ejecución:
```bash
npm run test
```

---

## 🧪 Pruebas Automatizadas (Postman)

- Se incluye una colección `TimeRight.postman_collection.json` y entorno `TimeRight.postman_environment.json`.
- Casos cubiertos:
  - Registro de usuarios (success, duplicado)
  - Login (success, fallo por credenciales)
  - Inicio y detención del juego (success, error por token/session)
  - Leaderboard

### Ejecución:
```bash
newman run time-right-api.postman_collection.json -e time-right-api.postman_environment.json
```

---

## 🛠️ Instalación y Setup

1. Clona el repositorio.
```bash
git clone git@github.com:vickpalomo/time-right-api.git
```

2. Instala dependencias:
```bash
npm install
```

3. Renombra `.env.example` a `.env`:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1h
```
4. Corre el servidor en desarrollo:
```bash
npm run dev
```

---

## 🚀 CI/CD y Deploy

- GitHub Actions:
  - Build, test y despliegue automático a Render en cada `push` a `master`.
- Secretos:
  - `RENDER_API_KEY` en GitHub.
  - `JWT_SECRET` en Render.
- Link de Render
  - https://time-right-api.onrender.com
---

## 🌐 Leaderboard en Tiempo Real

WebSocket habilitado para mostrar el leaderboard actualizado sin recargar:

```ts
const ws = new WebSocket('wss://time-right-api.onrender.com');
ws.onmessage = ({ data }) => console.log(JSON.parse(data));
```

Cuando un jugador detiene el timer, el leaderboard se actualiza y se retransmite:

```ts
broadcastLeaderboardUpdate(await leaderboardService.getTopPlayers());
```

---

## 🧠 Conclusión

Este proyecto refleja las buenas prácticas de un backend senior:

- ✅ Arquitectura modular o por caracteristicas con controller, service, repository
- ✅ JWT seguro
- ✅ Testing unitario + integración
- ✅ CI/CD
- ✅ SSE/WebSocket en tiempo real
- ✅ Documentación Swagger y pruebas en Postman