import React from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import Loader from "./shared/Loader";
import LayoutBlank from "./shared/layouts/LayoutBlank";

// Layouts
import LayoutWithoutSidenav from "./shared/layouts/LayoutWithoutSidenav";

// Lazy load component
const lazy = cb =>
  loadable(() => pMinDelay(cb(), 200), { fallback: <Loader /> });

// ---
// Default application layout

export const DefaultLayout = LayoutWithoutSidenav;

// ---
// Document title template

export const titleTemplate = "%s - Case Tracker";

// ---
// Routes
//
// Note: By default all routes use { "exact": true }. To change this
// behaviour, pass "exact" option explicitly to the route object

export const defaultRoute = "/login";
export const authRoutes = [
  {
    path: "/register",
    component: lazy(() => import("./containers/pages/Authentication/Register")),
    layout: LayoutBlank
  },
  {
    path: "/login",
    component: lazy(() => import("./containers/pages/Authentication/Login")),
    layout: LayoutBlank
  }
];

export const routes = [
  {
    path: "/",
    component: lazy(() => import("./containers/Home"))
  },
  {
    path: "/records",
    component: lazy(() => import("./containers/pages/records"))
  },
  {
    path: "/contacts",
    component: lazy(() => import("./containers/pages/contacts"))
  },
  {
    path: "/add-record",
    component: lazy(() => import("./containers/pages/records/AddRecord"))
  },
  {
    path: "/add-contact",
    component: lazy(() => import("./containers/pages/contacts/AddContact"))
  }
];
