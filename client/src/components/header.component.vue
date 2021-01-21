<template>
    <div id="headers">
        <div class="headers-wrapper">
            <div class="columns">
                <div class="company-logo">
                    <h1>LinenStore</h1>
                    <span>beta</span>
                </div>
                <nav class="main-menu" v-if="userGetData.user">
                    <router-link to="/admin_panel">Панель администратора</router-link>
                </nav>
            </div>
            <div class="columns">
                <div class="my-cart">
                    <router-link to="/cart">
                        <i class="el-icon-shopping-cart-2"></i>
                        <span>Всего: {{ cart.length > 0 && cart.map(p => p.total_price).reduce((a, b) => a + b) || 0 }} тг. | {{ cart.length }} шт.</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'headers',

    computed: {
        cart(){
            if(this.$store.getters.cart_list.name) return this.$store.getters.cart_list

            this.$store.dispatch('UPDATE_CART')
            return this.$store.getters.cart_list
        },
        userGetData(){
            return this.$store.getters.user_list || {}
        }
    }
}
</script>

<style lang="scss">
$--color-primary: #DB6100;

#headers {
    width: 100%;

    box-shadow: 0 5px 40px rgba($color: #000000, $alpha: .1);

    .headers-wrapper {
        max-width: 1440px;
        
        margin: auto;
        padding: 20px 40px;

        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;

        .columns {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .company-logo {
                margin-right: 20px;

                h1 {
                    font-size: 24px;
                    font-weight: bold;
                }
                span {
                    font-size: 14px;
                    font-weight: 300;

                    color: $--color-primary;
                }
            }

            .main-menu {
                padding: 10px 0;
                
                a {
                    text-decoration: none;
                    color: #000000;
                }
            }

            .my-cart {
                padding: 10px 0;

                a {
                    text-decoration: none;
                    color: #000000;
                }

                i {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>