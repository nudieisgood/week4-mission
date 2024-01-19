import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path
let productModal;
let delProductModal;

const App = {
  setup() {
    const products = ref([]);
    const product = ref({ imagesUrl: [] });
    const actionType = ref("");

    const getProducts = () => {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          console.log(res);
          products.value = res.data.products;
        })
        .catch((error) => console.log(error));
    };

    const checkAuth = () => {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          getProducts();
        })
        .catch((error) => {
          console.log(error);
          window.location = "index.html";
        });
    };

    const showModal = (type, item) => {
      if (type === "add") {
        actionType.value = "addProduct";
        product.value = { imagesUrl: [] };

        productModal.show();
      }
      if (type === "edit") {
        actionType.value = "editProduct";

        product.value = { ...item };
        if (!item.imagesUrl) {
          product.value.imagesUrl = [];
        }
        product.value.imgUrl = "";
        productModal.show();
      }
      if (type === "delete") {
        actionType.value = "deleteProduct";
        product.value = { ...item };
        delProductModal.show();
      }
    };

    const optProduct = () => {
      if (actionType.value === "addProduct") {
        console.log(product.value);
        axios
          .post(`${url}/api/${path}/admin/product`, { data: product.value })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            getProducts();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (actionType.value === "editProduct") {
        axios
          .put(`${url}/api/${path}/admin/product/${product.value.id}`, {
            data: product.value,
          })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            getProducts();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    const addPicToProduct = () => {
      product.value.imagesUrl.push(product.value.imgUrl);
      product.value.imgUrl = "";
    };

    const delProduct = () => {
      axios
        .delete(`${url}/api/${path}/admin/product/${product.value.id}`)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((error) => console.log(error));
      delProductModal.hide();
      getProducts();
    };

    const delpics = () => {
      product.value.imagesUrl = [];
    };

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      axios.defaults.headers.common["Authorization"] = token;

      checkAuth();

      productModal = new bootstrap.Modal(
        document.querySelector("#productModal")
      );

      delProductModal = new bootstrap.Modal(
        document.querySelector("#delProductModal")
      );
    });

    return {
      delpics,
      addPicToProduct,
      actionType,
      delProduct,
      showModal,
      optProduct,
      product,
      products,
    };
  },
};

const app = createApp(App);
app.mount("#app");
