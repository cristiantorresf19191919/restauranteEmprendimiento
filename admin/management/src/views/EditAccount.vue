<template>
    <Map @location-changed="handleLocationChanged" :location="currentLocation" :name="state.name"/> 
    <Toast />
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
                <span id="email-error" v-for="(error, index) of v$.email.$errors" :key="index">
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
                <span id="email-error" v-for="(error, index) of v$.password2.$errors" :key="index">
                    <small class="p-error">La contraseña no coincide</small>
                </span>
            </span>
        </div>
        <div class="field col-12 md:col-4">
            <span class="p-float-label">
                <InputMask mask="999 999 9999" v-model="state.phone" placeholder="Telefono" />
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
</template>

<script setup>

import { ref, reactive, onMounted, watch } from 'vue';
import { fetchById, updateRequest } from "@/utils/request"
import { computed } from '@vue/reactivity';
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import Map from "@/components/Map.vue"

const props = defineProps(['id'])
const account = ref()
const toast = useToast();
const submitted = ref(false);
const selectedPlan = ref();
const selectedLocation = ref();
const currentLocation = ref()

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
const arrayCoordenates = (coordStr = "") =>  coordStr.trim().split(',').map(o => parseFloat(o.trim()));
//" -74.11928214843881, 4.659117705413166"
// [-74.545,4.645545]
onMounted(async () => {
    const response = await fetchById('accounts', props.id);
    account.value = response.data
    state.name = response.data.name;
    state.email = response.data.email;
    state.phone = response.data.phone;
    selectedPlan.value = response.data.selectedPlan;
    currentLocation.value = arrayCoordenates(response.data.selectedLocation);
    selectedLocation.value = arrayCoordenates(response.data.selectedLocation)
})
const mustBeEqual = () => state.password === state.password2

const rules = {
    name: { required },
    email: { required, email },
    phone: { required },
    password: {},
    password2: {  }
};
const completed = computed(() => {
    const inputList = Object.values(state);
    inputList.push(selectedPlan.value);
    inputList.push(selectedLocation.value);
    const completedInputs = inputList.map(x => x ? 1 : 0).reduce((ac, cv) => ac + cv, 0);
    console.log("🚀 ~ file: Register.vue ~ line 48 ~ completed ~ average", completedInputs)
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
    sendFormData();
}

const formatCoordenatesString = (str) => {
    const res  = str.join(",");
    return res;
}

const sendFormData = async () => {
    try {
        console.log("location > 😉 ",selectedLocation.value)
        const { password2, ...formData } = state;
        if (!formData.password) {
            delete formData.password
        }
        const body = { ...formData, 
            selectedPlan: selectedPlan.value,
            selectedLocation: formatCoordenatesString(selectedLocation.value) }
     
        const res = await updateRequest('accounts', props.id, { ...body })
        console.log("🚀 ~ file: update.vue ~ line 182 ~ sendFormData ~ res", res)   
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


</script>

<style lang="scss" scoped>
</style>
