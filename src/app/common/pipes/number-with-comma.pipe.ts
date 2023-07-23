import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithComma'
})
export class NumberWithCommaPipe implements PipeTransform {

  transform(x: any) {
    let s = x.toString().trim().split('.');
    x = s[0];
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') {
      lastThree = ',' + lastThree;
    }
    if (s[1]) {
      if (s[1].length > 2) {
        return (
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree + '.00'
        );
      } else {
        return (
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          lastThree +
          '.' +
          s[1]
        );
      }
    } else {
      return otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
    }
  }

}
