import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from './modules/shared/auth/adminGuard';
import { userGuard } from './modules/shared/auth/userGuard';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./modules/userModule/user.module').then(m => m.userModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/pages/pages.module').then(m => m.pagesModule),
    canActivate: [userGuard]
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./modules/adminModule/admin.module').then(m => m.adminModule),
  //   canActivate: [adminGuard]
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {

    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
  providers: [adminGuard, userGuard]
})
export class AppRoutingModule {

}
