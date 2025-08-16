<script setup lang="ts">
import { navigateTo, useRoute } from 'nuxt/app'
import { useLibraryStore } from '../stores/library'
import { ref } from 'vue'

const route = useRoute()
const lib = useLibraryStore()

 
const id = ref((route.query.id as string) || '')

const title  = ref((route.query.title  as string) || '')
const author = ref((route.query.author as string) || '')
const year   = ref(route.query.year ? Number(route.query.year) : null)
const cover  = ref((route.query.cover as string) || '')  

const review = ref('')
const rating = ref<number|null>(null)
const coverFile = ref<File|null>(null)

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file) 
  })
}

const onSave = async () => {
  const newCoverBase64 = coverFile.value ? await toBase64(coverFile.value) : undefined

  if (id.value) {
    await lib.update(
      id.value,
      {
        review: review.value,
        rating: rating.value,
        coverBase64: newCoverBase64
      }
    )
  } else {
    const body: any = {
      title: title.value,
      author: author.value,
      year: year.value,
      review: review.value,
      rating: rating.value,
    }
    if (newCoverBase64) {
      body.coverBase64 = newCoverBase64
    } else if (cover.value) {
      body.coverUrl = cover.value
    }
    await lib.create(body)
  }

  alert('Guardado con éxito')
  await navigateTo('/library')
}
</script>

<template>
  <div class="container">
    <div class="row" style="justify-content:space-between;">
      <h2>Detalle del libro</h2>
      <NuxtLink class="btn" to="/library">Mi biblioteca</NuxtLink>
    </div>

    <div class="card">
      <div class="row" style="gap:24px;">
        <div style="width:240px">
          <img v-if="cover" :src="cover" style="width:100%;border-radius:6px;" />
          <input
            class="mt8"
            type="file"
            accept="image/*"
            @change="(e: Event) => coverFile.value = ((e.target as HTMLInputElement).files?.[0] || null)"
          />
        </div>
        <div style="flex:1;">
          <div><strong>Título:</strong> {{ title }}</div>
          <div><strong>Autor:</strong> {{ author }}</div>
          <div><strong>Año:</strong> {{ year }}</div>

          <div class="mt16">
            <label><strong>Review (máx 500)</strong></label>
            <textarea class="textarea" v-model="review" :maxlength="500" rows="5"></textarea>
          </div>

          <div class="mt8">
            <label><strong>Calificación (1–5)</strong></label>
            <select class="select" v-model.number="rating">
              <option :value="null">Sin calificar</option>
              <option v-for="r in [1,2,3,4,5]" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <button class="btn mt16" @click="onSave">
            {{ id ? 'Guardar cambios' : 'Guardar en mi biblioteca' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
