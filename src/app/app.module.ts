import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { RouterModule, Route, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockService } from './Data/app.mockservice';
import { AppComponent } from './app.component';
import { TCMCoreModule } from 'tcm-base-module';
import { JQGridModule } from '../library/index';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { AppBootstrap } from "tcm-base-module";
//import { environment } from "environments/environment";

export function startupServiceFactory(startupService: AppBootstrap): Function {
    return () => startupService.Bootstrap("TCMJQGridModule");
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,       
        TCMCoreModule,
        JQGridModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            name: 'CCM',
            maxAge: 25,
            logOnly: false,
        }),
        EffectsModule.forRoot([]),
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'sv-SE' },
        MockService,
        //{
        //    provide: APP_INITIALIZER,
        //    useFactory: startupServiceFactory,
        //    multi: true,
        //    deps: [AppBootstrap]
        //}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
