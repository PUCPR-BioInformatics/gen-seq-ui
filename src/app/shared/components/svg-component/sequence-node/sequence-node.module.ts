import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SequenceNodeComponent } from './sequence-node.component';

@NgModule({
    declarations: [
        SequenceNodeComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SequenceNodeComponent
    ]
})
export class SequenceNodeModule { }
