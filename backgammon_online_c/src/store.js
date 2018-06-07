import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        username: '',
        name: '',
        rank: -1,
        currentComponent: 'UserInfo'
    },

    mutations: {
        updateUsername (state, data) {
            state.username = data.username;
        },

        updateName (state, data) {
            state.name = data.name;
        },

        updateRank (state, data) {
            state.rank = data.rank;
        },

        updateCurComponent (state, data) {
            state.currentComponent = data.currentComponent;
        }
    },

    actions: {

    }
})
