# Agent Instructions for Frontend Project

## Build/Lint/Test Commands
- **Build**: `npm run build` or `yarn build`
- **Dev server**: `npm run dev` or `yarn dev`  
- **Lint**: `npm run lint` or `yarn lint`
- **Type check**: `npm run typecheck` or `tsc --noEmit`
- **Test all**: `npm test` or `yarn test`
- **Test single file**: `npm test -- filename.test.ts` or `jest filename.test.ts`
- **Test watch**: `npm test -- --watch`

## Code Style Guidelines
- Use TypeScript for all new files
- Import order: external libraries → internal modules → relative imports
- Use named exports over default exports
- Prefer `const` over `let`, avoid `var`
- Use camelCase for variables/functions, PascalCase for components/classes
- Add JSDoc comments for public APIs and complex logic
- Handle errors explicitly - no silent failures
- Use strict TypeScript config with proper typing
- Prefer functional components with hooks over class components
- Use semantic HTML and proper accessibility attributes