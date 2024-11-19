import { IHotel } from "./IHotel";

export interface HotelSearchTemplateProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    hotels: IHotel[];
    searched: boolean;
    error: string | null;
    loading: boolean;
    handleSearch: (e: React.FormEvent) => void;
  }
  