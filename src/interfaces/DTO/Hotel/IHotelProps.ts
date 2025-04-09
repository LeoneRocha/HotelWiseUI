import { RoomStatus } from "../../../enums/hotel/RoomStatus";
import { IHotel } from "../../model/Hotel/IHotel";
import { IRoom } from "../../model/Hotel/IRoom";

export interface HotelTabsProps {
  hotelId: number | null
  hotel: IHotel | null;
}

export interface RoomFormProps {
  hotelId: number;
  room: IRoom | null;
  onClose: () => void;
}

export interface RoomListProps {
  hotelId: number;
  hotel: IHotel | null;
}
export interface RoomListTemplateProps {
  rooms: IRoom[];
  loading: boolean;
  showForm: boolean;
  selectedRoom: IRoom | null;
  hotelId: number;
  hotel: IHotel | null;
  onAddRoom: () => void;
  onEditRoom: (room: IRoom) => void;
  onDeleteRoom: (roomId: number) => void;
  onFormClose: () => void;
  getRoomTypeName: (type: number) => string;
  getRoomStatusBadge: (status: RoomStatus) => JSX.Element;
}

export interface RoomListProps {
  hotelId: number;
}

export interface RoomFormProps {
  hotelId: number;
  room: IRoom | null;
  onClose: () => void;
}

export interface RoomFormTemplateProps {
  formData: IRoom;
  validated: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}