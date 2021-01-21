import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import productsModule from './products.module'
import adminModule from './admin.module'

export default new Vuex.Store({
  state: {
    products: [],
    payment: [],
    cart: [],
    
    user: {},
    user_payment_list: [],

    message_add_product: ''
  },
  mutations: {
    GET_PRODUCTS_LIST: (state, data) => state.products = data,
    ADD_TO_CART_PRODUCT: (state, data) => productsModule['ADD_TO_CART_PRODUCT'](state, data),
    REMOVE_IN_CART_PRODUCT: (state, data) => productsModule['REMOVE_IN_CART_PRODUCT'](state, data),
    EDIT_AMOUNT_IN_CART_PRODUCT: (state, data) => productsModule['EDIT_AMOUNT_IN_CART_PRODUCT'](state, data),
    AUTH_LOGIN_DATA: (state, data) => adminModule['AUTH_LOGIN_DATA'](state, data),
    ADD_PRODUCT_TO_DB_DATA: (state, data) => productsModule['ADD_PRODUCT_TO_DB_DATA'](state, data),
    UPDATE_CART_DATA: state => state.cart = JSON.parse(localStorage.getItem('ucart')) || [],
    UPDATE_PAYMENT_DATA: state => state.payment = JSON.parse(localStorage.getItem('payment')) || [],
    CLEAR_IN_CART_PRODUCT: state => productsModule['CLEAR_IN_CART_PRODUCT'](state),
    BUY_PRODUCT_DATA: (state, data) => productsModule['BUY_PRODUCT_DATA'](state, data),
    GET_USER_LIST_FOR_ADMIN_DATA: (state, data) => adminModule['GET_USER_LIST_FOR_ADMIN_DATA'](state, data),
    UPDATE_DATA_ADMIN_MUTATION: (state, data) => adminModule['UPDATE_DATA_ADMIN_MUTATION'](state, data),
  },
  actions: {
    GET_PRODUCTS_LIST_FROM_API: ctx => productsModule['GET_PRODUCTS_LIST_FROM_API'](ctx),
    ADD_TO_CART: (ctx, data) => productsModule['ADD_TO_CART'](ctx, data),
    REMOVE_IN_CART: (ctx, data) => productsModule['REMOVE_IN_CART'](ctx, data),
    EDIT_AMOUNT_IN_CART: (ctx, data) => productsModule['EDIT_AMOUNT_IN_CART'](ctx, data),
    AUTH_LOGIN: (ctx, data) => adminModule['AUTH_LOGIN'](ctx, data),
    ADD_PRODUCT_TO_DB: (ctx, data) => productsModule['ADD_PRODUCT_TO_DB'](ctx, data),
    UPDATE_CART: ctx => ctx.commit('UPDATE_CART_DATA'),
    UPDATE_PAYMENT: ctx => ctx.commit('UPDATE_PAYMENT_DATA'),
    CLEAR_IN_CART: ctx => productsModule['CLEAR_IN_CART'](ctx),
    BUY_PRODUCT: (ctx, data) => productsModule['BUY_PRODUCT'](ctx, data),
    // BUY_PRODUCT_ALL: (ctx, data) => productsModule['BUY_PRODUCT_ALL'](ctx, data),
    GET_USER_LIST_FOR_ADMIN: ctx => adminModule['GET_USER_LIST_FOR_ADMIN'](ctx),
    REMOVE_CLIENT_IN_PAYMENT: (ctx, data) => adminModule['REMOVE_CLIENT_IN_PAYMENT'](ctx, data),
    UPDATE_DATA_ADMIN: (ctx, data) => adminModule['UPDATE_DATA_ADMIN'](ctx, data)
  },
  getters: {
    products_list: state => state.products,
    cart_list: state => state.cart,
    user_list: state => state.user.user ? state.user : JSON.parse(localStorage.getItem('user')),
    add_product_message: state => state.message_add_product,
    payment_list: state => state.payment,
    user_payment_list: state => state.user_payment_list
  }
})