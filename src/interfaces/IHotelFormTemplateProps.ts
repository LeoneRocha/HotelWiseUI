import { IHotel } from "./IHotel";

export interface IHotelFormTemplateProps {
    formData: IHotel;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCancel: () => void;
    handleAutoFill: () => void;
    handleAddToVectorStore: () => void;
    setFormData: React.Dispatch<React.SetStateAction<IHotel>>;
  }
  