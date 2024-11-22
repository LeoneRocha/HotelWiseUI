import React from 'react'; 
export interface LoginFormTemplateProps {
  username: string;
  password: string;
  rememberMe: boolean;
  error: string | null;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAzureLogin: () => void;
}
