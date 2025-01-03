export interface ITokenVO {
  authenticated: boolean;
  created: string;
  expiration: string;
  accessToken: string;
  refreshToken: string;
}

export interface IGetUserAuthenticatedDto {
  name: string;
  language: string;
  tokenAuth: ITokenVO;
  medicalId?: number;
}

export interface IServiceResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: Array<IErrorResponse>;
  unauthorized: boolean;
}

export interface IUserLoginDto {
  login: string;
  password: string;
}

export interface IErrorResponse {
  message?: string;
  name?: string;
  errorCode?: string;
}