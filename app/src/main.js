<<<<<<< HEAD
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

/**styling */
// import "./style.css";
import "./assets/tailwind.css"; //tailwind

/**setup fake backend */
import { fakeBackend } from "./helpers";
fakeBackend();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
=======
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

createApp(App).use(router).mount('#app');
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
