import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/md-light-indigo/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Password from 'primevue/password';
import InputMask from 'primevue/inputmask';
import Knob from 'primevue/knob';
import Card from 'primevue/card';
import Ripple from 'primevue/ripple';
import Dropdown from 'primevue/dropdown';
import VueMapboxTs from "vue-mapbox-ts";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';                     //optional for row
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';


const app = createApp(App)
app.use(router).use(PrimeVue,{ripple:true})
app.use(ToastService)
app.use(VueMapboxTs)
app.component('FileUpload',FileUpload)
app.component('Ripple',Ripple)
app.component('InputText',InputText)
app.component('Button',Button)
app.component('Toast',Toast)
app.component('Password',Password)
app.component('InputMask',InputMask)
app.component('Dropdown',Dropdown)
app.component('DataTable',DataTable)
app.component('Knob',Knob)
app.component('Card',Card)
app.component('Column',Column)
app.component('ColumnGroup',ColumnGroup)
app.component('Row',Row)
app.component('Dialog',Dialog)
app.mount('#app')
