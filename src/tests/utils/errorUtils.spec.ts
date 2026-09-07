import { describe, it, expect } from 'vitest';
import { extractErrorInfo, extractErrorMessage } from '../../utils/errorUtils';

describe('errorUtils', () => {
  it('returns default message when err is null or undefined', () => {
    expect(extractErrorMessage(null, 'Erro padrão')).toBe('Erro padrão');
    expect(extractErrorMessage(undefined)).toBe('Ocorreu um erro na operação.');
  });

  it('extracts error from responseData.errors array and omits UNHANDLED_EXCEPTION banner', () => {
    const errorResponse = {
      response: {
        status: 500,
        data: {
          correlationId: 'test-trace-123',
          errors: [
            {
              code: 'InvalidOperationException',
              description: 'Database connection failed.',
            },
          ],
        },
      },
    };

    const info = extractErrorInfo(errorResponse, 'Ocorreu um erro ao buscar os hotéis.');
    expect(info.userMessage).toContain('Ocorreu um erro ao buscar os hotéis.');
    expect(info.userMessage).toContain('[InvalidOperationException] Database connection failed.');
    expect(info.statusCode).toBe(500);
    expect(info.traceId).toBe('test-trace-123');
    expect(info.technicalDetails).toContain('HTTP 500');
    expect(info.technicalDetails).toContain('TraceId: test-trace-123');
    expect(info.technicalDetails).toContain('Verifique os logs para mais detalhes.');
  });

  it('replaces UNHANDLED_EXCEPTION and strips stack trace', () => {
    const errorResponse = {
      response: {
        status: 500,
        data: {
          correlationId: 'test-trace-legacy',
          errors: [
            {
              code: 'UNHANDLED_EXCEPTION',
              description: 'An unexpected error occurred.\n   at Microsoft.EntityFrameworkCore.Query.Internal...',
            },
          ],
        },
      },
    };

    const info = extractErrorInfo(errorResponse, 'Erro:');
    expect(info.userMessage).not.toContain('UNHANDLED_EXCEPTION');
    expect(info.userMessage).not.toContain('Microsoft.EntityFrameworkCore');
    expect(info.userMessage).toContain('Ocorreu um erro no servidor. Verifique os logs para mais detalhes.');
  });

  it('extracts simple message from responseData.message', () => {
    const error = {
      response: {
        status: 404,
        data: {
          message: 'Hotéis não encontrados',
        },
      },
    };

    const message = extractErrorMessage(error, 'Erro:');
    expect(message).toBe('Erro: Hotéis não encontrados');
  });

  it('extracts message from standard Error instance', () => {
    const error = new Error('Network timeout');
    const message = extractErrorMessage(error, 'Falha:');
    expect(message).toBe('Falha: Network timeout');
  });
});
