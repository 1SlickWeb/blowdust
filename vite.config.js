import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * public/images/gallery/ is the client's raw phone-photo drop folder — ~25MB
 * of JPEGs that `npm run gallery` turns into the WebP derivatives under
 * opt/. Only the derivatives are ever referenced, but Vite copies publicDir
 * verbatim, so the originals would double the deploy for nothing. Keep them
 * in the repo (they're the regeneration source), drop them from the bundle.
 */
function dropGalleryOriginals() {
  return {
    name: 'drop-gallery-originals',
    apply: 'build',
    closeBundle() {
      const dir = path.resolve(__dirname, 'dist/images/gallery')
      if (!fs.existsSync(dir)) return
      let freed = 0
      for (const file of fs.readdirSync(dir)) {
        if (!/\.jpe?g$/i.test(file)) continue
        const abs = path.join(dir, file)
        freed += fs.statSync(abs).size
        fs.rmSync(abs)
      }
      if (freed) {
        this.info(
          `dropped gallery originals from dist (${(freed / 1048576).toFixed(1)}MB)`,
        )
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dropGalleryOriginals()],
  resolve: {
    alias: {
      // shadcn-style "@/..." imports resolve to src/
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
