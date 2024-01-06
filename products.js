import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path

const App = {
  data() {
    return { products: [], product: null };
  },
  methods: {
    checkDetail(id) {
      this.product = this.products.find((pro) => pro.id === id);
    },
    getProducts() {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => console.log(error));
    },
    checkAuth() {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((error) => {
          console.log(error);
          window.location.replace("/login.html");
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    axios.defaults.headers.common["Authorization"] = token;

    this.checkAuth();
  },
};

const app = createApp(App);
app.mount("#app");
