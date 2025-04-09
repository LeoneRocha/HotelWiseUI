export enum RoomType {
    Single = 1,
    Double = 2,
    Suite = 3,
}
 
 export const RoomTypeDescriptions: Record<number, string> = {
    [RoomType.Single]: "Single",
    [RoomType.Double]: "Double",
    [RoomType.Suite]: "Suite", 
  };
  