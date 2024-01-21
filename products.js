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
    const tempProduct = ref({ imagesUrl: [] });
    const actionType = ref("");
    const totalPages = ref();
    const currentPage = ref();

    const getProducts = (toPage = 1) => {
      axios
        .get(`${url}/api/${path}/admin/products?page=${toPage}`)
        .then((res) => {
          products.value = res.data.products;
          totalPages.value = res.data.pagination.total_pages;
          currentPage.value = res.data.pagination.current_page;
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
        tempProduct.value = { imagesUrl: [] };

        productModal.show();
      }
      if (type === "edit") {
        actionType.value = "editProduct";

        tempProduct.value = { ...item };
        if (!item.imagesUrl) {
          tempProduct.value.imagesUrl = [];
        }
        tempProduct.value.imgUrl = "";
        productModal.show();
      }
      if (type === "delete") {
        actionType.value = "deleteProduct";
        tempProduct.value = { ...item };
        delProductModal.show();
      }
    };

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      axios.defaults.headers.common["Authorization"] = token;

      checkAuth();
    });

    return {
      actionType,
      showModal,
      tempProduct,
      products,
      getProducts,
      totalPages,
      currentPage,
    };
  },
};

const app = createApp(App);

// 分頁元件
app.component("pagination", {
  template: "#pagination",
  props: ["totalPages", "currentPage"],

  setup(props, { emit }) {
    const goToPage = (toPage) => {
      emit("goToPage", toPage);
    };

    return { goToPage };
  },
});

app.component("productModal", {
  template: "#productModal",
  props: ["actionType", "product", "test"],

  setup(props, { emit }) {
    const addPicToProduct = () => {
      props.product.imagesUrl.push(props.product.imgUrl);
      props.product.imgUrl = "";
    };
    const optProduct = () => {
      if (props.actionType === "addProduct") {
        axios
          .post(`${url}/api/${path}/admin/product`, { data: props.product })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            emit("updateProducts");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (props.actionType === "editProduct") {
        axios
          .put(`${url}/api/${path}/admin/product/${props.product.id}`, {
            data: props.product,
          })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            emit("updateProducts");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    const delpics = () => {
      props.product.imagesUrl = [];
    };

    onMounted(() => {
      productModal = new bootstrap.Modal(
        document.querySelector("#productModal")
      );

      delProductModal = new bootstrap.Modal(
        document.querySelector("#delProductModal")
      );
    });

    return { addPicToProduct, optProduct, delpics };
  },
});

app.component("delProductModal", {
  template: "#delProductModal",
  props: ["product"],

  setup(props, { emit }) {
    const delProduct = () => {
      axios
        .delete(`${url}/api/${path}/admin/product/${props.product.id}`)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((error) => console.log(error));
      delProductModal.hide();
      emit("updateProducts");
    };
    onMounted(() => {
      delProductModal = new bootstrap.Modal(
        document.querySelector("#delProductModal")
      );
    });

    return { delProduct };
  },
});

app.mount("#app");
