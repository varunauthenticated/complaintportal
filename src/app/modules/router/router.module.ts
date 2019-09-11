import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "../login/components/login.component";
import { ROUTER_PATHS } from "./router-paths";
import { LogoutComponent } from "../logout/components/logout.component";
import { HOME_ROUTES } from "./home-router.module";
import { DashboardBothComponent } from "../dashboard-both/components/dashboard-both.component";

export const APP_ROUTES: Routes = [
  { path: "", redirectTo: ROUTER_PATHS.LoginRouter, pathMatch: "full" },
  { path: ROUTER_PATHS.LoginRouter, component: LoginComponent },
  // { path: '/', redirectTo: ROUTER_PATHS.LoginRouter, pathMatch: 'full' },
  { path: ROUTER_PATHS.LogoutRouter, component: LogoutComponent },
  {
    //dashboard both
    path: ROUTER_PATHS.DashboardBothRouter,
    component: DashboardBothComponent
  },
  ...HOME_ROUTES
];

export const ROUTER_MODULE = RouterModule.forRoot(APP_ROUTES, {
  useHash: true
});
