# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Contact Form (Serverless Email)

The contact section is integrated with Formspree using a frontend-only serverless flow.

### Setup

1. Create a form in Formspree and copy your endpoint URL.
2. Create a `.env` file in the project root.
3. Add the variable:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/TU_FORM_ID
```

4. Restart the dev server after editing `.env`.

### Notes

- Contact messages are routed to `anakmartelviera@gmail.com` when Formspree is configured correctly.
- The sender shown by email providers may be the Formspree relay address due to anti-spoofing policies.
- The form still passes the visitor email as `_replyto` so you can answer directly.
