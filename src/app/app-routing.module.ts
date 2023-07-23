import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './common/components/layouts/content/content.component';
import { FullComponent } from './common/components/layouts/full/full.component';
import { content } from './common/routes/content.routes';
import { full } from './common/routes/full.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    children: full,
  },
  {
    path: '',
    component: ContentComponent,
    children: content,
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
