import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize',
  standalone: true
})
export class HumanizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Replace underscores and hyphens with spaces
    let result = value.replace(/[_-]/g, ' ');

    // Handle specific activity actions
    if (result.includes('WISHLIST')) return 'Added to Wishlist';
    if (result.includes('APPLIED')) return 'Application Submitted';
    if (result.includes('INTERVIEWING')) return 'Interview Scheduled';
    if (result.includes('OFFERED')) return 'Received Offer';
    if (result.includes('REJECTED')) return 'Application Not Selected';
    if (result.includes('UPDATED')) return 'Details Updated';

    // For any other text, capitalize first letter of each word
    return result.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}