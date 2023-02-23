export default {
    props:['tempProduct','addProduct','qty'],
    data(){
        return{
          NewQty:1,
        }
    },
    watch:{
      tempProduct(){
        this.NewQty = this.qty;
      }
    },
    template:`<div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header bg-secondary text-white">
        <h5 class="modal-title" id="staticBackdropLabel">
          Modal title
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <img class="img-fluid" :src="tempProduct.imageUrl" alt="singlePic">
          </div>
          <div class="col-md-6 d-flex flex-column justify-content-between">
            <div>
              <p class="badge bg-primary fs-5">
                {{ tempProduct.category }}
              </p>
              <p>
                商品描述：{{ tempProduct.content }}
              </p>
              <p>
                商品內容：{{ tempProduct.description }}
              </p>
              <div class="h5" v-if="!tempProduct.origin_price">
                {{ tempProduct.price }} 元
              </div>
              <del class="h6" v-else-if="tempProduct.origin_price">
                原價 {{ tempProduct.origin_price }} 元
              </del>
              <div class="h5">
                現在只要 {{ tempProduct.price }} 元
              </div>
            </div>
            <div class="row">
              <div class="col-6"></div>
              <div class="col-6">
                <div class="input-group text-end mt-5">
                  <input type="number" min="0" class="form-control w-50"
                  v-model="NewQty">
                  <button class="btn btn-primary" type="button" @click="addProduct(tempProduct,NewQty)">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
            
            
          </div>
          
        </div>
      </div>
    </div>
  </div>`,
}