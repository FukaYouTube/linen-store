import axios from 'axios'

export default {
    'AUTH_LOGIN': (ctx, data) => {
        return axios.post('https://linen-store.herokuapp.com/api/auth/login', data).then(res => {
            ctx.commit('AUTH_LOGIN_DATA', res.data)
            localStorage.setItem('user', JSON.stringify(res.data))
        }).catch(err => {
            ctx.commit('AUTH_LOGIN_DATA', err.response.data)
        })
    },
    'AUTH_LOGIN_DATA': (state, res) => {
        state.user = res
    },
    'GET_USER_LIST_FOR_ADMIN': ctx => {
        return axios.post('https://linen-store.herokuapp.com/api/admin/user/list', {}, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            }
        }).then(res => {
            ctx.commit('GET_USER_LIST_FOR_ADMIN_DATA', res.data.product)
        })
    },
    'GET_USER_LIST_FOR_ADMIN_DATA': (state, data) => {
        return state.user_payment_list = data
    },
    'REMOVE_CLIENT_IN_PAYMENT': (ctx, data) => {
        return axios.post('https://linen-store.herokuapp.com/api/admin/user/remove', data, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            }
        })
    },
    'UPDATE_DATA_ADMIN': (ctx, data) => {
        return axios.post('https://linen-store.herokuapp.com/api/admin/edit', data, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            }
        }).then(res => {
            ctx.commit('UPDATE_DATA_ADMIN_MUTATION', res.data)
            localStorage.setItem('user', JSON.stringify(res.data))
        })
    },
    'UPDATE_DATA_ADMIN_MUTATION': (state, data) => {
        state.user = data
    }
}