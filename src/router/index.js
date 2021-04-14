import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import RouteChange from "../components/mainPage/RouteChange";
import ProjectPackage from "../components/mainPage/ProjectPackage";
import PackageList from "../components/mainPage/packageList/PackageList";
import LogcatQuery from "../components/mainPage/LogcatQuery";
import UserBehavior from "../components/mainPage/UserBehavior";
import CheckReport from "../components/mainPage/CheckReport";
import HtmlInner from "../components/generate/HtmlInner";
import CrmMenu from "../components/mainPage/crm/CrmMenu";
import CrmPreViewer from "../components/mainPage/crm/CrmPreViewer";
import Login from "../components/Login";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: "/routeChange",
          name: "RouteChange",
          component: RouteChange,
        },
        {
          path: "/pm",
          name: "pm",
          component: ProjectPackage,
        },
        {
          path: "/pkgList",
          name: "pkgList",
          component: PackageList,
        },
        {
          path: "/LogcatQuery",
          name: "LogcatQuery",
          component: LogcatQuery,
        },
        {
          path: "/UserBehavior",
          name: "UserBehavior",
          component: UserBehavior,
        }, {
          path: "/CheckReport",
          name: "CheckReport",
          component: CheckReport,
        },
        {
          path: "/HtmlInner",
          name: "HtmlInner",
          component: HtmlInner,
        }, {
          path: "/CrmMenu",
          name: "CrmMenu",
          component: CrmMenu,
        }, {
          path: "/CrmPreViewer",
          name: "CrmPreViewer",
          component: CrmPreViewer,
        }
      ],
    },
    {
      path: "/Login",
      name: "Login",
      component: Login,

    }

  ]
})
