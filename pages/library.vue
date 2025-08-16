<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLibraryStore, type Book } from '../stores/library' // usa alias ~
import { useRuntimeConfig } from 'nuxt/app'

const lib = useLibraryStore()
onMounted(() => lib.list())

const editReview = ref('')
const editRating = ref<number|null>(null)
const editing = ref<Book|null>(null)

const doFilter = () => lib.list()
const startEdit = (b: Book) => {
  editing.value = b
  editReview.value = b.review || ''
  editRating.value = b.rating ?? null
}
const saveEdit = async () => {
  if (!editing.value?._id) return
  await lib.update(editing.value._id, { review: editReview.value, rating: editRating.value })
  editing.value = null
}
const del = async (b: Book) => {
  if (b._id && confirm('¿Eliminar permanentemente?')) await lib.remove(b._id)
}

const { public: { apiBase } } = useRuntimeConfig()
const coverUrl = (id: string) => `${apiBase}/books/library/front-cover/${id}`

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img) img.style.display = 'none'
}
</script>

<template>
  <div class="container">
    <div class="row" style="justify-content:space-between;">
      <h2>Mi biblioteca</h2>
      <NuxtLink class="btn" to="/">Buscar libros</NuxtLink>
    </div>

    <div class="card">
      <div class="row">
        <input class="input" v-model="lib.filterQ" placeholder="Filtrar por título" />
        <input class="input" v-model="lib.filterAuthor" placeholder="Filtrar por autor" />
        <select class="select" v-model="lib.sort">
          <option value="ratingDesc">Rating desc</option>
          <option value="ratingAsc">Rating asc</option>
        </select>
        <label class="row"><input type="checkbox" v-model="lib.excludeNoReview"> Excluir sin review</label>
        <button class="btn" @click="doFilter">Aplicar</button>
      </div>
    </div>

    <div class="grid mt16">
      <div class="card" v-for="b in lib.items" :key="b._id">
        <img
          :src="coverUrl(b._id as string)"
          @error="onImgError"
          style="width:100%; height:180px; object-fit:cover; border-radius:6px"
        />
        <div class="mt8"><strong>{{ b.title }}</strong></div>
        <div>{{ b.author }} <span v-if="b.year">({{ b.year }})</span></div>
        <div class="mt8">⭐ {{ b.rating ?? '—' }}</div>
        <div class="row mt8">
          <button class="btn" @click="startEdit(b)">Editar</button>
          <button class="btn" @click="del(b)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal simple -->
    <div v-if="editing" style="position:fixed; inset:0; background:#0006; display:flex; align-items:center; justify-content:center;">
      <div class="card" style="width:520px; background:#fff;">
        <h3>Editar</h3>
        <label>Review</label>
        <textarea class="textarea" v-model="editReview" :maxlength="500" rows="5"></textarea>
        <label class="mt8">Rating</label>
        <select class="select" v-model.number="editRating">
          <option :value="null">Sin calificar</option>
          <option v-for="r in [1,2,3,4,5]" :key="r" :value="r">{{ r }}</option>
        </select>
        <div class="row mt16" style="justify-content:flex-end;">
          <button class="btn" @click="editing=null">Cancelar</button>
          <button class="btn" @click="saveEdit">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>
