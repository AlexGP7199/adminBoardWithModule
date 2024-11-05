import { Component, OnInit } from '@angular/core';
import { startOfWeek, addDays, isSameDay } from 'date-fns';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekDates: { date: Date; status: string; reason?: string }[] = [];

  // Sample list of "Occupied" dates with reasons
  occupiedDates: { date: Date; reason: string }[] = [
    { date: new Date(2024, 10, 6), reason: "Team Meeting" }, // November 6, 2024
    { date: new Date(2024, 10, 8), reason: "Project Deadline" }  // November 8, 2024
  ];

  ngOnInit(): void {
    this.generateWeekDates();
  }
  generateWeekDates(): void {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 }); // Start the week on Sunday

    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(startOfWeekDate, i);
        const occupiedDetail = this.checkAvailability(currentDate);
        const status = occupiedDetail ? 'Occupied' : 'Available';
        const reason = occupiedDetail ? occupiedDetail.reason : undefined; // Set undefined if there's no reason

        this.weekDates.push({ date: currentDate, status, reason });
    }
}


  checkAvailability(date: Date): { date: Date; reason: string } | null {
    return this.occupiedDates.find(occupiedDate => isSameDay(occupiedDate.date, date)) || null;
  }
}
