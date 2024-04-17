import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToIndianTime'
})
export class UtcToIndianTimePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (!value) return '';

    const utcTime = new Date(value);
    const indianTime = new Date(utcTime);
    indianTime.setHours(indianTime.getHours() + 5); // Adding 5 hours for IST
    indianTime.setMinutes(indianTime.getMinutes() + 30); // Adding 30 minutes for IST

    const options = {
      hour12: true,
      hour: 'numeric' as const, // Specify 'numeric' instead of 'string'
      minute: 'numeric' as const,
      // second: 'numeric' as const
    };

    return indianTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...options });
  }

}
