import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../shared/auth/adminGuard';
import { adminPanelComponent } from './adminPanel/adminPanel.component';



const routes: Routes = [
  { path: '', component: adminPanelComponent },

  // {
  //   path: 'setting',
  //   loadChildren: () => import('./settings/manageprofile.module').then(m => m.manageProfileModule),
  //   canActivate: [adminGuard]
  // },
  {
    path: 'users',
    loadChildren: () => import('./manageUsers/users.module').then(m => m.usersModule),
    canActivate: [adminGuard]
  },
  // {
  //   path: 'videos',
  //   loadChildren: () => import('./manageVideos/videos.module').then(m => m.videosModule),
  //   canActivate: [adminGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
  providers: [adminGuard]
})
export class adminRoutingModule { }

export const routedComponents = [
  adminPanelComponent,


];
