export interface TokenVO {
    authenticated: boolean;
    created: string;
    expiration: string;
    accessToken: string;
    refreshToken: string;
  }
  
  export  interface GetUserAuthenticatedDto {
    name: string;
    language: string;
    tokenAuth: TokenVO;
    medicalId?: number;
  }
  
  export interface ServiceResponse<T> {
    data: T;
    success: boolean;
    message: string;
    errors: Array<any>;
    unauthorized: boolean;
  }
  
  export interface UserLoginDto {
    login: string;
    password: string;
  }