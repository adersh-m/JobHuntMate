import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumLabel',
  standalone: true
})
export class EnumLabelPipe implements PipeTransform {
  private jobTypeMap: Record<string, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship'
  };

  private statusMap: Record<string, string> = {
    WISHLIST: 'Wishlist',
    APPLIED: 'Applied',
    INTERVIEWING: 'Interviewing',
    OFFERED: 'Offered',
    REJECTED: 'Rejected'
  };

  transform(value: string, type: 'jobType' | 'status'): string {
    if (type === 'jobType') return this.jobTypeMap[value] || value;
    if (type === 'status') return this.statusMap[value] || value;
    return value;
  }
}
