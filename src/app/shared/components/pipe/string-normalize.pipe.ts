import { Pipe, PipeTransform } from '@angular/core';
import { GenesisProcessStepEnum } from '../../../genesis/shared/enum/genesis-process-step.enum';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'StringNormalizePipe'})
export class StringNormalizePipe implements PipeTransform {
    private translator = {
        WAITING: "Aguardar",
        REFERENCE: "Download: Genoma",
        FASTQ_DUMP_DNA: "Download: Amostra DNA",
        FASTQ_DUMP_RNA: "Download: Amostra RNA",
        ALIGNING_DNA: "Alinhar: DNA",
        ALIGNING_RNA: "Alinhar: RNA",
        ANALYSING: "Análise",
        COMPLETE: "Encerramento"
    }
    public transform(value: string): string {
        if (GenesisProcessStepEnum[value]) {
            return this.translator[value];
        } else {
            let valueAjusted = value.toLowerCase().replace(/_/g, ' ');
            valueAjusted = valueAjusted.charAt(0).toUpperCase() + valueAjusted.slice(1);
            return valueAjusted;
        }
    }
}
