# 📚 Books Web — Frontend (Nuxt 3 + Pinia)

Aplicación web para **buscar** libros, **ver detalle**, **guardar** en tu biblioteca (con review/rating y portada opcional), **listar/filtrar/ordenar**, **editar** y **eliminar**.

---

## 🚀 Tecnologías
- **Nuxt 3.12**
- **Vue 3**
- **Pinia 2**
- **Sass**

---

## 🔧 Requisitos
- Node 18+
- API del backend accesible por HTTP(S)

### Variables de entorno
Crea `.env.local` en el front:
```
NUXT_PUBLIC_API_BASE=http://localhost:3002/api
```
En producción (Vercel):  
`NUXT_PUBLIC_API_BASE=https://books-api.up.railway.app/api`

---

## ▶️ Scripts
```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start   # producción local
```

---

## ⚙️ Configuración esencial

`nuxt.config.ts`
```ts
/// <reference types="node" />
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  builder: 'vite',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3002/api'
    }
  },
  css: ['~/assets/styles/main.scss'],
  nitro: { compatibilityDate: '2025-08-15' }
})
```

Estructura mínima:
```
assets/styles/main.scss
pages/index.vue          # búsqueda + resultados + últimas búsquedas
pages/book.vue           # detalle + review/rating + subida de portada
pages/library.vue        # biblioteca + filtros + orden + editar/eliminar
stores/search.ts         # llamadas a /books/search y /books/last-search
stores/library.ts        # CRUD biblioteca y helpers
```

---

## 🔄 Flujo funcional
1) Buscar en `/` (usa OpenLibrary).  
2) Seleccionar un resultado → `/book?title=...&author=...&year=...&cover=...`.  
3) Completar review/rating y (opcional) subir portada → Guardar.  
4) Ver en `/library` y probar filtros, orden, editar, eliminar.

> La portada en la lista se sirve desde `GET /api/books/library/front-cover/:id`.  
> Si no existe, el `<img @error>` la oculta.

---

## 🧩 Detalles clave
- **Construcción de URL de portada propia**:
  ```ts
  const { public: { apiBase } } = useRuntimeConfig()
  const coverUrl = (id: string) => `${apiBase}/books/library/front-cover/${id}`
  ```
- **Manejo de error de imagen**:
  ```ts
  const onImgError = (e: Event) => {
    const img = e.target as HTMLImageElement | null
    if (img) img.style.display = 'none'
  }
  ```
- **Subir portada (data URL)**:
  ```ts
  function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(file)
    })
  }
  // en onSave: if (file) body.coverBase64 = await toBase64(file)
  ```

---

## ☁️ Despliegue (Vercel recomendado)
1. Importa el repo en Vercel.
2. Variables de entorno (Production/Preview):
   - `NUXT_PUBLIC_API_BASE=https://books-api.up.railway.app/api`
3. Deploy. Abre la URL pública y prueba el flujo completo.

---

## 🛠️ Troubleshooting
- Node < 18 → errores de Vite/kit/oxc. Usa Node 18+.
- `process` no definido → `npm i -D @types/node` y `nuxi prepare`.
- 404 en `/book` → archivo exacto `pages/book.vue`; reinicia dev server si recién lo creaste.
- CORS → ajusta `origin` en el gateway del backend.
- Imagen no se guarda → revisa Payload del POST (debe incluir `coverBase64`) y el `bodyParsers.limit` en el backend.

---

## ✅ Checklist de entrega
- [ ] Buscar → Seleccionar → Guardar → Ver en biblioteca
- [ ] Filtros/orden en `/library`
- [ ] Editar/Eliminar
- [ ] README de front/back con variables y cURL
- [ ] (Opcional) Capturas del flujo
