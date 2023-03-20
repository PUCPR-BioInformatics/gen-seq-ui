import { Pipe, PipeTransform } from '@angular/core';
import { ProcessStepEnum } from '../../../genesis/shared/enum/process-step-enum';

@Pipe({name: 'StringNormalizePipe'})
export class StringNormalizePipe implements PipeTransform {
    private translator = {
        WAITING: "Waiting",
        REFERENCE: "Genoma Download",
        FASTQ_DUMP_DNA: "DNA Sample Download",
        FASTQ_DUMP_RNA: "RNA Sample Download",
        ALIGNING_DNA: "DNA Alignment",
        ALIGNING_RNA: "RNA Alignment",
        EXTRACT_DNA: "DNA Extraction",
        EXTRACT_RNA: "RNA Extraction",
        ANALYSING: "Analysis",
        COMPLETE: "Completed"
    }
    public transform(value: string): string {
        if (ProcessStepEnum[value]) {
            return this.translator[value];
        } else {
            let valueAjusted = value.toLowerCase().replace(/_/g, ' ');
            valueAjusted = valueAjusted.charAt(0).toUpperCase() + valueAjusted.slice(1);
            return valueAjusted;
        }
    }
}
