# Automatic Versioning & Publishing

This repository uses automatic semantic versioning and publishing on every merge to `main`.

## How It Works

### Automatic Patch Versions (Default)

Every merge to `main` automatically:

1. Bumps the **patch version** (e.g., 1.0.0 → 1.0.1)
2. Runs all tests
3. Creates a GitHub Release
4. Publishes to GitHub Packages

### Minor Versions

To trigger a **minor** version bump (e.g., 1.0.0 → 1.1.0), use commit messages that start with:

- `feat:` or `feature:`
- Or include `minor:` anywhere in the message

**Example:**

```bash
git commit -m "feat: add new theme support"
# Results in: 1.0.0 → 1.1.0
```

### Major Versions

To trigger a **major** version bump (e.g., 1.0.0 → 2.0.0), include one of these in your commit message:

- `BREAKING CHANGE:` in the commit body
- `major:` anywhere in the message

**Example:**

```bash
git commit -m "major: remove deprecated API

BREAKING CHANGE: The old renderHighlight() API has been removed"
# Results in: 1.0.0 → 2.0.0
```

## Workflow Behavior

### On Push to Main:

1. ✅ Detects version type from commit message
2. ✅ Bumps version in `package.json`
3. ✅ Commits version bump with `[skip ci]` to prevent loops
4. ✅ Runs test suite
5. ✅ Creates GitHub Release with tag
6. ✅ Publishes to GitHub Packages

### Skip Publishing:

The workflow automatically skips when:

- Commit message contains `[skip ci]`
- Commit is a version bump (prevents infinite loops)

## Manual Publishing

If you need to publish manually:

```bash
# 1. Update version
npm version patch  # or minor, or major

# 2. Push with tag
git push origin main --tags

# 3. Create GitHub Release (triggers publish.yml)
gh release create v1.0.1 --generate-notes
```

## Package Location

Packages are published to:

- **GitHub Packages**: `https://npm.pkg.github.com/@tecknition/<package-name>`

## Installation

Users can install the package with:

```bash
npm install @tecknition/<package-name>@latest
```

Or a specific version:

```bash
npm install @tecknition/<package-name>@1.2.3
```
