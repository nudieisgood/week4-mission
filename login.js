import {
  createApp,
  ref,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path

const App = {
  setup() {
    const user = ref({ username: "", password: "" });

    const login = async () => {
      axios
        .post(`${url}/admin/signin`, user.value)
        .then((res) => {
          const token = res.data.token;
          const exp = res.data.expired;
          document.cookie = `token=${token}`;
          document.cookie = `expDate=${exp}`;
          window.location.replace("/products.html");
        })
        .catch((error) => console.log(error));
    };

    return { user, login };
  },
};

const app = createApp(App);
app.mount("#app");
