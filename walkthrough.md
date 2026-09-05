# Lokta Borrower Copilot — 5-Minute Walkthrough

## 1. Product idea

Lokta is a borrower-side decision-support tool for Indian borrowers. Instead of starting with lender eligibility, it starts with affordability and helps the borrower decide whether to borrow, how much is safe, what rate to negotiate, and what EMI to accept.

The core principle is:

> The amount a lender may offer is not necessarily the amount a borrower should take.

## 2. User flow

The prototype uses a short adaptive questionnaire.

The core questions cover:

- Loan purpose
- Requested amount
- Income type
- Monthly income
- Existing EMIs
- Household expenses
- Income stability
- Credit score, if known
- Age

Additional questions appear when they materially affect the decision.

For example:

- Self-employed borrowers are asked for documented income.
- Informal borrowers are asked about high-cost debt.
- If high-cost debt exists, the prototype asks about active loans and recent bounced payments.

This keeps the questionnaire focused rather than asking every borrower every question.

## 3. Four core outputs

### Borrow / Don't borrow / Borrow less

The first output gives a clear borrowing decision and explains why.

### Borrower-safe amount vs lender capacity

The prototype shows two different numbers:

1. Borrower-safe amount — the amount that fits the prototype's affordability guardrails.
2. Illustrative lender capacity — what a lender might consider based on the same profile.

The borrower-safe amount is the number the user should use when negotiating.

### Rate and total cost

The prototype provides a rate band and estimates the total repayment including an assumed processing fee.

The rate is presented as a prototype negotiation range, not as a guaranteed market quote.

### EMI and stress test

The prototype shows an EMI ceiling, compares 36/48/60-month tenures, and applies a 20% EMI stress case.

## 4. Negotiation Card

The final screen produces a compact Negotiation Card containing:

- Recommended/requested amount
- EMI ceiling
- Rate range
- A suggested question to ask the lender

The goal is to turn the analysis into something a borrower can actually use while comparing loan offers.

## 5. Three test borrowers

### Priya

A stable salaried borrower requesting ₹8L for a wedding.

The prototype returns **Borrow**, with a borrower-safe amount of ₹10.1L and an EMI ceiling of ₹28,700.

### Ravi

A self-employed borrower requesting ₹15L for business needs, with ₹60,000 typical monthly income but ₹35,000 documented income.

The prototype returns **Don't borrow** because the documented income and household costs leave limited room for the requested borrowing. It routes the user toward comparing secured business finance.

### Anita

An informal borrower with variable income, existing expensive debt and a recently bounced EMI.

The prototype returns **Don't borrow** and recommends pausing new borrowing and exploring restructuring or refinancing of existing expensive debt.

## 6. What I would build next

If this prototype continued beyond the challenge, I would prioritize:

1. More carefully sourced and product-specific rate ranges.
2. A more complete APR/all-in-cost calculator using lender-specific fees and repayment schedules.
3. More granular affordability scenarios for irregular income.
4. Better secured-loan comparisons for self-employed borrowers.
5. User testing with real borrowers to validate the question flow and explanations.
6. Additional stress scenarios such as income drops or temporary expense increases.

## 7. What I would cut

I would deliberately avoid adding features that do not improve the borrowing decision:

- Login and account creation
- Credit-bureau integration in the prototype
- Storing personal financial data
- Large lender marketplace features
- Complex dashboards
- Generic AI chat without a decision purpose

The focus should remain on helping the borrower make a safer and more informed borrowing decision.

## 8. Engineering approach

The UI is implemented in React with Vite.

The decision logic is separated into `src/rules.js` rather than being embedded throughout the UI. This makes the affordability, rate, EMI, confidence and routing rules easier to inspect and defend.

`RULES.md` documents the assumptions behind the prototype.

The app is designed to run locally without login, external APIs or personal-data storage.

## 9. Limitations and honesty

This is a decision-support prototype, not a lender or loan approval engine.

The affordability thresholds, rate ranges, processing-fee assumption and lender-capacity calculations are prototype assumptions. They should not be interpreted as guaranteed eligibility, approval, or a universal definition of a fair loan.

For an actual loan, the borrower should compare the lender's disclosed APR, fees, repayment schedule and Key Facts Statement before accepting an offer.