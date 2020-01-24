import axios from 'axios'

export const state = () => ({
  authUser: null
})

export const mutations = {
  SIGNIN: function (state, user) {
    state.authUser = user
  },
  SIGNOUT: function () {
    state.authUser = null
  },
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  // nuxtServerInit는 모든 페이지를 서버 렌더링하기 전에 Nuxt.js에 의해 호출
  async nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async signin({ commit }, { email, password }) {
    if (!email || !password) throw new Error('이메일과 비밀번호를 입력해주세요.')
    try {
      const { data } = await axios.post('/api/signin', { email, password })
      commit('SIGNIN', data)
    } catch (error) {
      throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.')
    }
  },
  async signout ({ commit }) {
    const { data } = await axios.post('/api/signout')
    if (data.ok) commit('SIGNOUT')
  }
}