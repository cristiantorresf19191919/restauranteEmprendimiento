<template>
    <Map @location-changed="handleLocationChanged"/> 
    <Toast />
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
            <RegisterInfo :formValues="state" :selectedPlan="selectedPlan" />
            <div class="field col-12">
                <Knob v-model="completed" :showValue="true" readonly />
            </div>
        </form>
    </div>
</template>

<script setup>
import { register } from '@/utils/request';
import { computed } from '@vue/reactivity';
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { ref, reactive, onMounted } from 'vue';
import RegisterInfo from './RegisterInfo'
import Map from './Map.vue'

const toast = useToast();
const submitted = ref(false);
const selectedPlan = ref();
const selectedLocation = ref();
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

const mustBeEqual = () => state.password === state.password2

const rules = {
    name: { required },
    email: { required, email },
    phone: { required },
    password: { required },
    password2: { required, mustBeEqual }
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

const handleMapResult = (result) => {
    console.log("🚀 ~ file: Register.vue ~ line 194 ~ handleMapResult ~ result", result)
}

const formatCoordenatesString = (str = []) => {
    return str.map(x => String(x).trim()).join(",").trim()
}

const sendFormData = async () => {
    try {
        const { password2, ...formData } = state;
        const res = await register({ ...formData, selectedPlan: selectedPlan.value, selectedLocation: formatCoordenatesString(selectedLocation.value)})
        console.log("🚀 ~ file: Register.vue ~ line 182 ~ sendFormData ~ res", res)
        p(res.status)
        p(res.response)
        if (res.request.status !== 201) {
            return toast.add({ severity: 'error', summary: 'Error', detail: res.response.data.message, life: 3000 });
        }
        resetForm()
        return toast.add({ severity: 'success', summary: 'Excelent', detail: 'La cuenta se ha creado con exito', life: 3000 });
    } catch (error) {
        console.log("🚀 ~ file: Register.vue ~ line 67 ~ sendFormData ~ error", error)
    }
}

const handleLocationChanged = (locationChanged) => selectedLocation.value = locationChanged;


</script>

<style scoped lang="scss">
.item-center {
    margin: 0 auto;
}

.btn-cta-register {
    display: flex;
    justify-content: center;
}

</style>
