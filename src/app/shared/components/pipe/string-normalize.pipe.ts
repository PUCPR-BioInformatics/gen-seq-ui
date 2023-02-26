import { Pipe, PipeTransform } from '@angular/core';
import { ProcessStepEnum } from '../../../genesis/shared/enum/process-step-enum';

@Pipe({name: 'StringNormalizePipe'})
export class StringNormalizePipe implements PipeTransform {
    private translator = {
        WAITING: "Aguardar",
        REFERENCE: "Download do Genoma",
        FASTQ_DUMP_DNA: "Download da amostra de DNA",
        FASTQ_DUMP_RNA: "Download da amostra de RNA",
        ALIGNING_DNA: "Alinhamento do DNA",
        ALIGNING_RNA: "Alinhamento do RNA",
        EXTRACT_DNA: "Extrair diferenças do DNA",
        EXTRACT_RNA: "Extrair diferenças do RNA",
        ANALYSING: "Análise",
        COMPLETE: "Encerramento"
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
