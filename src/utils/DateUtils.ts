import {Injectable} from "@nestjs/common"
import { format } from 'date-fns'
import type { DayName } from '../types/util-types'



@Injectable()
export class DateUtils {

    dayMap: Record<DayName, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6, 
    }


    getDaysInCurrentMonth(dayOfTheMonth: Date, dayName: DayName) {
        const currentMonth = dayOfTheMonth.getMonth()
        const currentYear = dayOfTheMonth.getFullYear()
        const days: string[] = []
      
        for (let day = 1; day <= 31; day++) {
          const date = new Date(currentYear, currentMonth, day)
          if (date.getMonth() === currentMonth && date.getDay() === this.dayMap[dayName]) {
            // Day 6 corresponds to Saturday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
            days.push(format(date, 'yyyy-MM-dd'))
          }
        }
      
        return days
      }
      
}