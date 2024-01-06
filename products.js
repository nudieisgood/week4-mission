import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path

const App = {
  setup() {
    const products = ref([]);
    const product = ref(null);

    const checkDetail = (id) => {
      product.value = products.value.find((pro) => pro.id === id);
    };

    const getProducts = async () => {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          console.log(res);
          products.value = res.data.products;
        })
        .catch((error) => console.dir(error));
    };

    const checkAuth = async () => {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          getProducts();
        })
        .catch((err) => {
          console.log(err);
          window.location.replace("/login.html");
        });
    };

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      axios.defaults.headers.common["Authorization"] = token;

      checkAuth();
    });

    return { products, product, checkDetail };
  },
};

const app = createApp(App);
app.mount("#app");
