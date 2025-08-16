import { useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
    state: () => ({ last: [] as string[], results: [] as any[], q: '' }),
    actions: {
        async fetchLast() {
            const { public: { apiBase } } = useRuntimeConfig()
            const r = await $fetch<{ searches: string[] }>(`${apiBase}/books/last-search`)
            this.last = r.searches || []
        },
        async search(q: string) {
            const { public: { apiBase } } = useRuntimeConfig()
            this.q = q
            const r = await $fetch<{ items: any[] }>(`${apiBase}/books/search`, { query: { q } })
            this.results = r.items || []
        }
    }
})
