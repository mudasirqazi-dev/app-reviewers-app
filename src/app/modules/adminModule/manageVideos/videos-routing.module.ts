import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { allVideosComponent } from './allVideos/allVideos.component';

const routes: Routes = [
  { path: 'all', component: allVideosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class videosRoutingModule { }

export const routedComponents = [
  allVideosComponent,
];
