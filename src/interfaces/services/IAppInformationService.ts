import { IAppInformation } from "../IAppInformation";


export interface IAppInformationService {
  getAppInformationVersionProduct(): Promise<IAppInformation[]>;
}
