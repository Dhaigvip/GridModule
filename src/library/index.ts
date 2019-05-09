import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, RequestOptions, Http } from '@angular/http';
import { jqGrid } from './components/tcmcore.jqgrid.component';
import { JQGridUtilities } from './components/tcmcore.jqgrid.Utilities';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

export * from './components/tcmcore.jqgrid.columndef';
export * from './components/tcmcore.jqgrid.component';
export * from './components/tcmcore.jqgrid.datecoldef';
export * from './components/tcmcore.jqgrid.objects';
export * from './components/tcmcore.jqgrid.Utilities';
export * from './Shared/tcmcore.grid.objects'

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}


@NgModule({
    imports: [
        CommonModule,       
        FormsModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    providers: [JQGridUtilities],
    declarations: [
        jqGrid
    ],
    exports: [
        jqGrid
        , TranslateModule
    ]
})
export class JQGridModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: JQGridModule
        };
    }
}
