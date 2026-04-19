![Fluxo banner](documentantion/assets/banner-docs.png)

## Table of Contents

1. [Overview](#overview)
2. [Problem](#problem)
3. [Solution](#solution)
4. [How It Works](#how-it-works)
5. [Tech Stack](#tech-stack)
6. [Architecture](#architecture)
7. [Getting Started](#getting-started)
8. [Team](#team)

---

## Overview

**Fluxo** is a stablecoin-powered payment platform that enables international students to pay their university tuition without the friction of traditional wire transfers — no hidden fees, no 5-7 business day delays, no unfavorable exchange rates.

Students connect their wallet, select their institution, and pay in USDC or USDT. The university receives the funds in their preferred currency. That's it.

---

## Problem

International students face a broken payment experience when paying tuition abroad:

- **High fees** — wire transfers charge $25–$50 flat, plus 1–3% FX markup
- **Slow settlement** — international transfers take 3–7 business days
- **Exchange rate risk** — rates fluctuate between initiation and settlement
- **Complexity** — students need SWIFT codes, intermediary banks, and manual form-filling
- **No transparency** — it's hard to know when (or if) the payment arrived

For the ~6 million international students in the US alone, this is a recurring, stressful, and expensive problem.

---

## Solution

Fluxo replaces the wire transfer with a stablecoin payment rail:

| | Traditional Wire | Fluxo |
|---|---|---|
| Fee | $25–$50 + FX markup | < $1 |
| Settlement | 3–7 business days | Minutes |
| Transparency | Opaque | On-chain, trackable |
| Complexity | High | Connect wallet, confirm, done |

By using stablecoins (USDC/USDT), students avoid currency volatility while still transacting on a blockchain — getting the best of both worlds.

---

## How It Works

### Student Flow

1. **Sign up** — student creates an account and verifies their student ID
2. **Select institution** — choose from the list of partner universities
3. **Enter amount** — enter tuition amount due (in USD or local currency)
4. **Connect wallet** — connect via MetaMask or WalletConnect
5. **Confirm payment** — transaction is sent on-chain in USDC/USDT
6. **Receipt issued** — student receives a payment confirmation with tx hash

### University Flow

1. Institution registers on Fluxo and provides their receiving wallet or bank details
2. Payments arrive in stablecoin form and can be auto-converted to fiat if needed
3. University dashboard shows incoming payments in real time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js / Python (FastAPI) |
| Blockchain | Base (EVM-compatible L2) |
| Stablecoin | USDC (Circle) |
| Wallet Integration | WalletConnect, MetaMask SDK |
| Database | Supabase |
| Auth | Supabase Auth |

> We chose **Base** as our chain for its low gas fees, EVM compatibility, and USDC native support via Circle.

---

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Student   │ ──pay──▶│  Fluxo App   │──tx────▶│   Base Network   │
│   (wallet)  │         │  (Next.js)   │         │  (USDC on-chain) │
└─────────────┘         └──────┬───────┘         └────────┬─────────┘
                               │                          │
                         ┌─────▼──────┐           ┌──────▼──────────┐
                         │  Supabase  │           │   University    │
                         │  (users,   │           │   Wallet /      │
                         │  records)  │           │   Fiat Offramp  │
                         └────────────┘           └─────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A wallet with USDC on Base (testnet for dev)
- Supabase project

### Installation

```bash
git clone https://github.com/your-org/fluxo
cd fluxo
npm install
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_project_id
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Team

| Name | Role |
|---|---|
| [Your Name] | Full Stack / Blockchain |
| [Teammate] | Frontend / Design |
| [Teammate] | Backend / Smart Contracts |

---

*Built at Hesburgh Hackathon · [04/19/2026]*