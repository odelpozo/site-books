// server/middleware/api-proxy.ts
import { defineEventHandler, proxyRequest } from 'h3'

const TARGET = 'http://localhost:3002' // backend local

export default defineEventHandler(async (event) => {
    // Solo intercepta rutas que empiezan con /api/
    if (event.path?.startsWith('/api/')) {
        // Reenvía la request tal cual al backend (método, headers, body)
        return proxyRequest(event, TARGET + event.path)
    }
})
