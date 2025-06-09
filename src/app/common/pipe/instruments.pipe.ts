import { Pipe, PipeTransform } from '@angular/core';
import { Instrument } from '../models/instrument';

@Pipe({
  name: 'instruments',
  standalone: true
})
export class InstrumentsPipe implements PipeTransform {

  transform(inst: Instrument[], searchValue: string): Instrument[] {
    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLocaleLowerCase();
      return inst.filter(item => {
        return item.symbol.toLocaleLowerCase().includes(lowerCaseSearchValue);
      });
    }

    return inst;
  }
}
