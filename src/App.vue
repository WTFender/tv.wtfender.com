<script setup>
import { saveAs } from "file-saver";
import PlaylistFetcher from './components/PlaylistFetcher.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css'

import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const raw = ref('');
const playlist = ref([]);

function downloadAll() {
  const fileToSave = new Blob([this.raw], {
        type: "text/plain",
      });
  saveAs(fileToSave, "playlist.m3u8");
}

function download(row) {
  const rex = new RegExp('(?<m3u8>#EXTINF:-1 tvg-id="' + row.id + '"(.*\n){2}.*m3u8)', "m");
  console.log(rex);
  console.log(this.raw);
  const { groups: { m3u8 } } = rex.exec(this.raw)
  console.log(m3u8);
  const fileToSave = new Blob([m3u8], {
        type: "text/plain",
      });
  saveAs(fileToSave, `${row.name}.m3u8`);
}

</script>

<template>
  <main :style="{ position: 'absolute', left: '1rem', top: '1rem' }">
    <div class="wrapper">
      <PlaylistFetcher
        @playlist="playlist = $event"
        @raw="raw = $event"
        :style="{ display: playlist.length > 0 ? 'none': 'block' }"
      />
      <DataTable
        :style="{ display: playlist.length > 0 ? 'block' : 'none' }"
        :value="playlist"
        :filters="filters"
        >
        <template #header>
          <div class="p-d-flex p-jc-between">
            <div class="p-input-icon-left">
              <InputText v-model="filters['global'].value" placeholder="Search"/>
            </div>
          </div>
        </template>
        <Column field="raw">
          <template #header="slotProps">
            <Button icon="pi pi-download" severity="success" rounded @click="downloadAll" />
          </template>
          <template #body="slotProps">
            <Button icon="pi pi-download" severity="info" rounded @click="download(slotProps.data)" :style="{
            }"/>
          </template>
        </Column>
        <Column sortable field="dt" header="Time" :style="{ 'min-width': '8rem' }">
          <template #body="slotProps">
            {{ slotProps.data.dt.toLocaleString() }}
          </template>
        </Column>
        <Column sortable field="name" header="Name" :style="{ }"></Column>
      </DataTable>
    </div>
  </main>
</template>

<style scoped>
</style>
