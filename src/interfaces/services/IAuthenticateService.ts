// interfaces/IAuthenticateService.ts

import { IGetUserAuthenticatedDto, IServiceResponse, IUserLoginDto } from "../IAuthTypes";
 
export interface IAuthenticateService {
  authenticate(loginData: IUserLoginDto): Promise<IServiceResponse<IGetUserAuthenticatedDto>>;
}
