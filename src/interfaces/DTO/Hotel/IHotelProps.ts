import { IRoom } from "../../model/Hotel/IRoom";

export interface HotelTabsProps {
  hotelId: number | null
}

export interface RoomFormProps {
  hotelId: number;
  room: IRoom | null;
  onClose: () => void;
}