# AGENTS.md - Project Guidelines for AI Agents

## Project Overview

This is a React 19 + TypeScript + Vite project. The codebase uses modern React patterns with hooks, and follows strict TypeScript and ESLint rules.

---

## Commands

### Development
```bash
pnpm dev          # Start development server
pnpm preview      # Preview production build
```

### Build & Type Check
```bash
pnpm build        # Type check (tsc -b) + Vite build
pnpm tsc --showConfig  # View TypeScript config
```

### Linting
```bash
pnpm lint         # Run ESLint on entire project
pnpm lint --fix   # Auto-fix ESLint issues
```

### Testing
**Always write tests** for all new features and bug fixes. Use Vitest as the test framework with React Testing Library.

```bash
pnpm vitest        # Run all tests
pnpm vitest run     # Run tests once
pnpm vitest run src/App.tsx  # Run single test file
```

---

## Code Style Guidelines

### TypeScript

- **Strict Mode**: All strict TypeScript options are enabled. Never use `any` - use `unknown` if type is truly unknown.
- **Erasable Syntax Only**: Use `type` instead of `interface` unless extending/merging is needed.
- **No Unused**: All unused locals and parameters must be removed.
- **Module Resolution**: Use `bundler` mode - relative imports must include file extensions for TypeScript files (`.ts`, `.tsx`).

### React

- **Hooks**: Use React 19 hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, etc.)
- **Component Structure**: Prefer functional components with hooks over class components
- **React Compiler**: Project uses Babel React Compiler - prefer idiomatic code that works with it
- **Event Handlers**: Use inline arrow functions for simple handlers, `useCallback` for complex ones passed to children

### Imports

- **Order**: 1. React imports, 2. External libs, 3. Internal imports, 4. CSS/assets
- **Extensions**: Always include `.ts`/`.tsx` extensions for relative imports
- **Absolute Imports**: Use `@/` aliases if configured (check `tsconfig.json`)

### Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`formatDate.ts`)
- **Components**: PascalCase (`function MyComponent()`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useCounter`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase otherwise
- **Interfaces/Types**: PascalCase, prefix with `I` only if ambiguous (`User`, `UserProps`)

### Formatting

- **Indentation**: 2 spaces (follow project ESLint config)
- **Quotes**: Single quotes for strings (ESLint default)
- **Semicolons**: Yes (ESLint default)
- **Trailing Commas**: In multiline objects/arrays where appropriate

### Error Handling

- **Error Boundaries**: Use React error boundaries for component tree failures
- **Try/Catch**: Always wrap async operations in try/catch
- **Types**: Never use `any` - use proper error types or `unknown`

### CSS

- **CSS Modules**: Use CSS Modules for all component styles. Import styles as `{ styles }` from `Component.module.css`
- **Naming**: Use camelCase class names in CSS (e.g., `container`, `buttonPrimary`)
- **No Global CSS**: Avoid global CSS files except for global resets in `index.css`

### ESLint Plugins

This project uses:
- `eslint-plugin-react-hooks` - Enforces rules of hooks
- `eslint-plugin-react-refresh` - Validates Fast Refresh compatibility

**Common Rules to Follow:**
- Hooks must be called at the top level (not in loops, conditions, or nested functions)
- Dependencies in `useEffect`/`useCallback` must be exhaustive
- Only export components that are Safe for Fast Refresh

---

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component
├── App.module.css        # Root component styles
├── index.css             # Global styles
├── assets/               # Static assets (images, etc)
└── components/          # Reusable components
    └── Component/
        ├── Component.tsx
        └── Component.module.css
```

---

## Important Notes

1. **React 19**: This project uses React 19 - be aware of new features/patterns
2. **Vite**: Use Vite plugins and patterns, not Webpack
3. **No API**: This is a frontend-only project (no backend)
4. **Package Manager**: Use `pnpm` for all package operations

---

## Working with AI Agents

When asking an AI agent to make changes:
- Be specific about which file(s) to modify
- Provide context about existing patterns in the codebase
- Use Plan mode first for large changes, then switch to Build mode
- Use `/undo` to revert unwanted changes
