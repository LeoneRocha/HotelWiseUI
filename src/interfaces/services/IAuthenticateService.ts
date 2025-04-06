// interfaces/IAuthenticateService.ts

import { IGetUserAuthenticatedDto, IServiceResponse, IUserLoginDto } from "../GeneralInterfaces";
 
export interface IAuthenticateService {
  authenticate(loginData: IUserLoginDto): Promise<IServiceResponse<IGetUserAuthenticatedDto>>;
}
