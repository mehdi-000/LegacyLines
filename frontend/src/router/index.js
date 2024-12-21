import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/pages/Home.vue";
import Impressum from "../components/pages/Impressum.vue";
import Login from "../components/pages/Login.vue";
import FamilyTree from "../components/pages/FamilyTree.vue";
import NotFound from "../components/pages/NotFound.vue";
import Register from "@/components/pages/Register.vue";
import Profile from "@/components/pages/Profile.vue";
import SuchPerson from "@/components/pages/SuchPerson.vue";
import AGB from "@/components/pages/AGB.vue";
import Datenschutz from "@/components/pages/Datenschutz.vue";
import Requests from "@/components/pages/Requests.vue";
import chooseFamilyTree from "@/components/pages/chooseFamilyTree.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/aGB",
    name: "AGB",
    component: AGB,
  },
  {
    path: "/impressum",
    name: "Impressum",
    component: Impressum,
  },
  {
    path: "/datenschutz",
    name: "Datenschutz",
    component: Datenschutz,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/familytree/:familyTreeId",
    name: "FamilyTree",
    props: true,
    component: FamilyTree,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "/Profile",
    component: Profile,
  },
  {
    path: "/SuchPerson",
    name: "SuchPerson",
    component: SuchPerson,
  },
  {
    path: "/chooseFamilyTree",
    name: "chooseFamilyTree",
    component: chooseFamilyTree,
  },
  {
    path: "/requests",
    name: "Requests",
    component: Requests,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
