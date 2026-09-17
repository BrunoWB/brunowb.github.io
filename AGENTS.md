# Antigravity Operating Guide: Scyan ZMK Ecosystem

Persistent architectural reference for Antigravity pair programming in `hello-web` (`brunowb.github.io`).

---

## 1. Ecosystem Directory & Role Map

| Repository | Local Path (Host: `/var/home/Scyan/` == `/home/Scyan/`) | Stack | Role |
| :--- | :--- | :--- | :--- |
| **`hello-web`** *(Here)* | `Projects/Web/hello-web/` | React 19 / TS / Vite / Tailwind v4 | Public developer landing page & project portal with interactive CV. |
| **`plasma-screen-manager`** | `Projects/Linux/plasma-screen-manager/` | QML / Python / KDE | Wayland multi-monitor manager plasmoid for KDE Plasma 6. |
| **`scyan-zmk-studio`** | `Projects/Web/scyan-zmk-studio/` | React 19 / TS 6 / Vite | Visual display IDE & layout compiler to C header. |
| **`bwpx-editor`** | `Projects/Web/bwpx-editor/` | React 19 / Vite | Upstream pixel editor & raster algorithm core (`BwpxGrid`). |
| **`scyan-zmk-module`** | `Projects/Firmware/scyan-zmk-module/` | Embedded C / Zephyr | Runtime 1bpp blitter, transform (90° rot), and widget engine. |
| **`zmk-config`** | `Projects/Firmware/zmk-config/` | West / Kconfig / CI | Corne split keyboard config; CI builds `.uf2` on asset push. |

---

## 2. Portal Role & Synergy

`hello-web` is the personal landing page hosted on GitHub Pages (`https://brunowb.github.io`). It showcases Bruno's projects and tools:
* `plasma-screen-manager` (KDE Store: `https://store.kde.org/p/2371012/`)
* `scyan-zmk-studio` (Live at `https://brunowb.github.io/scyan-zmk-studio`)
* `bwpx-editor` (Live at `https://brunowb.github.io/bwpx-editor`)

---

## 3. Architectural Guidelines for Antigravity

1. **Modern React 19 + Vite Architecture**:
   Structured with clean separation of concerns: presentation components, Tailwind v4 design tokens (`@theme`), typed data dictionaries (`src/data/`), and sequenced typewriter animation hooks.
2. **Multi-Language Parity**:
   Maintain content translation parity across English (`en`), French (`fr`), and Portuguese (`pt`) across all dictionaries (`cvData.ts`, `projectsData.ts`, `uiTranslations.ts`).
3. **Live Links Accuracy**:
   Ensure project showcase cards and repo badges accurately point to active GitHub Pages URLs and repositories.

