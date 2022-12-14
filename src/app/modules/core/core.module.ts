import { NgModule } from "@angular/core";
import { ApiService, BitApiService } from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from "@angular/material/dialog";

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
// import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

const material = [

]

const appModules = [
    FormsModule, ReactiveFormsModule, MatChipsModule, MatFormFieldModule, MatAutocompleteModule, MatIconModule,
    MatTabsModule
]

const materialModules = [
    MatDialogModule, MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule, MatInputModule, MatFormFieldModule,
    MatCheckboxModule, MatGridListModule, MatTableModule, MatPaginatorModule, MatCardModule
]

const plugins = [

]
@NgModule({
    imports: [materialModules, plugins,
        appModules],
    exports: [materialModules, plugins,
        appModules],
    providers: [ApiService,BitApiService]
})
export class CoreModule { }
