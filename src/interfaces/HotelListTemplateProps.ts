import { IHotel } from "./IHotel";

export interface HotelListTemplateProps {
    hotels: IHotel[];
    totalHotels: number;
    currentPage: number;
    hotelsPerPage: number;
    handleDelete: (id: number) => void;
    paginate: (pageNumber: number) => void;
    filter: string;
    handleFilterChange: (filterValue: string) => void;
  }
  