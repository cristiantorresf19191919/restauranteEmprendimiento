<template>
    <Toast />
    <h2>Editar Restaurante</h2>
    <div class="register-component">
        <MapAsync
            @location-changed="handleLocationChanged"
            :location="selectedLocation"
            :IsFormEditing="completed"
            :name="state.name"
        />

        <div class="card">
            <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid grid">
                <div class="field col-12 md:col-4">
                    <span class="p-float-label p-input-icon-right">
                        <i class="pi pi-users" />
                        <InputText
                            id="inputtext-right"
                            type="text"
                            v-model="v$.name.$model"
                            :class="{ 'p-invalid': v$.name.$invalid && submitted }"
                        />
                        <label for="inputtext-right">Nombre Restaurante</label>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label p-input-icon-right">
                        <!-- pi-send -->
                        <i class="pi pi-envelope" />
                        <InputText
                            id="inputtext"
                            type="text"
                            v-model="v$.email.$model"
                            :class="{ 'p-invalid': v$.email.$invalid && submitted }"
                        />
                        <label for="inputtext">email</label>
                    </span>
                    <span v-if="v$.email.$error && submitted">
                        <span
                            id="email-error"
                            v-for="(error, index) of v$.email.$errors"
                            :key="index"
                        >
                            <small class="p-error">El email no es valido</small>
                        </span>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <Password
                            v-model="v$.password.$model"
                            :class="{ 'p-invalid': v$.password.$invalid && submitted }"
                            toggleMask
                        />
                        <label for="inputtext">password</label>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <Password
                            v-model="v$.password2.$model"
                            :class="{ 'p-invalid': v$.password2.$invalid && submitted }"
                            toggleMask
                        />
                        <label for="inputtext">Confirma Contraseña</label>
                    </span>
                    <span v-if="v$.password2.$error && submitted">
                        <span
                            id="email-error"
                            v-for="(error, index) of v$.password2.$errors"
                            :key="index"
                        >
                            <small class="p-error">La contraseña no coincide</small>
                        </span>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <InputMask
                            mask="999 999 9999"
                            v-model="state.phone"
                            placeholder="Telefono"
                        />
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <Dropdown
                            v-model="selectedPlan"
                            :options="planList"
                            optionLabel="name"
                            optionValue="name"
                            placeholder="Selecciona un Plan"
                        />
                    </span>
                </div>
                <div class="field col-12">
                    <span class="p-float-label">
                        <h5>Sube tu foto de portada</h5>
                        <FileUpload
                            name="restaurantImages[]"
                            @select="onImageSelected"
                            @remove="onImageRemoved"
                            :multiple="false"
                            chooseLabel="Editar"
                            :showCancelButton="false"
                            :showUploadButton="false"
                            :previewWidth="200"
                            accept="image/*"
                            :maxFileSize="10000000"
                        >
                            <template #empty>
                                <div v-if="imageFileSeleceted" class="p-fileupload-files">
                                    <div class="p-fileupload-row" style="width:16rem;margin:0 auto;">
                                        <div class="image-container">
                                            <img :src="imageFileSeleceted" role="presentation" :alt="imageFileSeleceted.name">
                                        </div>                                    
                                    </div>
                                    <!-- <img :src="imageFileSeleceted" alt="foto" /> -->
                                </div>
                                <div v-else>
                                    <p>Arrastra y suelta los archivos aca para guardar.</p>
                                </div>
                            </template>
                        </FileUpload>
                    </span>
                </div>
                <div class="field col-12 btn-cta-register" v-if="completed >= 71">
                    <span class="p-float-label" style="width: 20rem;">
                        <Button
                            type="submit"
                            label="Enviar"
                            class="p-button-raised p-button-primary p-button-text"
                        />
                    </span>
                </div>
                <div class="field col-12">
                    <Knob v-model="completed" :showValue="true" readonly />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

import { ref, reactive, onMounted, watch, provide, defineAsyncComponent } from 'vue';
import { fetchById, updateRequest } from "@/utils/request"
import { computed } from '@vue/reactivity';
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from 'vue-router'
import Map from "@/components/Map.vue"
import axios from 'axios';


const props = defineProps(['id'])
const account = ref()
const toast = useToast();
const submitted = ref(false);
const selectedPlan = ref();
const selectedLocation = ref();
const currentLocation = ref();
const router = useRouter()

currentLocation.value = [-74.00400424469672, 5.0265836334697696]
const imageFileSeleceted = ref();



const planList = ref([
    { name: 'Bronce' },
    { name: 'Plata' },
    { name: 'Oro' },
    { name: 'Platino' },
]);

const state = reactive({
    name: '',
    email: '',
    password: '',
    password2: '',
    phone: ''
});

const MapAsync = defineAsyncComponent({
    loader: async () => {
        await setStates();
        return import("@/components/Map.vue");
    },
    loadingComponent: ProgressSpinner,
    errorComponent: ProgressSpinner,
    delay: 200,
    timeout: 3000
})
async function setStates() {
    const response = await fetchById('restaurants', props.id);
    const { name, email, phone } = response.data;
    state.name = name;
    state.email = email;
    state.phone = phone;
    selectedPlan.value = response.data.selectedPlan;
    currentLocation.value = response.data.selectedLocation;
    selectedLocation.value = response.data.selectedLocation;
    imageFileSeleceted.value = response.data.image.url;

}
// onMounted(async () => setStates())
const mustBeEqual = () => state.password === state.password2

const onImageSelected = (event, event2) => {
    if (!Array.isArray(event.files)) return
    imageFileSeleceted.value = event.files[0]
}

const onImageRemoved = (event) => {
    imageFileSeleceted.value = "";
}

const rules = {
    name: { required },
    email: { required, email },
    phone: { required },
    password: {},
    password2: {}
};

const completed = computed(() => {
    const inputList = Object.values(state);
    inputList.push(selectedPlan.value);
    inputList.push(selectedLocation.value);
    inputList.push(imageFileSeleceted.value);
    const completedInputs = inputList.map(x => x ? 1 : 0).reduce((ac, cv) => ac + cv, 0);
    const singleStep = 100 / inputList.length;
    return Math.trunc(singleStep * completedInputs)
})

const resetForm = () => {
    state.name = '';
    state.email = '';
    state.password = '';
    state.password2 = '';
    state.phone = '';
    submitted.value = false;
    selectedPlan.value = false;
    selectedLocation.value = false;
}

const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid) => {
    submitted.value = true;
    if (!isFormValid) {
        return;
    }
    sendFormData().then(x => router.push({ name: 'see Accounts' }));
}

const formatCoordenatesString = (str) => {
    console.log("🚀 ~ file: EditAccount.vue ~ line 236 ~ formatCoordenatesString ~ str", str)
    const res = str?.join(",");
    return res;
}

const sendFormData = async () => {
    try {
        console.log("location > 😉 ", selectedLocation.value)
        const { password2, ...formData } = state;
        if (!formData.password) {
            delete formData.password
        }
        //formData = {name,phone,email}
        const body = {
            ...formData,
            selectedPlan: selectedPlan.value,
            selectedLocation: JSON.stringify(selectedLocation.value)
        }
        const formDataInstance = new FormData();

        formDataInstance.append('image', imageFileSeleceted.value, imageFileSeleceted.value.name)

        for (let key in body) {
            formDataInstance.append(key, body[key])
        }

        const id = props.id;

        const url = process.env.VUE_APP_URL;

        const res = await axios({
            method: "put",
            url: `${url}/accounts/${id}`,
            data: formDataInstance,
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("🚀 ~ file: EditAccount.vue ~ line 270 ~ sendFormData ~ res", res)
        if (res.request.status !== 200) {
            return toast.add({ severity: 'error', summary: 'Error', detail: res.response.data.message, life: 3000 });
        }
        return toast.add({ severity: 'success', summary: 'Excelent', detail: 'La cuenta se ha actualizado con exito', life: 3000 });
    } catch (error) {
        console.log("🚀 ~ file: Register.vue ~ line 67 ~ sendFormData ~ error", error)
    }
}

const handleLocationChanged = (locationChanged) => {
    selectedLocation.value = locationChanged
    currentLocation.value = locationChanged
};

provide('location', selectedLocation.value)
provide('IsFormEditing', completed.value)
provide('name', state.name)


</script>

<style lang="scss" scoped>
.register-component {
    display: flex;
    gap: 1rem;
    .card {
        flex: 1;
    }
}

.image-container {
    width: 6rem;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    img {
        width: 100%;
        object-fit: cover;
    }
}
</style>
