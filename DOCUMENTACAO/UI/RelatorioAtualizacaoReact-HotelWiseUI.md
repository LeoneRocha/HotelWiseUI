# Relatório de Atualização — HotelWiseUI (React)

**Documento:** Evidências pós-execução do Conjunto Homologado v1 + fechamento CVE router  
**Projeto:** `HotelWiseUI/`  
**Branch:** `chore/update-packages-hotelwiseui-react`  
**Data:** 2026-07-31  
**Conjunto:** `2026-07-LevantamentoConjuntoHomologado-HotelWiseUI.md`  
**Plano:** `PlanoImplementacaoAtualizacaoReact-HotelWiseUI.md`

---

## 1. Resumo executivo

```text
React: 19.2.8
react-router: 8.3.0 (react-router-dom removido)
MSAL: browser 5.17.3 / react 5.5.4
Vite: 8.2.0 | ESLint: 10.8.0 | TypeScript: 6.0.3
Testes: 30/30 suites, 104/104 tests
npm audit --omit=dev: 0
npm audit all: 0
Build/lint/smoke: OK
vite-jest: removido | react-hooks Compiler: reativado
```

As **2 high** de produção (GHSA-qwww) foram eliminadas migrando para **`react-router@8.3.0`**.

---

## 2. Fechamento CVE router (GHSA-qwww-vcr4-c8h2)

| Etapa | Versão | `npm audit --omit=dev` |
| ----- | ------ | ---------------------- |
| Inventário proposto | pin `react-router-dom@7.11.0` | abriria outras highs ≤7.17 |
| Intermediário | `react-router-dom@7.18.2` | 2 high (DB npm stale) |
| **Final** | **`react-router@8.3.0`** (sem `react-router-dom`) | **0** |

No v8 o pacote `react-router-dom` foi removido; APIs DOM (`BrowserRouter`, `Link`, hooks, etc.) vêm de `react-router`.

**Arquivos de app/teste:** imports `from 'react-router-dom'` → `from 'react-router'` (~24 arquivos).

**Jest (ESM):**

- [`jest.config.ts`](../../jest.config.ts) — `transformIgnorePatterns` inclui `react-router|cookie-es`
- [`babel.config.cjs`](../../babel.config.cjs) — `@babel/preset-env` + plugin local para `import.meta`
- DevDeps: `@babel/core`, `@babel/preset-env`

---

## 3. Versões-chave

| Pacote | Versão |
| ------ | ------ |
| react / react-dom | 19.2.8 |
| react-router | **8.3.0** |
| react-router-dom | **removido** |
| @azure/msal-browser / react | 5.17.3 / 5.5.4 |
| vite / plugin-react | 8.2.0 / 6.0.5 |
| typescript | **6.0.3** |
| eslint | 10.8.0 |
| uuid / jest-junit / jest-dom | 14.0.1 / 17.0.0 / 7.0.0 |
| vite-jest | **removido** |

**Overrides:** `brace-expansion@^5.0.8`

---

## 4. Código (MSAL 5 + React Compiler)

| Arquivo | Mudança |
| ------- | ------- |
| `src/auth-config.ts` | Removido `storeAuthStateInCookie` |
| `src/services/AzureAuthService.ts` | `logout()` sem `onRedirectNavigate` no request |
| `eslint.config.js` | Regras React Compiler do hooks v7 **reativadas** |
| CookieConsent, Login, Hotel*, Room* | Removidos `setState` síncronos em effects (derivação / init / async) |
| `tsconfig.spec.json` | `rootDir: ./src` (exigência TS 6) |

---

## 5. Gates

| Gate | Resultado |
| ---- | --------- |
| `npm test -- --coverage=false --no-cache` | **30/30**, **104/104** |
| `npm run build` / `build:prod` | OK |
| `npm run lint` | **0 errors** (Compiler rules on) |
| `npm audit` / `--omit=dev` | **0 vulnerabilities** |

---

## 6. Critérios de aceite

1. [x] Testes 30/30  
2. [x] Audit prod **0** high/critical  
3. [x] React 19.2.8  
4. [x] Conjunto v1 + router 8.3.0  
5. [x] Build prod + lint OK  
6. [x] TypeScript **6.0.3** (7 bloqueado por typescript-eslint `<6.1`)  
7. [x] Sem `audit fix --force`  
8. [x] lockfile atualizado  
9. [x] `vite-jest` removido  
10. [x] Regras React Compiler ESLint ativas  

---

## 7. Próximos passos

- TypeScript **7** quando `typescript-eslint` liberar peer `>=6.1`
- Migrar Jest → Vitest (opcional)

---

## 8. Referências

- [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
- https://reactrouter.com/changelog (v8.3.0 — Removed `react-router-dom`)
- https://vite.dev/blog/announcing-vite8
