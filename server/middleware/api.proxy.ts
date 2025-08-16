import { defineEventHandler, proxyRequest } from 'h3'

const TARGET = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002'

export default defineEventHandler(async (event) => {
    if (event.path?.startsWith('/api/')) {
        return proxyRequest(event, TARGET + event.path)
    }
})
