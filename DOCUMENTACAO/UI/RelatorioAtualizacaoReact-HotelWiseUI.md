# Relatório de Atualização — HotelWiseUI (React)

**Documento:** Evidências pós-execução do Conjunto Homologado v1 + router 8 + Vitest + TS7 build  
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
Vite: 8.2.0 | ESLint: 10.8.0
TypeScript: 6.0.3 (ESLint) + typescript7 alias 7.0.2 (tsc -b / build)
Testes: Vitest 4.1.10 — 30/30 suites, 104/104 tests
npm audit / --omit=dev: 0
Build/lint: OK
Jest / vite-jest / babel-jest: removidos | react-hooks Compiler: reativado
```

As **2 high** de produção (GHSA-qwww) foram eliminadas com **`react-router@8.3.0`**. Stack de testes migrada para **Vitest**. Build usa **TypeScript 7** via alias npm `typescript7`; o `typescript` principal permanece em **6.0.3** por peer do `typescript-eslint` (`<6.1`).

---

## 2. Fechamento CVE router (GHSA-qwww-vcr4-c8h2)

| Etapa | Versão | `npm audit --omit=dev` |
| ----- | ------ | ---------------------- |
| Inventário proposto | pin `react-router-dom@7.11.0` | abriria outras highs ≤7.17 |
| Intermediário | `react-router-dom@7.18.2` | 2 high (DB npm stale) |
| **Final** | **`react-router@8.3.0`** (sem `react-router-dom`) | **0** |

No v8 o pacote `react-router-dom` foi removido; APIs DOM vêm de `react-router`.

**Arquivos:** imports `from 'react-router-dom'` → `from 'react-router'`.

---

## 3. TypeScript 7 (side-by-side) + Vitest

| Papel | Pacote | Versão |
| ----- | ------ | ------ |
| ESLint / peers | `typescript` | **6.0.3** |
| `tsc -b` no build | `typescript7` → `npm:typescript@7.0.2` | **7.0.2** |
| Test runner | `vitest` + `@vitest/coverage-v8` + `jsdom` | **4.1.10** |

**Build scripts:** `node ./node_modules/typescript7/bin/tsc -b && vite build…`

**Removidos:** `jest`, `ts-jest`, `jest-environment-jsdom`, `jest-junit`, `jest-html-reporter`, `@types/jest`, `@babel/*` de teste, `identity-obj-proxy`, `ts-node`, `jest.config.ts`, `jest.setup.ts`, `babel.config.cjs`.

**Vitest:** `vitest.config.ts` / `vitest.setup.ts`; mocks de serviços com `default: { … }` (ESM); aliases exatos `^uuid$` / `^react-date-picker$`.

**TS 7 como `typescript` principal:** adiado até `typescript-eslint` liberar peer `>=6.1`.

---

## 4. Versões-chave

| Pacote | Versão |
| ------ | ------ |
| react / react-dom | 19.2.8 |
| react-router | **8.3.0** |
| react-router-dom | **removido** |
| @azure/msal-browser / react | 5.17.3 / 5.5.4 |
| vite / plugin-react | 8.2.0 / 6.0.5 |
| typescript | **6.0.3** |
| typescript7 (alias) | **7.0.2** |
| vitest | **4.1.10** |
| eslint | 10.8.0 |
| uuid / jest-dom | 14.0.1 / 7.0.0 |
| vite-jest / Jest | **removidos** |

**Overrides:** `brace-expansion@^5.0.8`

---

## 5. Código (MSAL 5 + React Compiler)

| Arquivo | Mudança |
| ------- | ------- |
| `src/auth-config.ts` | Removido `storeAuthStateInCookie` |
| `src/services/AzureAuthService.ts` | `logout()` sem `onRedirectNavigate` no request |
| `eslint.config.js` | Regras React Compiler do hooks v7 **reativadas** |
| CookieConsent, Login, Hotel*, Room* | Removidos `setState` síncronos em effects |
| `tsconfig.spec.json` | `rootDir: ./src`; types Vitest |
| `tsconfig.app.json` | exclui `src/tests`; types `vite/client` + `node` |

---

## 6. Gates

| Gate | Resultado |
| ---- | --------- |
| `npm test` (Vitest) | **30/30**, **104/104** |
| `npm run build` / `build:prod` | OK (tsc 7 + vite) |
| `npm run lint` | **0 errors** |
| `npm audit` / `--omit=dev` | **0 vulnerabilities** |

---

## 7. Critérios de aceite

1. [x] Testes 30/30  
2. [x] Audit prod **0** high/critical  
3. [x] React 19.2.8  
4. [x] Conjunto v1 + router 8.3.0  
5. [x] Build prod + lint OK  
6. [x] TypeScript **6.0.3** para ESLint; **7.0.2** no build via alias  
7. [x] Sem `audit fix --force`  
8. [x] lockfile atualizado  
9. [x] `vite-jest` e Jest removidos; Vitest ativo  
10. [x] Regras React Compiler ESLint ativas  

---

## 8. Próximos passos

- Unificar `typescript@7` quando `typescript-eslint` liberar peer `>=6.1` (remover alias `typescript7`)

---

## 9. Referências

- [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
- https://reactrouter.com/changelog (v8.3.0 — Removed `react-router-dom`)
- https://vite.dev/blog/announcing-vite8
- https://vitest.dev/
