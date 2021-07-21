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
        WAITING: "Aguardando",
        FASTQ_DUMP_DNA: "Buscando amostra DNA",
        FASTQ_DUMP_RNA: "Buscando amostra RNA",
        ALIGNING_DNA: "Alinhando: DNA",
        ALIGNING_RNA: "Alinhando: RNA",
        ANALYSING: "Analisando",
        COMPLETE: "Concluído"
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