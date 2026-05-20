# Contributing

## Development setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run the demo: `npm run dev`

## Making changes

1. Create a branch from `main`
2. Make your changes in `src/`
3. Verify the build passes: `npm run build`
4. Open a pull request against `main`

The `Build` workflow runs on every push and pull request to verify the build passes before merge.

## Release process

Releases happen automatically when a pull request is merged into `main`:

1. The `Publish` workflow triggers on push to `main`
2. The patch version is bumped automatically via `npm version patch`
3. The package is rebuilt and the version commit + git tag are pushed back to `main`
4. The package is published to npm via [npm Trusted Publishers](https://docs.npmjs.com/generating-provenance-statements) — no stored npm token required

### Manual release

A release can also be triggered manually from the [Actions tab](../../actions/workflows/publish.yml) using the **Run workflow** button. This is useful if the automatic publish failed and needs to be retried.

### Minor and major version bumps

The automated workflow only does patch bumps. For a minor or major release, bump the version manually before opening your PR:

```
npm version minor
# or
npm version major
```

Then push the version commit. The publish workflow will skip its own `npm version patch` if the version was already bumped (the `git commit || true` is a no-op when there is nothing new to commit).

## First-time setup for new packages (maintainers)

If you fork this or create a similar package, configure npm Trusted Publishers on the package page at [npmjs.com](https://www.npmjs.com/package/@wezz/ariamanager):

- **Publisher:** GitHub Actions
- **Repository owner:** `wezz`
- **Repository name:** `ARIAManager`
- **Workflow filename:** `publish.yml`

This replaces the need for a stored `NODE_AUTH_TOKEN` secret entirely.
