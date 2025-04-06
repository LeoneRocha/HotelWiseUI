import { IHotel } from "../../model/Hotel/IHotel";

export interface IHotelFormProps {
    hotel?: IHotel;
    onSave: () => void;
  } 