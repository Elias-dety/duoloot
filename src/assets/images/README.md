Store image assets for the app here.

Production visual assets are synced from `duoloot-production-assets-transparent-v2`.
The transparent v2 package does not include `*-thumb.webp` files, so the app-level
`Thumb` aliases point to the transparent production WEBP files. The
`icon-matchmaking-trust.webp` file in the source package was empty, so the app uses
the transparent PNG for that asset.
