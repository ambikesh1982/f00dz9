import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimpipe'
})
export class TrimpipePipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
        return '';
    }

    return value.replace(/\s/g, "");
}

}
