import {
  createApp,
  ref,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點

const App = {
  setup() {
    const user = ref({ username: "", password: "" });
    const errorMsg = ref("");

    const login = async () => {
      axios
        .post(`${url}/admin/signin`, user.value)
        .then((res) => {
          const token = res.data.token;
          const exp = res.data.expired;
          console.log(token);
          document.cookie = `token=${token}`;
          document.cookie = `expDate=${exp}`;
          window.location = "products.html";
        })
        .catch((error) => {
          console.log(error);
          errorMsg.value = error.data.message;
        });
    };

    return { user, login, errorMsg };
  },
};

const app = createApp(App);
app.mount("#app");
