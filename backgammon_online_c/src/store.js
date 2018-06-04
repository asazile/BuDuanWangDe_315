import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        username: '',
        rank: -1,
    },
    mutations: {
        updateUsername (state, data) {
            state.username = data.username;
        }
    },
    actions: {

    }
})
