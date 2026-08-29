# Diretrizes para Testes Automatizados e Cobertura (Coverage) — Frontend (Genérico React / Vitest / TypeScript)

**Documento:** Guia operacional padronizado e reutilizável para engenharia de testes e cobertura frontend  
**Arquivo:** `Diretrizes-Coverage-Frontend-Generico.md`  
**Escopo:** Aplicações SPA, bibliotecas cliente e componentes web em TypeScript (React, Vite, Vitest, Testing Library)  
**Ferramental de Referência:** Vitest, Jest, React Testing Library (`@testing-library/react`), `@testing-library/user-event`, jsdom, v8 / Istanbul  
**Target Platform:** React 19 / TypeScript 6+ / Vitest 4+  
**Data da Revisão:** 2026-08-28  

---

## 1. Objetivo

Padronizar a criação, estruturação e manutenção de testes unitários e de integração em ecossistemas frontend baseados em React / TypeScript, garantindo:

1. **Alta Cobertura e Não-Regressão:** Atingir e manter metas rigorosas de cobertura (**Statements**, **Branches**, **Functions** e **Lines**) em componentes visuais, telas, custom hooks, serviços HTTP, gerenciadores de sessão e utilitários.
2. **Isolamento e Determinismo:** Testes rápidos e independentes, utilizando mocks e spies (`vi.fn()`, `vi.spyOn()`, `axios-mock-adapter`) para isolar chamadas de rede HTTP, autenticação, armazenamento local (`localStorage`/`sessionStorage`), timers e bibliotecas externas.
3. **Clareza com Padrão AAA:** Estrutura clara baseada em **Arrange / Act / Assert**.
4. **Resiliência e Testabilidade pelo Comportamento do Usuário:** Foco em testar o comportamento da aplicação a partir da perspectiva do usuário através de acessibilidade e queries semânticas (`screen.getByRole`, `screen.getByText`, `screen.getByLabelText`), evitando acoplamento a detalhes internos de implementação.

---

## 2. Padrões Obrigatórios de Escrita de Testes Frontend

### 2.1 Nomenclatura em Inglês
Os blocos `describe` e métodos `it` / `test` devem ser redigidos em inglês seguindo a convenção tripartite:
```typescript
describe('ReservationFormComponent', () => {
  it('loadRooms_WhenUserIsAuthenticated_RendersAvailableRooms', async () => { ... });
  it('submitBooking_WithInvalidDates_DisplaysValidationToast', async () => { ... });
});
```

---

### 2.2 Comentários de Contexto em Português
Acima de cada teste ou bloco de cenários, adicionar um comentário em português explicando o cenário e o objetivo:

```typescript
// Cenário: Submissão de formulário de login com credenciais válidas.
// Objetivo: Garantir que o token JWT seja armazenado e o usuário redirecionado para o painel principal.
it('submitForm_WithValidCredentials_StoresTokenAndRedirects', async () => {
  // Arrange
  // Act
  // Assert
});
```

---

### 2.3 Estrutura Arrange / Act / Assert (AAA)

```typescript
// Cenário: Tentativa de cancelamento de reserva quando a API retorna erro 500.
// Objetivo: Validar que a notificação de erro seja exibida via toast e o estado de carregamento desligado.
it('cancelReservation_WhenApiFails_ShowsErrorToastAndResetsLoading', async () => {
  // Arrange
  const toastErrorSpy = vi.spyOn(toast, 'error');
  vi.spyOn(hotelService, 'cancelReservation').mockRejectedValue(new Error('Internal Server Error'));

  // Act
  render(<ReservationDetailsModal reservationId="res-123" onClose={vi.fn()} />);
  const cancelButton = screen.getByRole('button', { name: /cancelar reserva/i });
  await userEvent.click(cancelButton);

  // Assert
  expect(toastErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Erro'));
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});
```

---

## 3. Tipologia de Testes no Frontend

```mermaid
flowchart TD
    FrontendTests[Testes Automatizados Frontend] --> ServiceTests[Testes de Serviços & Clientes HTTP\n(Axios, Auth MSAL, Session, Helpers)]
    FrontendTests --> ComponentTests[Testes de Componentes Visuais & Telas\n(React Testing Library, DOM, Eventos, Modais)]
    FrontendTests --> HookTests[Testes de Custom Hooks\n(renderHook, State, Effects, Lifecycles)]
    FrontendTests --> HelperTests[Testes de Utilitários & Formatadores\n(Dates, Currencies, Validations, DOMPurify)]
```

### 3.1 Testes de Serviços e Clientes HTTP
- Utilizar `axios-mock-adapter` ou mocks de rede (`vi.spyOn(axios, 'get')`).
- Validar envio de tokens nos headers de autenticação (`Authorization: Bearer ...`), deserialização de DTOs e captura adequada de exceções (400, 401, 403, 500).

### 3.2 Testes de Componentes Visuais e Telas
- Utilizar `@testing-library/react` (`render`, `screen`, `waitFor`) e `@testing-library/user-event` para simular cliques, digitação e foco.
- Envolver componentes em Providers necessários (`MemoryRouter`, `MsalProvider`, `ToastContainer`) quando aplicável.

---

## 4. Métricas e Gestão de Exclusões de Cobertura

### 4.1 As 4 Métricas Fundamentais do V8 / Vitest
1. **Statements (% de Instruções):** Proporção de instruções de código executadas.
2. **Branches (% de Ramos/Condições):** Proporção de caminhos lógicos (`if/else`, `switch`, operadores ternários, `?.`) testados.
3. **Functions (% de Funções):** Proporção de funções, hooks e callbacks invocados.
4. **Lines (% de Linhas):** Proporção de linhas físicas executadas.

### 4.2 Exclusões de Cobertura Válidas
Arquivos que **não contêm lógica testável** devem ser excluídos no `vitest.config.ts` e no `sonar-project.properties`:
- Arquivos de inicialização (`main.tsx`, `index.html`, `vite-env.d.ts`).
- Definições de tipos e interfaces puras (`src/interfaces/**`, `src/enums/**`).
- Mocks e arquivos de setup de testes (`vitest.setup.ts`, `__mocks__/**`).
- Declaração estática de rotas puras (`routes.tsx`).

---

## 5. Roteiro Operacional de Execução

```powershell
# 1. Executar suíte completa de testes no Vitest
npm test

# 2. Executar suíte em modo watch durante desenvolvimento
npm run test:watch

# 3. Executar com coleta de cobertura completa (HTML, LCOV e JUnit)
npx vitest run --coverage

# 4. Executar arquivo de teste isolado
npx vitest run src/tests/services/HotelService.spec.ts
```

---

## 6. Checklist de Qualidade Frontend

- [ ] Nome do teste em inglês no padrão `Metodo_Cenario_Resultado`.
- [ ] Comentários em português `// Cenário:` e `// Objetivo:` presentes.
- [ ] Padrão AAA respeitado com asserções declarativas (`expect(...)`).
- [ ] Spies e mocks limpos entre execuções (`afterEach(() => vi.clearAllMocks())`).
- [ ] Cobertura de ramos (*branch coverage*) validando cenários de sucesso e erro.
- [ ] Zero dependência de serviços de backend ativos (100% das requisições HTTP mockadas).
