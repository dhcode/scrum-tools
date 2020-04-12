import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlineStatus',
  pure: false,
})
export class OnlineStatusPipe implements PipeTransform {
  transform(value): 'online' | 'pending' | 'offline' {
    const valueTime = new Date(value).getTime();
    const now = new Date().getTime();
    if (now - valueTime <= 15000) {
      return 'online';
    }
    if (now - valueTime <= 30000) {
      return 'pending';
    }
    return 'offline';
  }
}
