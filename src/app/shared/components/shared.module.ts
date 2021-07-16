import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';

import { SpinnerModule } from './spinner/spinner.module';
import { HeaderModule } from './header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        MatTableModule,
        MatChipsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatTabsModule,
        MatNativeDateModule,
        MatCardModule,
        MatSnackBarModule,
        MatIconModule,
        MatStepperModule,
        MatSliderModule,
        SpinnerModule,
        HeaderModule
    ],
    exports: [
        FormsModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatNativeDateModule,
        MatChipsModule,
        MatDatepickerModule,
        MatCardModule,
        MatSnackBarModule,
        MatIconModule,
        MatStepperModule,
        MatSliderModule,
        SpinnerModule,
        HeaderModule
    ]
})
export class SharedModule {
}
