export interface IExtractedErrorInfo {
  userMessage: string;
  technicalDetails?: string;
  statusCode?: number;
  traceId?: string;
  code?: string;
  errorList: string[];
}

/**
 * Remove traces técnicos extensos (stack trace C#/JS com quebras de linha e "at ")
 * para não poluir a interface do usuário.
 */
const sanitizeMessage = (msg?: string | null): string => {
  if (!msg) return '';
  // Se contiver stack trace com quebras de linha seguidas de "at " ou "em ", remove o trace
  const withoutTrace = msg.split(/\r?\n\s*(at|em)\s+/i)[0].trim();
  // Trata mensagem genérica legada de exceção não tratada
  if (withoutTrace === 'An unexpected error occurred.') {
    return 'Ocorreu um erro no servidor. Verifique os logs para mais detalhes.';
  }
  return withoutTrace;
};

/**
 * Extrai informações detalhadas de erro a partir de exceções do Axios ou da API,
 * priorizando a mensagem real do erro do servidor e ocultando traces completos no frontend.
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
        const sanitized = sanitizeMessage(item);
        if (sanitized) errorList.push(sanitized);
      } else if (item && typeof item === 'object') {
        const itemCode = item.code || item.errorCode || item.name;
        // Prioriza a mensagem do erro sem o trace completo (não usa fullMessage com stack trace)
        const rawMsg = item.description || item.message || item.defaultMessage;
        const sanitizedMsg = sanitizeMessage(rawMsg);

        if (itemCode && !mainCode) {
          mainCode = itemCode;
        }

        // Em vez de UNHANDLED_EXCEPTION, exibir a mensagem real do erro ocorrido no servidor
        if (itemCode === 'UNHANDLED_EXCEPTION' || itemCode === 'UnhandledException') {
          if (sanitizedMsg) {
            errorList.push(sanitizedMsg);
          } else {
            errorList.push('Ocorreu um erro no servidor. Verifique os logs para mais detalhes.');
          }
        } else if (itemCode && sanitizedMsg && !sanitizedMsg.includes(itemCode)) {
          errorList.push(`[${itemCode}] ${sanitizedMsg}`);
        } else if (sanitizedMsg) {
          errorList.push(sanitizedMsg);
        } else if (itemCode) {
          errorList.push(`[${itemCode}]`);
        }
      }
    }
  }

  // 2. Mensagem simples no responseData
  if (errorList.length === 0 && responseData?.message) {
    const sanitized = sanitizeMessage(responseData.message);
    if (sanitized) errorList.push(sanitized);
  }
  if (errorList.length === 0 && responseData?.title) {
    const sanitized = sanitizeMessage(responseData.title);
    if (sanitized) errorList.push(sanitized);
  }

  // 3. Se ainda não achou detalhes na resposta, verifica erro do Axios / JS Error
  if (errorList.length === 0 && anyErr?.message) {
    const sanitized = sanitizeMessage(anyErr.message);
    if (sanitized) errorList.push(sanitized);
  }

  // Monta a mensagem para exibição ao usuário
  let userMessage = defaultMessage;
  const technicalParts: string[] = [];

  if (errorList.length > 0) {
    const combinedErrors = errorList.join(' | ');
    userMessage = `${defaultMessage} ${combinedErrors}`;
  }

  // Detalhes técnicos resumidos (sem stack trace completo)
  if (statusCode) {
    technicalParts.push(`HTTP ${statusCode}`);
  }

  if (traceId) {
    technicalParts.push(`TraceId: ${traceId}`);
  }

  technicalParts.push('Verifique os logs para mais detalhes.');

  return {
    userMessage,
    technicalDetails: technicalParts.join(' • '),
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
