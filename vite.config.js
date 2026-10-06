import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve, dirname } from 'path';
import { readdirSync, existsSync, statSync, cpSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-detect libraries from node_modules based on common patterns
// Handled explicitly by viteStaticCopy below — don't double-copy (causes EIO on Windows).
// Note: @fullcalendar/* packages are intentionally NOT listed here -- they ship no
// dist/src/css/font folder for autoDetectLibs() to ever match, so excluding them
// would be a no-op; they're only reachable via the explicit viteStaticCopy targets.
const EXCLUDE = new Set([
  'apexcharts', 'simplebar', 'preline', 'flatpickr', 'lucide-static',
]);

function autoDetectLibs() {
  const libs = [];
  const nodeModules = resolve(__dirname, 'node_modules');

  if (!existsSync(nodeModules)) return libs;

  const packages = readdirSync(nodeModules).filter(name => !name.startsWith('.'));

  packages.forEach(pkg => {
    if (EXCLUDE.has(pkg)) return;
    const pkgPath = resolve(nodeModules, pkg);
    const distPath = resolve(pkgPath, 'dist');

    if (!statSync(pkgPath).isDirectory()) return;
    
    if (existsSync(distPath) && statSync(distPath).isDirectory()) {
      const files = readdirSync(distPath).filter(f => !f.endsWith('.map'));
      if (files.length > 0) {
        libs.push({
          src: `node_modules/${pkg}/dist`,
          dest: `libs/${pkg}`,
          rename: { stripBase: true }
        });
      }
    }
  });
  
  const scopedPackages = packages.filter(name => name.startsWith('@'));
  scopedPackages.forEach(scope => {
    const scopePath = resolve(nodeModules, scope);
    if (!statSync(scopePath).isDirectory()) return;
    
    const scopedLibs = readdirSync(scopePath).filter(name => !name.startsWith('.'));
    scopedLibs.forEach(pkg => {
      if (EXCLUDE.has(`${scope}/${pkg}`)) return;
      const pkgPath = resolve(scopePath, pkg);
      const distPath = resolve(pkgPath, 'dist');
      const srcPath = resolve(pkgPath, 'src');
      const cssPath = resolve(pkgPath, 'css');
      const fontPath = resolve(pkgPath, 'font');
      
      if (!statSync(pkgPath).isDirectory()) return;
      
      if (existsSync(distPath) && statSync(distPath).isDirectory()) {
        const files = readdirSync(distPath).filter(f => !f.endsWith('.map'));
        if (files.length > 0) {
          libs.push({
            src: `node_modules/${scope}/${pkg}/dist`,
            dest: `libs/${scope}/${pkg}`,
            rename: { stripBase: true }
          });
        }
      }
      else if (existsSync(srcPath) && statSync(srcPath).isDirectory()) {
        const subdirs = readdirSync(srcPath).filter(d => statSync(resolve(srcPath, d)).isDirectory());
        subdirs.forEach(subdir => {
          const files = readdirSync(resolve(srcPath, subdir)).filter(f => 
            f.endsWith('.css') || f.endsWith('.woff') || f.endsWith('.woff2') || f.endsWith('.ttf')
          );
          if (files.length > 0) {
            libs.push({
              src: `node_modules/${scope}/${pkg}/src/${subdir}`,
              dest: `libs/${scope}/${pkg}/${subdir}`,
              rename: { stripBase: true }
            });
          }
        });
      }
      else if (existsSync(cssPath) && statSync(cssPath).isDirectory()) {
        libs.push({
          src: `node_modules/${scope}/${pkg}/css`,
          dest: `libs/${scope}/${pkg}/css`,
          rename: { stripBase: true }
        });
      }
      else if (existsSync(fontPath) && statSync(fontPath).isDirectory()) {
        libs.push({
          src: `node_modules/${scope}/${pkg}/font`,
          dest: `libs/${scope}/${pkg}/font`,
          rename: { stripBase: true }
        });
      }
    });
  });
  
  return libs;
}

// Custom plugin to natively copy auto-detected libraries, bypassing Rollup tracking for speed
function autoCopyLibsPlugin() {
    let copied = false;
    const doCopy = () => {
        if (copied) return;
        copied = true;
        const libs = autoDetectLibs();
        libs.forEach(lib => {
            const srcPath = resolve(__dirname, lib.src);
            const destPath = resolve(__dirname, 'public/build', lib.dest);
            if (!existsSync(srcPath)) return;
            try {
                cpSync(srcPath, destPath, { recursive: true, force: true });
            } catch (e) {
                console.warn(`⚠️  auto-copy-libs: skipped ${lib.dest} (${e.code || e.message})`);
            }
        });
        console.log(`\n📦 Auto-copied ${libs.length} auto-detected libraries!\n`);
    };

    return {
        name: 'auto-copy-libs',
        configureServer(server) {
            server.httpServer?.once('listening', () => {
                doCopy();
            });
            // Fallback for some setups
            setTimeout(doCopy, 1000);
        },
        closeBundle() {
            doCopy();
        }
    }
}

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/style.css',
                'resources/css/choices-theme.css',
                'resources/css/date-range-picker.css',
                'resources/js/calendar-data.js',
                'resources/js/carousel.js',
                'resources/js/charjs-chart-data.js',
                'resources/js/chart-data.js',
                'resources/js/choices-init.js',
                'resources/js/clipboard.js',
                'resources/js/datatable.js',
                'resources/js/date-range-picker.js',
                'resources/js/import-export.js',
                'resources/js/kanban.js',
                'resources/js/range-slider.js',
                'resources/js/script.js',
                'resources/js/wizard.js',
            ],
            refresh: true,
        }),
        autoCopyLibsPlugin(),
        tailwindcss(),
        viteStaticCopy({
            targets: [                
                { src: "node_modules/apexcharts/dist/apexcharts.min.js", dest: "libs/apexcharts", rename: { stripBase: true } },
                { src: "node_modules/apexcharts/dist/apexcharts.css", dest: "libs/apexcharts", rename: { stripBase: true } },
                { src: "node_modules/simplebar/dist/simplebar.min.css", dest: "libs/simplebar", rename: { stripBase: true } },
                { src: "node_modules/simplebar/dist/simplebar.min.js", dest: "libs/simplebar", rename: { stripBase: true } },
                { src: "node_modules/preline/dist/preline.js", dest: "libs/preline", rename: { stripBase: true } },
                { src: "node_modules/@fullcalendar/core/index.global.js", dest: "libs/fullcalendar", rename: { stripBase: true, name: "core.global.js" } },
                { src: "node_modules/@fullcalendar/daygrid/index.global.js", dest: "libs/fullcalendar", rename: { stripBase: true, name: "daygrid.global.js" } },
                { src: "node_modules/@fullcalendar/timegrid/index.global.js", dest: "libs/fullcalendar", rename: { stripBase: true, name: "timegrid.global.js" } },
                { src: "node_modules/@fullcalendar/list/index.global.js", dest: "libs/fullcalendar", rename: { stripBase: true, name: "list.global.js" } },
                { src: "node_modules/@fullcalendar/interaction/index.global.js", dest: "libs/fullcalendar", rename: { stripBase: true, name: "interaction.global.js" } },
                { src: "node_modules/flatpickr/dist/flatpickr.min.css", dest: "libs/flatpickr", rename: { stripBase: true } },
                { src: "node_modules/flatpickr/dist/flatpickr.min.js", dest: "libs/flatpickr", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.css", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.eot", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.woff2", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.woff", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.ttf", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/lucide-static/font/lucide.svg", dest: "libs/lucide", rename: { stripBase: true } },
                { src: "node_modules/choices.js/public/assets/styles/choices.min.css", dest: "libs/choices.js/public/assets/styles", rename: { stripBase: true } },
                { src: "node_modules/choices.js/public/assets/scripts/choices.min.js", dest: "libs/choices.js/public/assets/scripts", rename: { stripBase: true } },
                { src: "node_modules/prismjs/themes/prism.min.css", dest: "libs/prismjs/themes", rename: { stripBase: true } },
                { src: "node_modules/wnumb/wNumb.min.js", dest: "libs/wnumb", rename: { stripBase: true } },
                { src: "node_modules/@fortawesome/fontawesome-free/webfonts/*", dest: "libs/@fortawesome/fontawesome-free/webfonts", rename: { stripBase: true } },

                // Copy resources images to public/build/img
                { src: 'resources/img/**/*', dest: 'img', rename: { stripBase: 2 } },
            ],
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        outDir: 'public/build',
        rolldownOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/[name][extname]';
                    }
                    if (assetInfo.name && assetInfo.name.match(/\.(png|jpe?g|gif|svg)$/)) {
                        return 'img/[name][extname]';
                    }
                    return '[name][extname]';
                },
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
            },
        },
    },
});