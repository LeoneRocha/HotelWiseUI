export interface IExtractedErrorInfo {
  userMessage: string;
  technicalDetails?: string;
  statusCode?: number;
  traceId?: string;
  code?: string;
  errorList: string[];
}

interface IApiErrorItem {
  code?: string;
  errorCode?: string;
  name?: string;
  description?: string;
  message?: string;
  defaultMessage?: string;
}

interface IApiErrorResponseData {
  errors?: unknown[];
  message?: string;
  title?: string;
  traceId?: string;
  correlationId?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * Remove traces técnicos extensos (stack trace C#/JS com quebras de linha e "at " ou "em ")
 * para não poluir a interface do usuário.
 * Utiliza espaçamento horizontal explícito para evitar backtracking superlinear (ReDoS).
 */
const sanitizeMessage = (msg?: string | null): string => {
  if (!msg) return '';
  // Se contiver stack trace com quebras de linha seguidas de "at " ou "em ", remove o trace sem backtracking
  const withoutTrace = msg.split(/\r?\n[ \t]*(?:at|em)[ \t]+/i)[0].trim();
  // Trata mensagem genérica legada de exceção não tratada
  if (withoutTrace === 'An unexpected error occurred.') {
    return 'Ocorreu um erro no servidor. Verifique os logs para mais detalhes.';
  }
  return withoutTrace;
};

const getAxiosErrorParts = (err: unknown) => {
  if (!isRecord(err)) {
    return { responseData: undefined, statusCode: undefined, traceId: undefined, errMessage: undefined };
  }

  const response = isRecord(err.response) ? err.response : undefined;
  const responseData = isRecord(response?.data) ? (response.data as IApiErrorResponseData) : undefined;
  const statusCode = typeof response?.status === 'number' ? response.status : undefined;

  const rawTraceId = responseData?.traceId ?? responseData?.correlationId ?? err.correlationId;
  const traceId = typeof rawTraceId === 'string' ? rawTraceId : undefined;
  const errMessage = typeof err.message === 'string' ? err.message : undefined;

  return { responseData, statusCode, traceId, errMessage };
};

const formatSingleErrorItem = (
  item: unknown
): { formatted?: string; code?: string } => {
  if (typeof item === 'string') {
    const sanitized = sanitizeMessage(item);
    return sanitized ? { formatted: sanitized } : {};
  }

  if (!isRecord(item)) {
    return {};
  }

  const errorItem = item as IApiErrorItem;
  const itemCode = errorItem.code || errorItem.errorCode || errorItem.name;
  const rawMsg = errorItem.description || errorItem.message || errorItem.defaultMessage;
  const sanitizedMsg = sanitizeMessage(rawMsg);

  if (itemCode === 'UNHANDLED_EXCEPTION' || itemCode === 'UnhandledException') {
    return {
      code: itemCode,
      formatted: sanitizedMsg || 'Ocorreu um erro no servidor. Verifique os logs para mais detalhes.',
    };
  }

  if (itemCode && sanitizedMsg && !sanitizedMsg.includes(itemCode)) {
    return { code: itemCode, formatted: `[${itemCode}] ${sanitizedMsg}` };
  }

  if (sanitizedMsg) {
    return { code: itemCode, formatted: sanitizedMsg };
  }

  if (itemCode) {
    return { code: itemCode, formatted: `[${itemCode}]` };
  }

  return {};
};

const parseErrorsArray = (errors: unknown[]): { errorList: string[]; mainCode?: string } => {
  const errorList: string[] = [];
  let mainCode: string | undefined;

  for (const item of errors) {
    const { formatted, code } = formatSingleErrorItem(item);
    if (code && !mainCode) {
      mainCode = code;
    }
    if (formatted) {
      errorList.push(formatted);
    }
  }

  return { errorList, mainCode };
};

const extractFallbackError = (
  responseData?: IApiErrorResponseData,
  errMessage?: string
): string | undefined => {
  const candidate = responseData?.message || responseData?.title || errMessage;
  const sanitized = sanitizeMessage(candidate);
  return sanitized || undefined;
};

const buildTechnicalDetails = (statusCode?: number, traceId?: string): string => {
  const technicalParts: string[] = [];

  if (statusCode) {
    technicalParts.push(`HTTP ${statusCode}`);
  }

  if (traceId) {
    technicalParts.push(`TraceId: ${traceId}`);
  }

  technicalParts.push('Verifique os logs para mais detalhes.');
  return technicalParts.join(' • ');
};

/**
 * Extrai informações detalhadas de erro a partir de exceções do Axios ou da API,
 * priorizando a mensagem real do erro do servidor e ocultando traces completos no frontend.
 */
export const extractErrorInfo = (
  err: unknown,
  defaultMessage = 'Ocorreu um erro na operação.'
): IExtractedErrorInfo => {
  if (!err) {
    return { userMessage: defaultMessage, errorList: [] };
  }

  const { responseData, statusCode, traceId, errMessage } = getAxiosErrorParts(err);

  let errorList: string[] = [];
  let mainCode: string | undefined;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    const parsed = parseErrorsArray(responseData.errors);
    errorList = parsed.errorList;
    mainCode = parsed.mainCode;
  }

  if (errorList.length === 0) {
    const fallback = extractFallbackError(responseData, errMessage);
    if (fallback) {
      errorList.push(fallback);
    }
  }

  const userMessage = errorList.length > 0
    ? `${defaultMessage} ${errorList.join(' | ')}`
    : defaultMessage;

  return {
    userMessage,
    technicalDetails: buildTechnicalDetails(statusCode, traceId),
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
