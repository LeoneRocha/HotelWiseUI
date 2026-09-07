import { IHotel } from "../../model/Hotel/IHotel";

export interface ISyncFeedback {
  message: string;
  type: 'success' | 'danger' | 'warning';
  details?: string[];
}

export interface IHotelListErrorInfo {
  userMessage: string;
  technicalDetails?: string;
  traceId?: string;
  statusCode?: number;
}

export interface IHotelListTemplateProps {
  hotels: IHotel[];
  totalHotels: number;
  currentPage: number;
  hotelsPerPage: number;
  handleDelete: (id: number) => void;
  paginate: (pageNumber: number) => void;
  filter: string;
  handleFilterChange: (filterValue: string) => void;
  handleSyncAllToVectorStore?: () => void;
  isSyncing?: boolean;
  syncFeedback?: ISyncFeedback | null;
  onDismissSyncFeedback?: () => void;
  errorInfo?: IHotelListErrorInfo | null;
  onRetry?: () => void;
}
  