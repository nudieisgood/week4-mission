import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path

const App = {
  data() {
    return {
      user: { username: "", password: "" },
      errorMsg: "",
    };
  },
  methods: {
    login() {
      axios
        .post(`${url}/admin/signin`, this.user)
        .then((res) => {
          const token = res.data.token;
          const exp = res.data.expired;
          document.cookie = `token=${token}`;
          document.cookie = `expDate=${exp}`;
          window.location.replace("/products.html");
        })
        .catch((error) => {
          this.errorMsg = error.data.message;
        });
    },
  },
};

const app = createApp(App);
app.mount("#app");
