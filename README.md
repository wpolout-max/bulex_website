# Apps

Site to host Android APK downloads published by BulTek Enterprise Ltd. Static files only.

## Add an app

1. Create a GitHub Release. Tag it `my-app-v1.0.0`. Attach `my-app.apk`.
2. Copy the APK link from the release page.
3. Add an entry to `apps.json`. Use the sample as a template.
4. Put the icon in `assets/icons/` and screenshots in `assets/screens/`.
5. Commit and push to `main`. The site updates in about a minute.

Optional: set `sha256` to the APK checksum. Run `sha256sum my-app.apk`.

## Publish

1. Repo Settings, Pages, Source: GitHub Actions.
2. Merge to `main`. The workflow in `.github/workflows/pages.yml` deploys the site.

## Test locally

    python3 -m http.server 8000

Open http://localhost:8000.
