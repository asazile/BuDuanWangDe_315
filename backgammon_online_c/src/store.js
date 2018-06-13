import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        username: '',
        name: '',
        rank: -1,
        currentComponent: 'UserInfo',
        isInGame: false,
        socket: null
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
        },

        updateIsInGame (state, data) {
            state.isInGame = data.isInGame;
        },

        createSocket (state, data) {
            state.socket = data.socket;
        },

        closeSocket (state, data) {
            state.socket.close();
            state.socket = data.socket;
        }
    },

    actions: {

    }
})
