import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'htmlHandle',
})
export class HtmlHandlePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(entry: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(entry);
  }
}
