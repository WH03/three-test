import { createApp } from "vue";
import "@/style/style.scss";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store";
const app = createApp(App);

app.use(router);
app.use(store);
app.mount("#app");
