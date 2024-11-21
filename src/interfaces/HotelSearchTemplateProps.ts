import { ServiceResponse } from "./authTypes";
import { IHotelSemanticResult } from "./IHotelSemanticResult";
     
export interface HotelSearchTemplateProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  serviceResponse: ServiceResponse<IHotelSemanticResult> | null;
  searched: boolean;
  error: string | null;
  loading: boolean;
  handleSearch: (e: React.FormEvent) => void;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  tags: string[];
  selectedTags: string[];
  handleTagChange: (tag: string) => void;
}
