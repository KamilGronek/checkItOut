import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CollaborationCalendarService {
  @Output() warningChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  setCurrentTime() {
    const currentDate = new Date();

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
  }

  formatDate(date: Date, currentTime: string): string {
    if (!date) return null;

    const pad = (num: number) => num.toString().padStart(2, '0');
    const [hours, minutes, seconds] = currentTime.split(':');

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
      `${hours}:${minutes}:${seconds}`
    );
  }
}
