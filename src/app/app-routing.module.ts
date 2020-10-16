import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ComingSoonPage } from './pages/coming-soon/coming-soon.page';
import { HomePage } from './pages/home/home.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

const routes: Routes = [
  { path: '',                        data: { state: "root" }, redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',                    data: { state: "home" }, component: HomePage },
  { path: 'soon',                    data: { state: "home" }, component: ComingSoonPage },
  { path: '**',                          data: { state: "404" }, component: NotFoundPage }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
