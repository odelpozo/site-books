import { useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'


export type Book = {
    _id?: string
    title: string
    author?: string
    year?: number | null
    cover?: string
    coverBase64?: string
    review?: string
    rating?: number | null
}

export const useLibraryStore = defineStore('library', {
    state: () => ({ items: [] as Book[], filterQ: '', filterAuthor: '', sort: 'ratingDesc', excludeNoReview: false }),
    actions: {
        async list() {
            const { public: { apiBase } } = useRuntimeConfig()
            const r = await $fetch<Book[]>(`${apiBase}/books/my-library`, {
                query: {
                    q: this.filterQ || undefined,
                    author: this.filterAuthor || undefined,
                    excludeNoReview: this.excludeNoReview || undefined,
                    sort: this.sort || undefined
                }
            })
            this.items = r || []
        },
        async create(b: Book) {
            const { public: { apiBase } } = useRuntimeConfig()
            const r = await $fetch<Book>(`${apiBase}/books/my-library`, { method: 'POST', body: b })
            await this.list()
            return r
        },

        async update(
            id: string,
            payload: { review?: string; rating?: number | null; coverBase64?: string }
        ) {
            const apiBase = useRuntimeConfig().public.apiBase

            const updated = await $fetch<any>(`${apiBase}/books/my-library/${id}`, {
                method: 'PUT',
                body: payload
            })

            const i = Array.isArray(this.items)
                ? this.items.findIndex((b: any) => (b._id || b.id) === id)
                : -1

            if (i !== -1) {
                this.items.splice(i, 1, updated)
            }

            return updated
        },

        async remove(id: string) {
            const { public: { apiBase } } = useRuntimeConfig()
            await $fetch(`${apiBase}/books/my-library/${id}`, { method: 'DELETE' })
            await this.list()
        }
    }
})
