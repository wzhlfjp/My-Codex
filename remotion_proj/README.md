# Remotion Workspace

This repository is a pnpm workspace for Remotion video projects. Each video project lives in its own folder and declares the runtime dependencies it uses directly, while shared tooling and reusable code live at the workspace root and in `packages/*`.

## Structure

```text
remotion_proj/
├── best-colleges-tuition/      # Remotion video project
├── packages/
│   ├── shared/                 # General reusable utilities
│   ├── remotion-components/    # Shared React/Remotion components
│   └── animation-utils/        # Shared timing and animation helpers
├── package.json                # Workspace scripts and shared dev tooling
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Install

From the workspace root:

```powershell
pnpm install
```

## Develop

Start Remotion Studio for the current video:

```powershell
pnpm dev:best-colleges-tuition
```

You can also run the project script directly:

```powershell
pnpm --filter best-colleges-tuition dev
```

## Render

Render the default composition:

```powershell
pnpm render:best-colleges-tuition
```

The output is written to `best-colleges-tuition/out/best-colleges-tuition.mp4`.

## Verify

Run TypeScript across all workspace packages:

```powershell
pnpm typecheck
```

Run linting:

```powershell
pnpm lint
```

Run both checks through the workspace build script:

```powershell
pnpm build
```

## Adding Another Video Project

Create a new folder beside `best-colleges-tuition`, add a `package.json`, `src/index.ts`, `src/Root.tsx`, and `remotion.config.ts`. The workspace pattern picks up top-level video folders automatically.

Each video should declare direct dependencies such as `remotion`, `react`, and `react-dom`. Reusable code should go in `packages/shared`, `packages/remotion-components`, or `packages/animation-utils` and be consumed with `workspace:*` dependencies such as `@remotion-proj/shared`.
