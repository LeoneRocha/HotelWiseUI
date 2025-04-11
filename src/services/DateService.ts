import moment from 'moment';   



class DateService {
  public static getLocalizedWeekdays(locale: string = 'pt-br'): string[] {
    // Configura o locale do moment
    moment.locale(locale);
    
    // Obtém os nomes dos dias da semana abreviados
    const weekdays = [];
    
    // Começa com segunda-feira (1) até domingo (7)
    for (let i = 1; i <= 7; i++) {
      weekdays.push(moment().day(i).format('ddd'));
    }
    
    return weekdays;
  }

  public static formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
    return moment(date).format(format);
  }

  public static parseDate(dateString: string): Date | null {
    const parsed = moment(dateString);
    return parsed.isValid() ? parsed.toDate() : null;
  }

  public static isValidDateRange(startDate: string, endDate: string): boolean {
    if (!startDate || !endDate) return false;
    
    const start = moment(startDate);
    const end = moment(endDate);
    
    return start.isValid() && end.isValid() && start.isSameOrBefore(end);
  }
}

export default DateService;
