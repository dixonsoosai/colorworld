import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'formula', data: { breadcrumb: 'Esdee Formula' }, 
            loadChildren: () => import('./formula/formula.module').then(m => m.FormulaModule) },
        { path: 'tinter-converter', data: { breadcrumb: 'Tinter Converter' }, 
            loadChildren: () => import('./formula-converter/formula-converter.module').then(m => m.FormulaConverterModule) },
        { path: '**', redirectTo: '/home/formula', pathMatch: 'full' },
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
