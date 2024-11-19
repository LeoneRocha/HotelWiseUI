export interface LoginFormTemplateProps {
    username: string;
    password: string;
    error: string | null;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onAzureLogin: () => void;
  }