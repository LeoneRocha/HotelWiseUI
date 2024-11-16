import { IHotel } from "./IHotel";

export interface IHotelFormProps {
    hotel?: IHotel;
    onSave: () => void;
  } 