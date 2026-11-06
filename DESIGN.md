# SolMit Design System & Craft Guidelines

## 1. Product Truth & Visual World
**SolMit** is an institutional-grade Solana Nexus designed for high-frequency on-chain operations: transfers, faucet claims, SPL token deployments, Jupiter decentralized swaps, and cryptographic message signing.

- **Mode:** Operate & Experience
- **Theme:** Obsidian / Cyber-Institutional Solana Dark (`#06070a`)
- **Tone:** Precise, trustworthy, tactile, and fast.

---

## 2. Craft Floor & Anti-Patterns (Impeccable Standards)

### Bans & Refusals
- **No gradient text on body or headings:** Emphasis is achieved through weight, size, and crisp font hierarchy.
- **No redundant eyebrows/kickers:** Headings carry their own weight without decorative subtitles.
- **No Unicode emojis as status icons:** All status states, actions, and empty states use authored inline SVGs with coherent stroke-weight (`2px` on `24x24` grid).
- **No ungrounded glowing blur blocks:** Soft ambient lighting is restricted to subtle background atmospheric layers (`rgba(153, 69, 255, 0.12)` max).

### Contrast & Typography
- **Body / Placeholder Contrast:** ≥ 4.5:1. Muted text is tinted using Slate (`#94a3b8` / `text-slate-400`), never invisible dark gray.
- **Primary Typeface:** `Plus Jakarta Sans` (weights: 500, 600, 700, 800) with tight tracking on headings (`tracking-tight`).
- **Data / Monospace:** `JetBrains Mono` for addresses, hashes, transaction signatures, and numerical currency figures.

---

## 3. Motion & Interaction Standards (Emil Kowalski Rules)

- **Sub-250ms Rule:** UI transitions and micro-interactions complete in 150ms–200ms.
- **Physics & Easing:**
  - Standard ease: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring deceleration).
  - **`ease-in` is strictly banned** for entering UI elements.
- **Property Restriction:** Only animate GPU-composited properties (`transform`, `opacity`). Never animate layout properties (`width`, `height`, `margin`, `top`).
- **No Zero-Scale Entrances:** Scale transitions animate from `scale(0.95)` to `scale(1)` with opacity, avoiding unnatural `scale(0)` pops.
- **Tactile Feedback:** Buttons feature active micro-presses (`active:scale-[0.98]`). Copy actions smoothly morph into checkmarks with immediate toast feedback.
- **Accessibility:** Full `prefers-reduced-motion` compliance.

---

## 4. Color Palette & Tokens

- **Background Canvas:** `#06070a`
- **Surface Card:** `rgba(13, 15, 24, 0.85)` with `rgba(255, 255, 255, 0.08)` border and `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` top highlight
- **Accent Emerald (Solana Green):** `#14f195` / `#10b981` (Success, Primary CTA, Active badges)
- **Accent Purple (Solana Purple):** `#9945ff` (Metaplex metadata, secondary accents)
- **Accent Cyan (Solana Blue):** `#00c2ff` (Mainnet cluster, info badges)
- **Status Amber:** `#f59e0b` (Devnet warnings, faucet rate-limit advisories)
- **Status Red:** `#ef4444` (Transaction reverts, input errors)

