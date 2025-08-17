<script setup lang="ts">
import { navigateTo, useRoute } from 'nuxt/app'
import { useLibraryStore } from '../stores/library'
import { ref, onBeforeUnmount, computed } from 'vue'

const route = useRoute()
const lib = useLibraryStore()

// Datos de la búsqueda
const title  = ref((route.query.title  as string) || '')
const author = ref((route.query.author as string) || '')
const year   = ref(route.query.year ? Number(route.query.year) : null)
const cover  = ref((route.query.cover  as string) || '')   

// Form y portada
const review = ref('')
const rating = ref<number | null>(null)

// FILE INPUT + PREVIEW
const coverEl = ref<HTMLInputElement|null>(null)
const coverPreview = ref<string>('') // URL temporal para preview
const imgSrc = computed(() => coverPreview.value || cover.value || '')

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

const onFileChange = () => {
  const f = coverEl.value?.files?.[0] || null
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = f ? URL.createObjectURL(f) : ''
}

const onSave = async () => {
  const body: any = {
    title: title.value,
    author: author.value,
    year: year.value,
    review: review.value,
    rating: rating.value
  }

 
  const f = coverEl.value?.files?.[0] || null
  if (f) {
    body.coverBase64 = await toBase64(f)
  }else if (cover.value) {
    body.coverUrl = cover.value
  }

  await lib.create(body)
  alert('Guardado con éxito')
  await navigateTo('/library')
}

onBeforeUnmount(() => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
})
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
          <img
            v-if="imgSrc"
            :src="imgSrc"
            :key="imgSrc"
            style="width:100%;border-radius:6px;"
          />
          <input
            ref="coverEl"
            class="mt8"
            type="file"
            accept="image/*"
            @change="onFileChange"
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

          <button class="btn mt16" @click="onSave">Guardar en mi biblioteca</button>
        </div>
      </div>
    </div>
  </div>
</template>
