## 1. Design System, Typography & Light Theme Layout Setup

- [x] 1.1 Configure Google Fonts (Plus Jakarta Sans, Inter, and JetBrains Mono) and Material Symbols Outlined icon stylesheet in Next.js root layout (`layout.tsx`) and CSS variables (`globals.css`), ensuring import rule precedence over `@import "tailwindcss";`
- [x] 1.2 Define global color tokens in Tailwind v4 `@theme inline` for official Light Theme (surface `#f8f9fa`, cards `#ffffff`), Primary Indigo (`#4648d4`) base theme, and Warm Coral (`#fd933d`) interactive accents
- [x] 1.3 Build primary dashboard structural layout in `app/page.tsx` adopting the official prototype from `stitch_financeai_dashboard/code.html`, featuring a persistent white left sidebar (`SideNavBar`), interactive TopAppBar, ultra-light content wrapper, and official footer

## 2. Spanish Naming Parity & Manual Expense Entry Implementation

- [x] 2.1 Renamed all frontend React components and physical files to Spanish (`TarjetaDiagnostico.tsx`, `SeccionIngresoGastos.tsx`, `MicroTarjetaGasto.tsx`, `FormularioAnalisis.tsx`, `TarjetaRecomendacion.tsx`) and deleted obsolete English files to establish complete ubiquitous language parity with the Spring Boot backend
- [x] 2.2 Create `<MicroTarjetaGasto />` component representing transaction entries in a clean table layout, displaying descriptions in Inter font, category badges ("Gasto Habitual"), and financial amounts strictly in JetBrains Mono font with Warm Coral delete actions
- [x] 2.3 Implement expense entry inputs in `<SeccionIngresoGastos />` with traditional conditional validations (non-empty, max 25 chars, value > 0) using native React state (`useState`) and exclusively focusing on manual entry (excluding CSV import functionality)

## 3. Financial Analysis Form & Client-Side Computation

- [x] 3.1 Build primary analysis form controls and 12-column Bento Grid workspace in `<FormularioAnalisis />` for monthly income, debt value, and saving frequency using JetBrains Mono styling for financial inputs alongside the action card and motivational mascot snippet
- [x] 3.2 Implement client-side submission validations and inline computation of `nivel_endeudamiento = Math.round((valorDeuda / ingresoMensual) * 100)` before API dispatch
- [x] 3.3 Configure async `fetch` logic to transmit the strict JSON payload (`ingreso_mensual`, `nivel_endeudamiento`, `frecuencia_ahorro`, `transacciones`) via HTTP POST to `http://localhost:8080/api/v1/finanzas/analizar`

## 4. "The Encouraging Expert" Diagnostic Results Dashboard

- [x] 4.1 Create semantic `<TarjetaDiagnostico />` component rendering user profile in Plus Jakarta Sans font, evaluation certainty as a rounded percentage strictly in JetBrains Mono font, and Level 1 Light Theme styling (`#ffffff` fill with soft ambient shadow)
- [x] 4.2 Build `<TarjetaRecomendacion />` component displaying AI recommendations in soft-bordered containers with Warm Coral highlights (`secondary-container`), framing advice as positive growth action items without alarmist visual warnings
- [x] 4.3 Integrate interactive loading states (`isLoading`), real-time error handling for backend local server reachability (`http://localhost:8080`), and state reset workflows to deliver a polished end-to-end user experience
