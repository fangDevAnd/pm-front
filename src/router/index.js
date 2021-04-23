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
import AutoTest from "../components/mainPage/autoTest/AutoTest";
import TestProject from "../components/mainPage/autoTest/TestProject";
import AutoTestList from "../components/mainPage/autoTest/AutoTestList";
import TestItemList from "../components/mainPage/autoTest/TestItemList";
import AutoTestBatch from "../components/mainPage/autoTest/AutoTestBatch";
import ComplexMultTaskPipeline from "../components/mainPage/autoTest/ComplexMultTaskPipeline";
import TableGenerator from "../components/code/TableGenerator";
import TestTable from "../components/code/TestTable";


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
        }, {
          path: "/AutoTest",
          name: "AutoTest",
          component: AutoTest,
        },
        {
          path: "/TestProject",
          name: "TestProject",
          component: TestProject,
        },
        {
          path: "/AutoTestList",
          name: "AutoTestList",
          component: AutoTestList,
        },//
        {
          path: "/TestItemList",
          name: "TestItemList",
          component: TestItemList,
        },
        {
          path: "/AutoTestBatch",
          name: "AutoTestBatch",
          component: AutoTestBatch,
        },
        {
          path: "/ComplexMultTaskPipeline",
          name: "ComplexMultTaskPipeline",
          component: ComplexMultTaskPipeline,
        }, {
          path: "/TableGenerator",
          name: "TableGenerator",
          component: TableGenerator,
        }, {
          path: "/TestTable",
          name: "TestTable",
          component: TestTable,
        },
      ],
    },
    {
      path: "/Login",
      name: "Login",
      component: Login,

    }

  ]
})
