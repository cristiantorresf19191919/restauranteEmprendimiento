<template>
    <h1>Ver Cuentas</h1>
    <Dialog
        position="top"
        v-model:visible="display"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '50vw' }"
    >
        <template #header>Mapa del restaurante</template>
        <ShowCurrentMap :coordenates="coordenates" />
    </Dialog>
    <DataTable :value="accountsList">
        <Column field="name" header="Nombre"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="phone" header="Telefono"></Column>
        <Column field="selectedPlan" header="Plan"></Column>
        <Column field="selectedLocation" header="Ubicacion">
            <template #body="slotProps">
                <div class="pl-4">
                    <i
                        class="pi pi-map-marker map-icon"
                        @click="toggleDialog(slotProps.data.selectedLocation)"
                        style="font-size: 2rem"
                    ></i>
                </div>
            </template>
        </Column>
        <Column header="actions">
            <template #body="slotProps">
                <div class="grid actions">
                    <i
                        class="pi pi-pencil edit-icon"
                        @click="redirectEditAccount(slotProps.data._id)"
                        style="font-size: 2rem"
                    ></i>
                    <i class="pi pi-minus-circle delete-icon" style="font-size: 2rem"></i>
                </div>
            </template>
        </Column>
    </DataTable>
</template> 

<script setup>
import { fetchAll } from '@/utils/request';
import { onMounted, reactive, ref } from 'vue';
import ShowCurrentMap from "@/components/ShowCurrentMap.vue"

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const display = ref(false)
const coordenates = ref("");
const accountsList = ref();

onMounted(async () => {
    const res = await fetchAll('accounts');
    accountsList.value = res.data;
})

const toggleDialog = (cord) => {
    display.value = !display.value;
    coordenates.value = cord
}

const redirectEditAccount = (id) => {
    router.push({
        name: 'Edit Account',
        params: {
            id
        }
    })

}



</script>
<style lang="scss">
.actions {
    gap: 1rem;
}
.edit-icon {
    color: #42b983;
    cursor: pointer;
}
.delete-icon {
    color: red;
    cursor: pointer;
}
.map-icon {
    color: 1784b1;
    cursor: pointer;
}
</style>
