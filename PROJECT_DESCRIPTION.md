# Project Description

**Deployed Frontend URL:** https://solkarmav2.vercel.app

**Solana Program ID:** AxLm6hUXXZMoemQaXEKWcdkcXKAKHk4iVcxLsoEWARDS

## Project Overview

### Description

**SolKarma** is a decentralized reputation and tipping platform built on the Solana blockchain. Think of it as "Yelp + DeFi." In the anonymous world of crypto, trust is hard to establish. SolKarma allows users to leave verifiable, on-chain reviews for other wallet addresses (e.g., traders, developers, or friends) and simultaneously reward them with SOL tips.

This dApp moves beyond simple data storage by integrating financial transactions directly into the review process. It features an advanced "Lazy Initialization" architecture, ensuring that users can review any wallet address on Solana immediately, without requiring the target user to register first.

### Key Features

  - **Trust Scoring System**: Automatically calculates and displays a "Trust Score" (Average Rating) and "Total Review Count" for any user.
  - **DeFi Tipping**: Users can attach a SOL tip to their review. The smart contract handles the data entry and the financial transfer in a single atomic transaction.
  - **Lazy Initialization**: You can review *any* wallet address. If the target user doesn't have a profile yet, the system automatically creates one during the review process.
  - **Immutable History**: All reviews are stored on-chain as PDAs, creating a permanent, censorship-resistant history of a wallet's behavior.

### How to Use the dApp

1.  **Connect Wallet**: Click the "Connect Wallet" button to link your Phantom or Solflare wallet.
2.  **Search for a User**: Paste the wallet address of the person you want to review (or check their reputation).
3.  **Check Reputation**: The dashboard will display their "SolKarma Score" (Stars) and how many people have vouched for them.
4.  **Submit a Review**:
      * Select a Star Rating (1-5).
      * Write a short message (e.g., "Fast transaction, very trustworthy").
      * (Optional) Use the slider to add a SOL tip (e.g., 0.05 SOL).
      * Click "Submit" to sign the transaction.
5.  **View History**: Scroll down to see the "Global Feed" or filter to see reviews written specifically by you.

## Program Architecture

The SolKarma program utilizes a dual-account architecture to separate "Aggregated Stats" from "Individual Reviews." This allows the frontend to quickly fetch a user's reputation score without needing to download and calculate thousands of individual review accounts.

### PDA Usage

We use Program Derived Addresses (PDAs) extensively to ensure data uniqueness and secure ownership.

**PDAs Used:**

  - **User Profile PDA**: Derived from seeds `["profile", target_pubkey]`.
      * *Purpose:* Stores the running totals (`total_stars`, `review_count`) for a specific user. There can be only one profile per wallet address.
  - **Review PDA**: Derived from seeds `["review", target_pubkey, reviewer_pubkey]`.
      * *Purpose:* Stores the actual text and rating. The combination of seeds ensures that **User A** can only write **one** review for **User B**, preventing spam/review bombing.

### Program Instructions

**Instructions Implemented:**

  - **`submit_review`**: The core instruction that handles three logic flows simultaneously:
    1.  **Account Management**: Creates the `Review` account. It also checks if the `UserProfile` exists; if not, it uses `init_if_needed` to create it automatically (Reviewer pays rent).
    2.  **Data Update**: Updates the `UserProfile` stats (increments review count and adds stars to the total).
    3.  **Payment**: Performs a CPI (Cross-Program Invocation) to the System Program to transfer the optional SOL tip from the Reviewer to the Target.

### Account Structure

```rust
// 1. The Aggregated Stats Account
#[account]
pub struct UserProfile {
    pub review_count: u64,    // Total number of reviews received
    pub total_stars: u64,     // Sum of all stars (for calculating average)
    pub bump: u8,             // PDA Bump
}

// 2. The Individual Review Account
#[account]
pub struct Review {
    pub reviewer: Pubkey,     // Address of who wrote the review
    pub target: Pubkey,       // Address of who received the review
    pub rating: u8,           // 1-5 Stars
    pub message: String,      // The review content
}
```

## Testing

### Test Coverage

The project includes a comprehensive TypeScript test suite using Anchor to verify logic and security.

**Happy Path Tests:**

  - **Initialize & Review**: User A reviews User B (who has no profile). Verifies that User B's profile is auto-created and the review is saved.
  - **Update Logic**: User C reviews User B. Verifies that User B's `review_count` increments to 2 and `total_stars` updates correctly.
  - **Tipping Functionality**: Verifies that when a tip is included, the SOL balance of User B increases by exactly the tipped amount.

**Unhappy Path Tests:**

  - **Double Review**: Verifies that User A cannot submit a second review for User B (Enforced by PDA seeds).
  - **Invalid Rating**: (Frontend check) Ensures ratings are within the 1-5 byte range.

### Running Tests

```bash
# Install dependencies
yarn install

# Run the local test validator and execute tests
anchor test
```

### Additional Notes for Evaluators

Building SolKarma involved solving several interesting challenges:

1.  **The "Lazy Init" Problem**: I didn't want users to have to "register" before receiving reviews. I solved this using Anchor's `init_if_needed` feature, which creates a smooth UX where the reviewer covers the small rent cost for creating the target's profile.
2.  **Stat Aggregation**: Instead of calculating averages on the frontend (which is slow), I learned to maintain a running "state" on-chain in the `UserProfile` account.
3.  **DeFi Integration**: Adding the tipping feature required understanding Cross-Program Invocations (CPIs) to transfer SOL securely within the custom program.