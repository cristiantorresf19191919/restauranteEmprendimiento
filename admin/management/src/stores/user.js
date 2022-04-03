import {computed, reactive} from 'vue'
import * as Request from "@/utils/request"

const state = reactive({
    name:'',
    restaurantName:'',
    adminName:'',
    email:'',
    password:'',
    error:'',
})

const getters = reactive({
    isLoggedIn: computed(() => state.name !== "")
})

const actions = {
    async registerUser(user){
        const res = await Request.register(user)
        
    }
   
}

export default {state, getters, ...actions}