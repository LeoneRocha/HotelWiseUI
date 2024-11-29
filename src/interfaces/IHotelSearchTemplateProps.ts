import { IServiceResponse } from "./IAuthTypes";
import { IHotelSemanticResult } from "./IHotelSemanticResult";
     
export interface IHotelSearchTemplateProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  serviceResponse: IServiceResponse<IHotelSemanticResult> | null;
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
