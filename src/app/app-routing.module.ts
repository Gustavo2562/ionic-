import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'list-jogador', loadChildren: './pages/list-jogador/list-jogador.module#ListJogadorPageModule' },
  { path: 'perfil-jogador', loadChildren: './pages/perfil-jogador/perfil-jogador.module#PerfilJogadorPageModule' },
  // { path: 'add-jogador', loadChildren: './pages/add-jogador/add-jogador.module#AddJogadorPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
