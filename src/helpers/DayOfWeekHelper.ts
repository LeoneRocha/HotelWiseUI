import { DotNetDayOfWeek } from "../enums/DotNetDayOfWeek";



/**
 * Helper class to convert between localized weekday names and .NET DayOfWeek enum values
 */
export class DayOfWeekHelper {
  /**
   * Creates a mapping between localized weekday names and .NET DayOfWeek enum values
   * @param weekDays Array of localized weekday names
   * @returns Object mapping localized day names to .NET DayOfWeek enum values
   */
  public static createWeekDayToDotNetMap(weekDays: string[]): { [key: string]: DotNetDayOfWeek } {
    const map: { [key: string]: DotNetDayOfWeek } = {};

    // Get the first day of a week and map each day to the corresponding .NET enum
    const date = new Date();
    const firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); // Start with Sunday

    weekDays.forEach((localizedDay, index) => {
      const dayDate = new Date(firstDayOfWeek);
      dayDate.setDate(firstDayOfWeek.getDate() + index);
      const dotNetDayValue = dayDate.getDay() as DotNetDayOfWeek;
      map[localizedDay] = dotNetDayValue;
    });

    return map;
  }

  /**
   * Converts a localized weekday name to .NET DayOfWeek enum value
   * @param localizedDay Localized weekday name
   * @param weekDayMap Mapping between localized day names and .NET enum values
   * @returns The corresponding .NET DayOfWeek enum value
   */
  public static toDotNetDayOfWeek(localizedDay: string, weekDayMap: { [key: string]: DotNetDayOfWeek }): DotNetDayOfWeek {
    return weekDayMap[localizedDay] ?? DotNetDayOfWeek.Sunday; // Default to Sunday if not found
  }

  /**
   * Finds the localized weekday name that corresponds to a .NET DayOfWeek enum value
   * @param dotNetDayOfWeek .NET DayOfWeek enum value
   * @param weekDays Array of localized weekday names
   * @param weekDayMap Mapping between localized day names and .NET enum values
   * @returns The corresponding localized weekday name
   */
  public static toLocalizedDay(
    dotNetDayOfWeek: DotNetDayOfWeek,
    weekDays: string[],
    weekDayMap: { [key: string]: DotNetDayOfWeek }
  ): string {
    // Find the localized day name that corresponds to the .NET enum value
    const localizedDay = weekDays.find(day => weekDayMap[day] === dotNetDayOfWeek);
    return localizedDay ?? weekDays[0]; // Default to first day if not found
  }
}
