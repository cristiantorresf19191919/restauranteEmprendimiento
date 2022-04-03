import {computed, reactive} from 'vue'

const state = reactive({
    count:0 
})

const getters = reactive({
    times2: computed(()=> state.count * 2)
})

const actions = {
    inc(by){
        state.count += by
    }
}

const test = () => {
    console.log(process.env.VUE_APP_URL)
}

export default {state, getters, ...actions, test}