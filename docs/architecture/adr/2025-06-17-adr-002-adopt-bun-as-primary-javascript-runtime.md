# ADR-002: Adopt Bun as Primary JavaScript Runtime and Package Manager

**Date**: 2025-06-17  
**Status**: Accepted  
**Author**: Development Team  
**Decision ID**: ADR-002  

## Context

The mortgage calculator project currently uses a mixed tooling approach with different JavaScript runtimes and package managers. Analysis of the current setup reveals:

1. **Package Management**: Mix of `package-lock.json` (npm) and `bun.lockb` (Bun) creates confusion
2. **Performance**: Build and development server startup times could be improved
3. **Testing**: Need for fast, reliable test execution for mortgage calculation accuracy
4. **Development Experience**: Inconsistent tooling across different development environments
5. **Deployment**: AWS S3 deployment pipeline needs reliable, fast build process

## Decision

We will standardize on **Bun** as our primary JavaScript runtime and package manager for the following reasons:

### Chosen Solution: Bun Runtime + Package Manager
- **Performance**: 2-4x faster than Node.js for typical development tasks
- **Native TypeScript**: Built-in TypeScript support without additional transpilation
- **Unified Tooling**: Single tool for package management, testing, and script execution
- **Compatibility**: Drop-in replacement for Node.js with npm compatibility
- **Bundle Size**: Efficient bundling with tree-shaking support

## Implementation Plan

### Phase 1: Package Management Migration (Completed)
- [x] Remove `package-lock.json` and `.npmrc` files
- [x] Ensure `bun.lockb` is the sole lockfile
- [x] Update `package.json` with `"packageManager": "bun@1.1.38"`
- [x] Configure `bunfig.toml` for project-specific settings

### Phase 2: Development Scripts (Completed)
- [x] Update development server to use `bun dev`
- [x] Configure test runner with `bun test`
- [x] Set up build process with Bun + Vite integration
- [x] Update deployment scripts to use Bun commands

### Phase 3: CI/CD Integration (Planned)
- [ ] Update GitHub Actions to use Bun runtime
- [ ] Configure Bun caching in CI pipeline
- [ ] Validate deployment pipeline with Bun

### Phase 4: Documentation and Standards (Planned)
- [ ] Update README.md with Bun-specific instructions
- [ ] Document Bun configuration and best practices
- [ ] Create troubleshooting guide for Bun-specific issues

## Consequences

### Positive
- **Faster Development**: 2-4x faster package installation and test execution
- **Simplified Toolchain**: Single runtime for all JavaScript operations
- **Better TypeScript DX**: Native TypeScript support reduces configuration complexity
- **Consistent Environment**: All developers use same runtime and package manager
- **Reduced Dependencies**: Fewer tool dependencies in the project

### Negative
- **Ecosystem Maturity**: Bun is newer than Node.js, potential compatibility issues
- **Team Learning**: Developers need to learn Bun-specific features and troubleshooting
- **Deployment Dependencies**: Production environments need Bun runtime available

### Neutral
- **Application Functionality**: No impact on mortgage calculation logic or user experience
- **Build Output**: Same Vite-generated static files for deployment

## Alternatives Considered

### 1. Node.js + npm
- **Pros**: Mature ecosystem, team familiarity, extensive documentation
- **Cons**: Slower performance, separate tools for different tasks, complex configuration

### 2. Node.js + pnpm
- **Pros**: Faster than npm, good monorepo support, efficient disk usage
- **Cons**: Still requires Node.js runtime, additional learning curve

### 3. Node.js + Yarn
- **Pros**: Good package management features, workspaces support
- **Cons**: Performance similar to npm, additional tool complexity

### 4. Deno
- **Pros**: Security-first approach, built-in TypeScript, modern standards
- **Cons**: Different import system, limited ecosystem compatibility

## Decision Criteria

1. **Performance**: Package installation and build speed
2. **Developer Experience**: Tooling simplicity and TypeScript support
3. **Compatibility**: Ability to work with existing npm packages
4. **Reliability**: Test execution speed and accuracy for financial calculations
5. **Deployment**: Integration with current AWS S3 deployment pipeline

Bun scored highest on performance and developer experience while maintaining full compatibility.

## Success Metrics

- **Development Speed**: 50%+ reduction in `npm install` equivalent time
- **Test Execution**: 30%+ faster test suite execution
- **Build Performance**: Maintained or improved build times
- **Developer Satisfaction**: Reduced friction in development workflow
- **CI/CD Reliability**: No regression in deployment success rate

## Risk Assessment

### Technical Risks
- **Compatibility Issues**: Some npm packages may not work with Bun
  - *Mitigation*: Comprehensive testing and fallback to Node.js if needed
- **Production Deployment**: AWS deployment pipeline requires Bun runtime
  - *Mitigation*: Current deployment builds static files, runtime not needed in production

### Adoption Risks
- **Team Familiarity**: Learning curve for Bun-specific features
  - *Mitigation*: Documentation and gradual adoption approach
- **Debugging**: Different debugging tools and processes
  - *Mitigation*: Maintain Node.js compatibility for debugging if needed

## Configuration Details

### bunfig.toml
```toml
[install]
registry = "https://registry.npmjs.org/"
cache = true
save = true

[run]
shell = "bash"
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  }
}
```

## References

- [Bun Documentation](https://bun.sh/docs)
- [Bun vs Node.js Performance Benchmarks](https://bun.sh/docs/benchmarks)
- [Project Configuration: bunfig.toml](/bunfig.toml)
- [Package Configuration: package.json](/package.json)

## Change Log

- **2025-06-17**: ADR created and approved
- **2025-06-17**: Implementation completed for Phases 1 and 2

---

*This ADR documents the decision to adopt Bun as the primary JavaScript runtime and package manager for improved development performance and simplified tooling.*