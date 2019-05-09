# TCM Core Library

## Installation

To install this library, run:

```bash
$ npm install tcm-base-grid --save
```

## Consuming your library


vipuldhaigude@gmail
npm user - tcmreg
password - tcm2619

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install tcm-grid --save
```

and then from your Angular `AppModule` module :

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { JQGridModule } from 'tcm-base-grid';


@NgModule({
    declarations: [
    ],
    imports: [
        JQGridModule    ],
    providers: [
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
}
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<jqGrid #grdRef="jqGrid" [dtOptions]="aggOrderOptions"
        [id]="table_id"
        [filterOptions]="filterOptions"
        [getData]="GetAggOrderData"
        [getSubData]="GetOrderData"
        [gridPersistence]="aggOrderPersistence"
        [getReferenceData]="GetReferenceData"
        (saveData)="Save($event)"
        (exportData)="ExportAggOrder($event)"
        [subGridOptions]="aggOrdersubOptions"
        (updatePersistence)="UpdatePersistence($event)">
</jqGrid>

```

## License
MIT � [vipul](mailto:vipul.dhaigude@tieto.com)
