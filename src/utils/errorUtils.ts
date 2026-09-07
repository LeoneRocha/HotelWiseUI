export interface IExtractedErrorInfo {
  userMessage: string;
  technicalDetails?: string;
  statusCode?: number;
  traceId?: string;
  code?: string;
  errorList: string[];
}

/**
 * Extrai informações detalhadas de erro a partir de exceções do Axios ou da API.
 */
export const extractErrorInfo = (err: unknown, defaultMessage = 'Ocorreu um erro na operação.'): IExtractedErrorInfo => {
  if (!err) {
    return { userMessage: defaultMessage, errorList: [] };
  }

  const anyErr = err as any;
  const responseData = anyErr?.response?.data;
  const statusCode = anyErr?.response?.status;
  const traceId = responseData?.traceId || responseData?.correlationId || anyErr?.correlationId;

  const errorList: string[] = [];
  let mainCode: string | undefined;

  // 1. Array de erros no formato ServiceResponse / GlobalExceptionMiddleware
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    for (const item of responseData.errors) {
      if (typeof item === 'string') {
        errorList.push(item);
      } else if (item && typeof item === 'object') {
        const itemCode = item.code || item.errorCode || item.name;
        const itemMsg = item.description || item.message || item.defaultMessage || item.fullMessage;
        if (itemCode && !mainCode) {
          mainCode = itemCode;
        }
        if (itemCode && itemMsg && !itemMsg.includes(itemCode)) {
          errorList.push(`[${itemCode}] ${itemMsg}`);
        } else if (itemMsg) {
          errorList.push(itemMsg);
        } else if (itemCode) {
          errorList.push(`[${itemCode}]`);
        }
      }
    }
  }

  // 2. Mensagem simples no responseData
  if (errorList.length === 0 && responseData?.message) {
    errorList.push(responseData.message);
  }
  if (errorList.length === 0 && responseData?.title) {
    errorList.push(responseData.title);
  }

  // 3. Se ainda não achou detalhes na resposta, verifica erro do Axios / JS Error
  if (errorList.length === 0 && anyErr?.message) {
    errorList.push(anyErr.message);
  }

  // Monta a mensagem para exibição ao usuário
  let userMessage = defaultMessage;
  const technicalParts: string[] = [];

  if (errorList.length > 0) {
    const combinedErrors = errorList.join(' | ');
    userMessage = `${defaultMessage} ${combinedErrors}`;
    technicalParts.push(`Detalhes: ${combinedErrors}`);
  }

  if (statusCode) {
    technicalParts.push(`HTTP ${statusCode}`);
  }

  if (traceId) {
    technicalParts.push(`TraceId: ${traceId}`);
  }

  return {
    userMessage,
    technicalDetails: technicalParts.length > 0 ? technicalParts.join(' • ') : undefined,
    statusCode,
    traceId,
    code: mainCode,
    errorList,
  };
};

/**
 * Atalho para obter apenas a mensagem amigável e detalhada de erro.
 */
export const extractErrorMessage = (err: unknown, defaultMessage = 'Ocorreu um erro na operação.'): string => {
  return extractErrorInfo(err, defaultMessage).userMessage;
};
