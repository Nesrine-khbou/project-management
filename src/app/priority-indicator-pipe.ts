import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityIndicator',
  standalone: true
})
export class PriorityIndicatorPipe implements PipeTransform {

  transform(priority: string): string {
    if (!priority) return 'bg-gray-300';

    const p = priority.toLowerCase().trim();

    const indicators: Record<string, string> = {
      'haute': 'bg-red-400',
      'moyenne': 'bg-amber-200',
      'basse': 'bg-green-500'
    };

    return indicators[p] || 'bg-gray-300';
  }
}
