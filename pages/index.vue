<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSearchStore } from '../stores/search'


const s = useSearchStore()
const q = ref('')
onMounted(() => s.fetchLast())
const doSearch = () => s.search(q.value.trim())

</script>

<template>
  <div class="container">
    <div class="card" style="text-align:center; padding:24px;">
      <input class="input" v-model="q" placeholder="Escribe el nombre de un Libro para continuar" @keyup.enter="doSearch" />
      <div class="mt8"><button class="btn" @click="doSearch">Buscar</button></div>
      <div class="mt16" v-if="s.last.length">
        <strong>Últimas búsquedas:</strong>
        <div class="row" style="flex-wrap:wrap;">
          <button class="btn" v-for="(t,i) in s.last" :key="i" @click="q=t; doSearch()">{{ t }}</button>
        </div>
      </div>
    </div>

    <div class="mt16" v-if="s.results.length">
      <div class="grid">
        <div class="card" v-for="(b,i) in s.results" :key="i">
          <div><img v-if="b.cover" :src="b.cover" style="width:100%;height:220px;object-fit:cover;border-radius:6px" /></div>
          <div class="mt8"><strong>{{ b.title }}</strong></div>
          <div>{{ b.author }} <span v-if="b.year">({{ b.year }})</span></div>
          <NuxtLink class="btn mt8" :to="{ path: '/book', query: { title: b.title, author: b.author, year: b.year, cover: b.cover } }">Seleccionar</NuxtLink>
        </div>
      </div>
    </div>

    <div v-else-if="s.q && !s.results.length" class="mt16">no encontramos libros con el título ingresado</div>

    <div class="mt16">
      <NuxtLink class="btn" to="/library" style="float:right;">Mi biblioteca</NuxtLink>
      <div style="clear:both;"></div>
    </div>
  </div>
</template>
