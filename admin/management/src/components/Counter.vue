<template>
    <div>
        <h1>counter</h1>
        <h4>{{ state.count }} x 2 = {{ getters.times2 }}</h4>
        <!-- <InputText v-model="text" /> -->
        <Button label="Count" icon="pi pi-user" @click="inc(1)"></Button>
        <Button label="Test Data" @click="testData"></Button>
    </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import counterStore from '@/stores/counter'
import { useToast } from "primevue/usetoast"; 
export default {
    name:'Counter',
    setup() {
        const { state, getters, inc, test } = counterStore;
        const text = ref('');
        const toast = useToast();
        const testData = () => {
            alert(process.env.URL)
            test()
        }
        return {state,getters,inc,text,testData}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>