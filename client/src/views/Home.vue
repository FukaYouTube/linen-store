<template>
  <div class="home">
    <div class="banner__container">
      <div class="banner__container-wrapper">
        <ul>
          <li><i class="el-icon-map-location"></i> Доставка по всему Казахстану</li>
          <li><i class="el-icon-box"></i> Высокое качество</li>
          <li><i class="el-icon-coin"></i> Выгодные цены</li>
          <li><i class="el-icon-bank-card"></i> Оплата после доставки</li>
        </ul>
      </div>
    </div>

    <div class="catergory-filter__container">
      <div class="catergory-filter__container-wrapper">
        <ul>
          <li>Выберите категорию: </li>
          <li
            @click="currentFilter1 = '1,5 спальные комплек'"
            :class="currentFilter1 === '1,5 спальные комплек' ? 'active' : ''"
          >1,5 спальные комплек</li>
          <li
            @click="currentFilter1 = '2 спальные (Евро)'"
            :class="currentFilter1 === '2 спальные (Евро)' ? 'active' : ''"
          >2 спальные (Евро)</li>
          <li
            @click="currentFilter1 = 'Семейные комплекты'"
            :class="currentFilter1 === 'Семейные комплекты' ? 'active' : ''"
          >Семейные комплекты</li>
          <li
            @click="currentFilter1 = 'Детские комплекты'"
            :class="currentFilter1 === 'Детские комплекты' ? 'active' : ''"
          >Детские комплекты</li>
          <li
            @click="currentFilter1 = 'Отдельные предметы (простыни, наволочки)'"
            :class="currentFilter1 === 'Отдельные предметы (простыни, наволочки)' ? 'active' : ''"
          >Отдельные предметы (простыни, наволочки)</li>
        </ul>
      </div>
    </div>

    <div class="product__contaier">
      <div class="product__container-wrapper">
        <h1 class="title">Постельное белье</h1>

        <div class="product-grid">
          <div
            class="products-card"
            v-for="product in products.filter(p => p.category === currentFilter1).slice((page_item - 1) * max_total_products, page_item * max_total_products)"
            :key="product._id"
          >
            <div class="product-image">
              <img :src="product.file[0]" :alt="product.name">
            </div>
            <h1 class="product-name">{{ product.name }}</h1>
            <h2 class="product-price">Цена: {{ product.price }} тг.</h2>
            <ul class="product-info">
              <li>Количество: {{ product.amount }} шт.</li>
              <li>Категория: {{ product.category }}</li>
            </ul>
            <div class="product-footer">
              <el-button @click="viewProduct(product)">Посмотреть</el-button>
              <el-button type="primary" @click="addToCart(product)" :disabled="product.amount <= 0 ? true : false">В корзину</el-button>
            </div>
          </div>
        </div>

        <el-dialog
          width="420px"
          :visible.sync="dialogProduct"
        >
          <div class="product-image">
            <el-carousel trigger="click">
              <el-carousel-item v-for="image in product_item.file" :key="image">
                <h3 class="small"><img :src="image" :alt="product_item.name"></h3>
              </el-carousel-item>
            </el-carousel>
          </div>

          <h1 class="product-name">{{ product_item.name }}</h1>
          <h2 class="product-price">Цена: {{ product_item.price }} тг.</h2>
          <ul class="product-info">
            <li>Количество: {{ product_item.amount }} шт.</li>
            <li>Категория: {{ product_item.category }}</li>
            <li>Описание: {{ product_item.description }}</li>
            <li v-if="product_item.data">Дополнительные: {{ product_item.data }}</li>
          </ul>          
          
          <span slot="footer" class="dialog-footer">
            <el-input-number v-model="amount" :min="1" :max="product_item.amount"></el-input-number>
            <el-button type="primary" @click="addToCart(product_item); amount = 1" :disabled="product_item.amount <= 0 ? true : false">В корзину</el-button>
          </span>
        </el-dialog>

        <el-pagination
          background
          :page-size="max_total_products"
          :pager-count="5"
          layout="prev, pager, next"
          :total="products.filter(p => p.category === currentFilter1).length"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: () => ({
    currentFilter1: '1,5 спальные комплек',

    amount: 1,
    product_item: {},
    
    dialogProduct: false,
    
    page_item: 1,
    max_total_products: 5
  }),

  methods: {
    handleCurrentChange(page){
      this.page_item = page
    },
    viewProduct(product){
      this.amount = 1
      this.product_item = {}
      
      this.dialogProduct = true
      this.product_item = product
    },
    addToCart(product){
      let data = { product, total_price: product.price * this.amount, amount: this.amount }

      this.$store.dispatch('ADD_TO_CART', data)
      this.$notify({ title: 'Добавлено в корзину!', message: `Товар "${product.name}" добавлен в корзину!`, type: 'success', position: 'bottom-right' });
    }
  },

  computed: {
    products(){
      return this.$store.getters.products_list
    }
  },

  mounted(){
    this.$store.dispatch('GET_PRODUCTS_LIST_FROM_API')
  }
}
</script>

<style lang="scss">
$--color-primary: #DB6100;
$--color-2: #047B8F;

.home {
  .banner__container {
    width: 100%;
    
    position: relative;
    z-index: -1;

    background-color: $--color-primary;

    .banner__container-wrapper {
      max-width: 1440px;
        
      margin: auto;
      padding: 20px 40px;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      text-align: center;
        
      ul li {
        display: inline-block;
        margin-left: 20px;
        padding: 5px 0;

        color: #ffffff;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }


  .catergory-filter__container {
    width: 100%;

    .catergory-filter__container-wrapper {
      max-width: 1440px;

      margin: auto;
      padding: 20px 10px;

      box-shadow: 0 5px 40px rgba($color: #000000, $alpha: .1);

      ul {
        text-align: center;

        li {
          display: inline-block;
          margin-left: 20px;
          padding: 5px 0;
          
          cursor: pointer;

          font-size: 16px;
          font-weight: bold;

          transition: color .3s;
          
          &:first-child {
            margin-left: 0;
          }

          &:hover {
            color: $--color-primary;
          }
        }
      }

      .active {
        color: $--color-primary;
      }
    }
  }

  .product__contaier {
    width: 100%;
    margin-top: 20px;
    
    .title {
      text-align: center;
      padding: 20px 0;

      font-size: 24px;
      font-weight: bold;
    }

    .product__container-wrapper {
      max-width: 1440px;
      text-align: center;
      margin: auto;

      
    }

    .product-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: center;

      margin-bottom: 40px;

      .products-card {
        width: 250px;
        margin: 10px;
        padding: 40px 20px;

        text-align: start;

        border-radius: 5px;
        box-shadow: 5px 5px 10px rgba($color: #000000, $alpha: .1);

        .product-name, .product-category, .product-info, .product-footer {
          margin-top: 10px;
        }

        .product-image {
          img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 5px;
          }
        }

        h1 {
          font-size: 24px;
          font-weight: bold;
        }
        h2, ul li {
          font-size: 14px;
        }
        h2 {
          margin-top: 10px;

          font-size: 18px;
          font-weight: bold;
          color: $--color-2;
        }
        ul li {
          margin-top: 5px;
        }
      }
    }
  }

  .el-dialog {
    text-align: start;

    .product-name, .product-category, .product-info, .product-footer {
      margin-top: 10px;
    }

    .product-image {
      .el-carousel__container {
        height: 240px;
        
        .el-carousel__item {        
          img {
            width: 100%;
            height: 240px;
            object-fit: cover;
            border-radius: 5px;
          }
        }
      }
    }

    h1 {
      font-size: 26px;
      font-weight: bold;
    }
    h2, ul li {
      font-size: 16px;
    }
    h2 {
      margin-top: 10px;

      font-size: 22px;
      font-weight: bold;
      color: $--color-2;
    }
    ul li {
      margin-top: 5px;
    }

    .dialog-footer {
      .el-input-number {
        margin-right: 20px;
      }
    }
  }
}
</style>