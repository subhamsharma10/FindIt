import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name:'dateText',standalone:true})
export class DateTextPipe implements PipeTransform {
  transform(value:string|Date):string {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  }
}
