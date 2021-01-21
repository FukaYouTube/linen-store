<template>
    <div class="admin">
        <div class="auth-user" v-if="!userGetData.user">
            <div class="form">
                <h1>Вход</h1>
                <el-input type="text" placeholder="Введите имя" v-model="authForm.username" autocomplete="off"></el-input>
                <el-input type="password" placeholder="Введите пароль" v-model="authForm.password" autocomplete="off" show-password></el-input>
                <el-button type="primary" @click="auth">Войти</el-button>
            </div>
        </div>

        <div class="admin-panel" v-else>
            <div class="admin-panel-wrapper">
                <div class="column">
                    <div class="user-state">
                        <ul>
                            <li>Имя пользователя: {{ userGetData.user.name }}</li>
                            <li>Статус: {{ userGetData.user.utype === '_admin' ? 'Администратор' : 'Неизвестен' }}</li>
                            <li>Авторизация: {{ userGetData.user ? 'OK' : 'Ошибка, нет данных' }}</li>
                        </ul>
                    </div>

                    <nav class="panel-menu">
                        <ul>
                            <li><router-link to="/"><el-button>Вернуться на главную</el-button></router-link></li>
                            <li><el-button @click="openDialogAddProduct">Добавить товар</el-button></li>
                            <li><el-button @click="dialogOptions = true">Настройки</el-button></li>
                            <li><el-button @click="exit">Выйти</el-button></li>
                        </ul>
                    </nav>
                </div>
                <div class="column">
                    <div class="user-card" v-for="data in userPaymentData" :key="data.name">
                        <h1>Новый заказ на: {{ data.name }}</h1>
                        <p>Категория товара: {{ data.category }}</p>
                        <p>Цена: {{ data.price }} тг.</p>
                        <div class="user-data">
                            <ul v-for="user in data.users" :key="user.username">
                                <li>Заказ от клиента: {{ user.user.username }}</li>
                                <li>Номер телефона: {{ user.user.phone }}</li>
                                <li>Адресс: "{{ user.user.address }}"</li>
                                <li>Количество: {{ user.amount }} на сумму {{ user.price }} тг.</li>
                                <li><el-button type="danger" @click="removeClient(data, user)">Удалить</el-button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
          width="420px"
          class="dialog-add-product"
          title="Добавить новый товар"
          :visible.sync="dialogAddProduct"
        >
            <el-input class="input-div" type="text" placeholder="Название товара:" v-model="addProductForm.name"></el-input>
            <el-input class="input-div" type="text" placeholder="Количество:" v-model="addProductForm.amount"></el-input>
            <el-input class="input-div" type="text" placeholder="Цена:" v-model="addProductForm.price"></el-input>
            
            <el-select class="input-div input-category" v-model="addProductForm.category" filterable placeholder="Категория:">
            <el-option v-for="item in optionsSelectValue" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
            
            <el-input class="input-div" type="textarea" :rows="2" placeholder="Описание:" v-model="addProductForm.description"></el-input>
            
            <div class="input-div upload-file">
                <el-button type="primary"><label for="upload_file">Загрузить фото</label></el-button>
                <input type="file" name="upload" id="upload_file" accept=".jpg, .jpeg, .png" style="display: none;" @change="handleImageSuccessUpload" multiple>

                <ul>
                    <li
                        style="padding-top: 10px"
                        :key="index"
                        v-for="(name, index) in formAddProductsFilesName"
                    >Добавлен: "{{ name }}"</li>
                </ul>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveProduct">Сохранить</el-button>
            </span>
        </el-dialog>

        <el-dialog
          width="420px"
          class="dialog-edit-data"
          title="Настройки"
          :visible.sync="dialogOptions"
        >
            <el-input class="input-div" type="text" placeholder="Придумайте имя:" v-model="updateForm.new_username"></el-input>
            <el-input class="input-div" type="password" placeholder="Введите старый пароль:" v-model="updateForm.password" autocomplete="off" show-password></el-input>
            <el-input class="input-div" type="password" placeholder="Придумайте новый пароль:" v-model="updateForm.new_password" autocomplete="off" show-password></el-input>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEditData">Сохранить</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Admin',

    data: () => ({
        authForm: {
            username: '',
            password: ''
        },
        
        updateForm: {
            new_username: '',
            new_password: '',
            password: ''
        },

        dialogAddProduct: false,
        formAddProductsFiles: [],
        formAddProductsFilesName: [],
        addProductForm: {
            name: '',
            amount: '',
            price: '',
            category: '',
            description: ''
        },
        optionsSelectValue: [
            {
                value: '1,5 спальные комплек',
                label: '1,5 спальные комплек'
            }, 
            {
                value: '2 спальные (Евро)',
                label: '2 спальные (Евро)'
            },
            {
                value: 'Семейные комплекты',
                label: 'Семейные комплекты'
            },
            {
                value: 'Детские комплекты',
                label: 'Детские комплекты'
            },
            {
                value: 'Отдельные предметы (простыни, наволочки)',
                label: 'Отдельные предметы (простыни, наволочки)'
            }
        ],

        dialogOptions: false
    }),

    methods: {
        removeClient(product, user){
            let data = { product, user }

            this.$store.dispatch('REMOVE_CLIENT_IN_PAYMENT', data)
            this.$message({ message: 'Удалено!', type: 'success' })
            this.$router.go()
        },
        saveProduct(){
            if(!this.addProductForm.name || !this.addProductForm.amount || !this.addProductForm.price || !this.addProductForm.category || !this.addProductForm.description || this.formAddProductsFilesName.length === 0){
                return this.$message({ message: 'Заполните все данные!', type: 'error' })
            }

            let data = {
                file: this.formAddProductsFiles,
                productInfo: this.addProductForm
            }

            this.$store.dispatch('ADD_PRODUCT_TO_DB', data)
            this.$message({ message: 'Товар успешно добавлен', type: 'success' })
            this.dialogAddProduct = false
        },
        openDialogAddProduct(){
            this.addProductForm = {}
            this.formAddProductsFiles = []
            this.formAddProductsFilesName = []
            this.dialogAddProduct = true
        },
        handleImageSuccessUpload(){
            event.target.files.forEach(file => {
                let fileReader = new FileReader()
            
                this.formAddProductsFilesName.push(file.name)
            
                fileReader.readAsDataURL(file)
                fileReader.onload = e => this.formAddProductsFiles.push(e.target.result)
            })
        },
        saveEditData(){
            if(this.updateForm.password.length <= 0){
                return this.$message({ message: 'Введите старый пароль', type: 'error' })
            }

            let data = { update: this.updateForm, user: JSON.parse(localStorage.getItem('user')) }
            this.$store.dispatch('UPDATE_DATA_ADMIN', data)

            this.$message({ message: 'Сохранен!', type: 'success' })
            this.dialogOptions = false
        },
        auth(){
            if(this.authForm.username.length <= 0 || this.authForm.username.length <= 0){
                return this.$message({ message: 'Заполните все данные для входа', type: 'error' })
            }

            this.$store.dispatch('AUTH_LOGIN', this.authForm)
        },
        exit(){
            localStorage.removeItem('user')
            this.$router.go()
        }
    },

    computed: {
        userGetData(){
            switch(this.$store.getters.user_list && this.$store.getters.user_list.message){
                case 'successful login':
                    this.$message({ message: 'Добро пожаловать', type: 'success' })
                    return this.$store.getters.user_list
                break
                case 'username not found or incorrect password': 
                    this.$message({ message: 'Не найден пользователь или не верный пароль', type: 'error' })
                    return {}
                break
                default:
                    return this.$store.getters.user_list || {}
            }
        },
        userPaymentData(){
            return this.$store.getters.user_payment_list
        }
    },

    mounted(){
        this.$store.dispatch('GET_USER_LIST_FOR_ADMIN')
    },
}
</script>

<style lang="scss">
$--color-primary: #DB6100;
$--color-2: #047B8F;

.auth-user {
    width: 340px;

    margin: auto;
    margin-top: 60px;

    .form {
        h1 {
            padding: 20px 0;

            font-size: 24px;
            font-weight: bold;
            color: $--color-primary;
        }

        div {
            margin-bottom: 10px;
        }

        .el-button {
            width: 100%;
        }
    }
}

.admin-panel {
    width: 100%;

    .admin-panel-wrapper {
        max-width: 1440px;
        
        margin: auto;
        padding: 20px 40px;

        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        .user-state {
            ul li {
                margin-top: 10px;

                &:first-child {
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }

        .panel-menu {
            margin-top: 20px;

            ul li {
                margin-top: 10px;
            }
        }

        .user-card {
            padding: 10px 40px;

            h1 {
                font-size: 24px;
                font-weight: bold;
            }
            p {
                margin: 5px 0;
                font-size: 16px;
            }

            .user-data {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;

                ul {
                    width: 250px;

                    margin: 10px 5px;
                    padding: 10px 15px;

                    color: #ffffff;

                    border-radius: 5px;
                    background-color: $--color-2;

                    li {
                        margin: 5px 0;
                        font-size: 16px;
                        font-weight: 400;
                    }
                }
            }

            // <div class="user-card" v-for="data in userPaymentData" :key="data.name">
            //             <h1>Новый заказ на: {{ data.name }}</h1>
            //             <p>Категория товара: {{ data.category }}</p>
            //             <p>Цена: {{ data.price }} тг.</p>
            //             <ul v-for="user in data.users" :key="user.username">
            //                 <li>Заказ от клиента: {{ user.user.username }}</li>
            //                 <li>Номер телефона: {{ user.user.phone }}</li>
            //                 <li>Адресс: {{ user.user.address }}</li>
            //                 <li>Количество: {{ user.amount }} на сумму {{ user.price }} тг.</li>
            //             </ul>
            //             <el-button type="danger">Удалить</el-button>
            //         </div>
        }
    }
}

.dialog-add-product, .dialog-edit-data {
    .input-div {
        margin-top: 10px;
    }
}
</style>