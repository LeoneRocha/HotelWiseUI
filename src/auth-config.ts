import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: 'f2eb5d9c-f553-4f8b-a539-f5a396a62092',
    authority: 'https://login.microsoftonline.com/e054ddc0-6326-41a4-b944-7bff0fd9cf07',
    redirectUri: 'http://localhost:5173/callback'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};

// Can be found in the API Permissions of the ASP.NET Web API
export const loginApiRequest = {
  scopes: ["api://f2eb5d9c-f553-4f8b-a539-f5a396a62092/api.scope"],//RESTCLIENT
};

export const nameStorageTokenAzureAD: string = 'Authorization_Token_AzureAD';