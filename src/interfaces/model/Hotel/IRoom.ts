import { RoomStatus } from "../../../enums/hotel/RoomStatus";
import { RoomType } from "../../../enums/hotel/RoomType";
 
export interface IRoom {
  id: number;
  hotelId: number;
  roomType: RoomType;
  capacity: number;
  name: string;
  description: string;
  status: RoomStatus;
  minimumNights: number;
  createdDate?: Date;
  modifyDate?: Date;
}
