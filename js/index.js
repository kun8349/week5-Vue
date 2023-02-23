import productModal from "../components/productModal.js";
const {createApp} = Vue;
let cartModal = null;



Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

VeeValidateI18n.loadLocaleFromURL("./js/zh_TW.json");

// Activate the locale
VeeValidate.configure({
generateMessage: VeeValidateI18n.localize('zh_TW'),
validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});  
const app = createApp({
    
    data(){
        return{
            products:[],
            tempProduct:{},
            cartList:[],
            total:0,
            qty:1,
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },
            loadingItem:'',
        }
    },
    components:{
        productModal,
    },
    methods:{
        getProduct(){
            axios.get(`${url}api/${path}/products`)
                .then(res=>{
                    this.products = res.data.products;
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        openModal(item){
            this.tempProduct = {...item};
            this.loadingItem = this.tempProduct.id;
            axios.get(`${url}api/${path}/product/${this.tempProduct.id}`)
                .then(res=>{
                    cartModal.show();
                    this.loadingItem = '';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
            
        }, 
        addProduct(item,qty=1){
            const data = {
                "product_id": item.id,
                qty,
            };
            this.loadingItem = item.id
            axios.post(`${url}api/${path}/cart`,{data})
                .then(res=>{
                    this.getCartList();
                    cartModal.hide();
                    this.loadingItem = '';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        getCartList(){
            axios.get(`${url}api/${path}/cart`)
                .then(res=>{ 
                    this.cartList = res.data.data.carts;
                    this.total = res.data.data.total;
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        deleteAll(){
            axios.delete(`${url}api/${path}/carts`)
                .then(res=>{
                    this.loading();
                    this.getCartList();
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        deleteSingle(product){
            this.loadingItem = product.id;
            axios.delete(`${url}api/${path}/cart/${product.id}`)
                .then(res=>{
                    this.loading();
                    this.getCartList();
                    this.loadingItem = '';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        editNum(product){
            const data = {
                product_id: product.id,
                qty: product.qty
            };
            this.loadingItem = product.id;
            axios.put(`${url}api/${path}/cart/${product.id}`,{data})
                .then(res=>{
                    this.getCartList();
                    this.loading();
                    this.loadingItem='';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        order(){
            axios.post(`${url}api/${path}/order`,{data:this.form})
                .then(res=>{
                    this.loading();
                    this.form ={
                        user: {
                          name: '',
                          email: '',
                          tel: '',
                          address: '',
                        },
                        message: '',
                    };
                    this.getCartList();
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        loading(){
            let loader = this.$loading.show({});
        // simulate AJAX
            setTimeout(() => {
                loader.hide()
            }, 1000)
        },

    },
    mounted(){
        this.loading();
        this.getProduct();
        this.getCartList();
        
        cartModal = new bootstrap.Modal(document.getElementById('cartModal'), {
            keyboard: false
        })
    },
});
app.use(VueLoading.LoadingPlugin);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');