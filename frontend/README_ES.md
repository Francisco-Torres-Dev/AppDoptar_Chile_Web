# AppDoptar Chile - Plataforma Web Completa

Plataforma integral para adopción de mascotas, crowdfunding colaborativo, donaciones y mapa de emergencias animales en Chile.

## 🎯 Proyecto 100% Funcional

Estado actual: **FASE 1-8 COMPLETADAS** ✅

### Módulos Implementados

#### 🐾 **Adopción** (FASE 4)
- Catálogo de mascotas con filtros avanzados
- Sistema de match automático de compatibilidad
- Solicitud de adopción
- Publicación de mascotas por rescatistas

#### 💰 **Crowdfunding** (FASE 5)  
- Crear campañas de recaudación
- Seguimiento de progreso con barra dinámica
- Sistema de donaciones
- Actualizaciones de campañas

#### 🗺️ **Mapa Interactivo** (FASE 7) ✨
- Mapa OpenStreetMap con Leaflet
- Marcadores de reportes por tipo (herido, abandonado, perdido, etc.)
- Sistema de urgencias con opacidad visual
- Filtros de reportes por tipo
- Popup detallado por reporte

#### 🏥 **Fundaciones** (FASE 8)
- Directorio de fundaciones
- Perfiles con información de contacto
- Redes sociales

#### 🔐 **Autenticación** (FASE 3)
- Login/Register con validación
- 2FA mock
- Google OAuth preparado
- Roles (USER, RESCUER, FOUNDATION, ADMIN)

#### 👤 **Usuario** 
- Dashboard personal
- Notificaciones
- Favoritos (mascotas y campañas)
- Histórico

#### ⚙️ **Admin** (FASE 9)
- Panel de administración básico
- Estadísticas generales

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 📦 Tech Stack

```
Frontend
├── React 19.2.8
├── TypeScript 6.0.2
├── Vite 8.2.2
├── React Router 7.18.2
├── Bootstrap 5.3.8
├── Leaflet 1.9.4 + React-Leaflet 5.0.0
├── Axios 1.20.0
└── Bootstrap Icons

Data & State
├── Context API (AuthContext, ToastContext)
├── localStorage (Mock API)
└── Types definidos en TypeScript
```

## 📊 Estadísticas

- **Rutas configuradas**: 24 públicas + admin
- **Páginas componentes**: 20
- **Servicios**: 12 (auth, pet, campaign, donation, etc.)
- **Tipos TypeScript**: 15+
- **Bundle**: 553KB (gzip 163KB con Leaflet)
- **Módulos Vite**: 178
- **Compilación**: ✅ 0 errores

## 🏗️ Estructura

```
frontend/src/
├── components/          # Componentes reutilizables (cards, layout, common)
├── pages/              # Páginas por módulo (adoption, auth, crowdfunding, etc.)
├── services/           # Servicios (API client, mock store, lógica de negocio)
├── contexts/           # React Context (Auth, Toast)
├── hooks/              # Custom hooks (useDebounce, useFavorite, useNotifications)
├── types/              # Interfaces TypeScript
├── utils/              # Helpers, validación, constantes
├── layouts/            # MainLayout
├── routes/             # ProtectedRoute
└── App.tsx             # Router principal
```

## 🔄 Flujo de Datos

```
UI Component
    ↓
useAuth() / useToast() hooks
    ↓
Services (petService, campaignService, etc.)
    ↓
apiClient (con USE_MOCK flag)
    ↓
Mock Store (localStorage) o API real
```

## 🔐 Autenticación

El sistema mock permite:
- Registrarse con cualquier email
- Contraseña debe tener: mayúscula, minúscula, número, símbolo
- 2FA genera código mock
- JWT tokens simulados
- Persistencia en localStorage

## 🗺️ Mapa Interactivo (Leaflet)

- **Base**: OpenStreetMap tiles (sin API key)
- **Marcadores**: Emojis coloreados por tipo
- **Urgencia**: Opacidad visual (bajo → crítico)
- **Interactividad**: Zoom, pan, popups, filtros

Colores:
- 🔴 Rojo: Herido/Atrapado
- 🟠 Naranja: Abandonado
- 🔵 Azul: Perdido
- 🟡 Amarillo: Hambriento
- 🟣 Morado: Maltratado
- 🟢 Verde: Encontrado

## 🎨 Diseño

- **Framework**: Bootstrap 5.3.8
- **Iconos**: Bootstrap Icons
- **Responsive**: Mobile-first
- **Colores**: Verde (principal), Azul (secundario)
- **Efectos**: Hover, transiciones suaves

## ✨ Características Destacadas

1. **Match System** - Algoritmo de compatibilidad para adopciones
2. **Mock API** - Sistema completo de mock data con localStorage
3. **Role-based Access** - Protección de rutas por roles
4. **Real-time Stats** - Dashboard con estadísticas dinámicas
5. **Interactive Map** - Leaflet con reportes geolocalizados
6. **Form Validation** - Validación completa en frontend
7. **Error Handling** - Toast notifications con errores
8. **Type Safety** - TypeScript strict mode
9. **Accessible** - Componentes ARIA compliant

## 📝 Variables de Entorno

No requiere variables de entorno para el modo mock. Para producción:

```env
VITE_API_URL=https://api.example.com
VITE_MAP_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_GOOGLE_CLIENT_ID=your_client_id
```

## 🔗 Rutas Principales

### Públicas
- `/` - Inicio
- `/adopciones` - Adoptar mascotas
- `/mascotas/:id` - Detalle mascota
- `/match` - Match de compatibilidad
- `/crowdfunding` - Campañas
- `/crowdfunding/:id` - Detalle campaña
- `/donaciones` - Donar
- `/mapa` - Mapa de reportes
- `/fundaciones` - Directorio fundaciones

### Autenticación (Guest only)
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta
- `/forgot-password` - Recuperar contraseña

### Protegidas (LOGIN REQUIRED)
- `/dashboard` - Mi panel
- `/publicar-mascota` - Publicar mascota
- `/crear-campana` - Crear campaña
- `/reportar` - Crear reporte emergencia
- `/notificaciones` - Notificaciones
- `/favoritos` - Mis favoritos

### Admin (ROLE: ADMIN)
- `/admin` - Panel administrativo

## 🧪 Testing

Build de producción:
```bash
npm run build
```

El build genera:
- `dist/index.html` - Punto de entrada
- `dist/assets/*.css` - Estilos
- `dist/assets/*.js` - JavaScript

## 📚 Componentes Principales

### Cards
- `PetCard` - Tarjeta de mascota
- `CampaignCard` - Tarjeta de campaña
- `ReportCard` - Tarjeta de reporte

### Layout
- `MainLayout` - Wrapper principal
- `Navbar` - Navegación
- `Footer` - Pie de página

### Common
- `Breadcrumbs` - Migas de pan
- `LoadingSpinner` - Cargando
- `ToastContainer` - Notificaciones
- `ErrorBoundary` - Manejo de errores
- `ShareButtons` - Compartir

## 🔄 Servicios Disponibles

```typescript
authService         // Autenticación y login
petService          // Gestión de mascotas
adoptionService     // Solicitudes de adopción
campaignService     // Campañas de crowdfunding
donationService     // Donaciones
reportService       // Reportes de emergencias
foundationService   // Fundaciones
userService         // Perfil y datos de usuario
notificationService // Notificaciones
adminService        // Operaciones admin
mapService          // Geolocalización
paymentService      // Pagos (stub)
```

## 🌐 Mock Data

El sistema incluye datos de demostración:
- **6 mascotas** en adopción
- **4 campañas** activas
- **2 fundaciones** registradas
- **4 reportes** de emergencias
- Sistema de usuarios completo

## 🚢 Deployment

Listo para deploy en:
- Vercel (recomendado para Vite)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

```bash
npm run build
# El contenido de 'dist' es listo para servir
```

## 📄 Licencia

Proyecto académico - AppDoptar Chile 2026

## 👨‍💻 Desarrollo

- **Última actualización**: 2026-08-26
- **Estado**: Production-ready (frontend)
- **Próximo paso**: Backend API + Database

---

Para más información, consulta `STATUS.md`
