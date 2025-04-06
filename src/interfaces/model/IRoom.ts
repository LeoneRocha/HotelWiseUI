import { RoomStatus } from "../../enums/hotel/RoomStatus";
import { RoomType } from "../../enums/hotel/RoomType";
 
export interface IRoom {
  id: number;
  hotelId: number;
  roomType: RoomType;
  capacity: number;
  description: string;
  status: RoomStatus;
  minimumNights: number;
  createdDate: string;
  modifyDate: string;
}
