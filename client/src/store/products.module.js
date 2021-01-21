import axios from 'axios'

export default {
    'GET_PRODUCTS_LIST_FROM_API': ctx => {
        return axios('https://linen-store.herokuapp.com/api/products', { method: 'GET' }).then(res => {
            ctx.commit('GET_PRODUCTS_LIST', res.data)
        })
    },
    'ADD_TO_CART': (ctx, data) => {
        return ctx.commit('ADD_TO_CART_PRODUCT', data)
    },
    'ADD_TO_CART_PRODUCT': (state, data) => {
        if(state.cart.map(p => p.product.name).includes(data.product.name) && state.cart.map(p => p.product.category).includes(data.product.category)){
            state.cart.find(p => p.product.name === data.product.name && p.product.category === data.product.category).total_price += data.total_price
            state.cart.find(p => p.product.name === data.product.name && p.product.category === data.product.category).amount += data.amount
        }else{
            state.cart.push(data)
        }

        localStorage.setItem('ucart', JSON.stringify(state.cart))
    },
    'REMOVE_IN_CART': (ctx, data) => {
        return ctx.commit('REMOVE_IN_CART_PRODUCT', data)
    },
    'REMOVE_IN_CART_PRODUCT': (state, data) => {
        if(state.cart.map(p => p.product.name).includes(data.name) && state.cart.map(p => p.product.category).includes(data.category)){
            state.cart.splice(state.cart.indexOf(state.cart.find(p => p.product.name === data.name && p.product.category === data.category)), 1)
            localStorage.setItem('ucart', JSON.stringify(state.cart))
        }else{
            console.log('Products not found!')
        }
    },
    'CLEAR_IN_CART': ctx => {
        return ctx.commit('CLEAR_IN_CART_PRODUCT')
    },
    'CLEAR_IN_CART_PRODUCT': state => {
        localStorage.removeItem('ucart')
        return state.cart = []
    },
    'EDIT_AMOUNT_IN_CART': (ctx, data) => {
        return ctx.commit('EDIT_AMOUNT_IN_CART_PRODUCT', data)
    },
    'EDIT_AMOUNT_IN_CART_PRODUCT': (state, data) => {
        if(state.cart.map(p => p.product.name).includes(data.product.name) && state.cart.map(p => p.product.category).includes(data.product.category)){
            state.cart.find(p => p.product.name === data.product.name && p.product.category === data.product.category).total_price = data.total_price
            state.cart.find(p => p.product.name === data.product.name && p.product.category === data.product.category).amount = data.amount
            localStorage.setItem('ucart', JSON.stringify(state.cart))
        }else{
            console.log('Products not found!')
        }
    },
    'ADD_PRODUCT_TO_DB': (ctx, data) => {
        return axios.post('https://linen-store.herokuapp.com/api/admin/products/add', data, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            }
        }).then(res => {
            ctx.commit('ADD_PRODUCT_TO_DB_DATA', res.data)
        }).catch(err => {
            ctx.commit('ADD_PRODUCT_TO_DB_DATA', err.response.data)
        })
    },
    'ADD_PRODUCT_TO_DB_DATA': (state, data) => {
        state.message_add_product = data.message
        
        if(state.products.map(p => p.name).includes(data.product.name) && state.products.map(p => p.category).includes(data.product.category)){
            return state.products.find(p => p.name === data.product.name && p.category === data.product.category).amount = data.product.amount
        }else{
            return state.products.push(data.product)
        }
    },
    'BUY_PRODUCT': (ctx, data) => {
        return axios.post('https://linen-store.herokuapp.com/api/products/buy', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            ctx.commit('BUY_PRODUCT_DATA', data)
        })
    },
    'BUY_PRODUCT_DATA': (state, data) => {
        state.payment.push(data.product)
        state.success_payment_bool = true
        
        localStorage.setItem('payment', JSON.stringify(state.payment))
        localStorage.setItem('client-address', JSON.stringify(data.user))
    },
    // 'BUY_PRODUCT_ALL': (ctx, data) => {
    //     return axios.post('https://linen-store.herokuapp.com/api/products/buy', data, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => {
    //         ctx.commit('BUY_PRODUCT_ALL_DATA', data)
    //     })
    // },
    // 'BUY_PRODUCT_ALL_DATA': (state, data) => {}
}