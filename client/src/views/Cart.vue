<template>
    <div id="cart-container">
        <div class="title__container">
            <div class="title__container-wrapper">
                <h1>Оформление заказа</h1>
                <router-link to="/">Вернуться домой</router-link>
            </div>
        </div>
        <div class="client__container">
            <div class="client__container-wrapper">
                <div class="column">
                    <h1>Введите данные для получение заказа:</h1>

                    <div class="form">
                        <el-input type="text" placeholder="Введите ваше имя:" v-model="cartForm.username"></el-input>
                        <el-input type="text" placeholder="Введите номер телефона:" v-model="cartForm.phone"></el-input>
                        <el-input class="input-div" type="textarea" :rows="4" placeholder="Введите ваш адрес для доставки:" v-model="cartForm.address"></el-input>
                    </div>

                    <h1 style="margin-top: 20px;">Ожидание заказа: (История)</h1>

                    <div class="product-payment-list">
                        <div class="product-card" v-for="product in payment" :key="product._id">
                            <div class="product-image">
                                <img :src="product.product.file[0]" :alt="product.product.name">
                            </div>
                            <div class="product-info-right">
                                <h1 class="product-name">{{ product.product.name }}</h1>
                                <h2 class="product-price">Цена: {{ product.product.price }} тг.</h2>
                                <ul class="product-info">
                                    <li>Количество: {{ product.product.amount }} шт.</li>
                                    <li>Категория: {{ product.product.category }}</li>
                                </ul>
                            </div>
                            <div class="cart-product-amount">
                                <h1>{{ product.amount }} шт.</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="column2" v-if="cartData.length > 0">
                    <div class="all-product-method">
                        <el-button type="danger" @click="clearCart">Очистить корзину</el-button>
                    </div>

                    <div class="cart-grid" v-for="cart in cartData" :key="cart._id">
                        <div class="product-image">
                            <img :src="cart.product.file[0]" :alt="cart.product.name">
                        </div>
                        <div class="product-info-right">
                            <h1 class="product-name">{{ cart.product.name }}</h1>
                            <h2 class="product-price">Цена: {{ cart.product.price }} тг.</h2>
                            <ul class="product-info">
                                <li>Количество: {{ cart.product.amount }} шт.</li>
                                <li>Категория: {{ cart.product.category }}</li>
                            </ul>
                        </div>
                        <div class="cart-product-amount">
                            <el-input-number v-model="cart.amount" @change="editAmountInCart($event, cart.product)" :min="1" :max="cart.product.amount"></el-input-number>
                        </div>
                        <div class="end-card">
                            <el-button type="success" @click="buyProduct(cart)">Купить</el-button>
                            <el-button type="danger" @click="removeInCart(cart.product)">Удалить</el-button>
                        </div>
                    </div>
                </div>
                <div class="column2" v-else>
                    <h1>Пусто - Перейдите на главную страницу сайта, выберите товар и нажмите на кнопку "В корзину"</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cart',
    
    data: () => ({
        cartForm: {}
    }),

    methods: {
        buyProduct(product){
            if(!this.cartForm.username || !this.cartForm.phone || !this.cartForm.address){
                return this.$notify({ title: 'Заполите данные!', message: 'Заполите данные для получение заказа', type: 'error', position: 'bottom-right' })
            }

            let data = { product, user: this.cartForm }
            this.$store.dispatch('BUY_PRODUCT', data)

            this.$notify({ title: 'Спасибо за покупку!', message: `Спасибо за покупку, ожидайте заказ!`, type: 'success', position: 'bottom-right' })
            this.$store.dispatch('REMOVE_IN_CART', product.product)
        },
        editAmountInCart(value, product){
            let data = { product, total_price: product.price * value, amount: value }
            this.$store.dispatch('EDIT_AMOUNT_IN_CART', data)
        },
        removeInCart(product){
            this.$store.dispatch('REMOVE_IN_CART', product)
            this.$notify({ title: 'Удалено с корзины!', message: `Товар "${product.name}" был удален с корзины!`, type: 'success', position: 'bottom-right' })
        },
        clearCart(){
            this.$store.dispatch('CLEAR_IN_CART')
            this.$notify({ title: 'Корзина пуста!', message: `Корзина успешно очистилась!`, type: 'success', position: 'bottom-right' })
        }
    },

    computed: {
        cartData(){
            return this.$store.getters.cart_list
        },
        payment(){
            if(this.$store.getters.payment_list.length > 0) return this.$store.getters.payment_list

            this.$store.dispatch('UPDATE_PAYMENT')
            return this.$store.getters.payment_list
        }
    },

    mounted(){
        this.cartForm = JSON.parse(localStorage.getItem('client-address')) || {}
    },
}
</script>

<style lang="scss">
$--color-primary: #DB6100;
$--color-2: #047B8F;

.title__container {
    width: 100%;

    .title__container-wrapper {
        text-align: center;
        padding: 20px 40px;

        h1 {
            font-size: 24px;
            font-weight: bold;
            color: $--color-primary;
        }

        a {
            display: block;
            padding: 10px;
            text-decoration: none;

            font-size: 18px;
            font-weight: 300;
            color: $--color-2;
        }
    }
}

.client__container {
    width: 100%;

    .client__container-wrapper {
        max-width: 1440px;
        
        margin: auto;
        padding: 20px 40px;

        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        .column {            
            width: 400px;
        }
        .column2 {
            width: 900px;
        }

        h1 {
            font-size: 18px;
            font-weight: bold;
            color: #000000;
        }

        .form {
            div {
                margin-top: 15px;
            }
        }

        .all-product-method {
            padding: 20px;
        }
        .product-payment-list {
            padding: 20px 0;
        }

        .cart-grid {
            padding: 20px;

            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .product-image {
                margin-right: 20px;

                img {
                    width: 110px;
                    height: 110px;
                    object-fit: cover;
                    border-radius: 5px;
                }
            }

            .product-info-right {
                h1 {
                    padding: 10px 0;
                    font-size: 22px;
                    font-weight: bold;
                }
                h2, ul li {
                    font-size: 14px;
                }
                h2 {
                    margin-top: 5px;

                    font-size: 18px;
                    font-weight: bold;
                    color: $--color-2;
                }
                ul li {
                    margin-top: 5px;
                }
            }
            
            .cart-product-amount, .end-card {
                padding: 10px 0;
                margin-left: 20px;
            }
        }
        .product-card {
            padding: 20px 0;

            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .product-image {
                img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 5px;
                }
            }

            .product-info-right {
                margin-left: 10px;

                h1 {
                    font-size: 16px;
                    font-weight: bold;
                }
                h2, ul li {
                    font-size: 12px;
                }
                h2 {
                    margin-top: 5px;

                    font-size: 14px;
                    font-weight: bold;
                    color: $--color-2;
                }
                ul li {
                    margin-top: 5px;
                }
            }
            
            .cart-product-amount, .end-card {
                margin-left: 5px;
            }
        }
    }
}
</style>