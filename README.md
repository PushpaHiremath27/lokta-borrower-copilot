# Lokta Borrower Copilot

A borrower-first decision-support prototype for Indian borrowers.

Lokta helps a borrower answer four questions before accepting a loan:

1. Should I borrow at all?
2. How much can I safely carry?
3. What interest rate should I negotiate for?
4. What EMI should I agree to?

It then produces a one-screen **Negotiation Card** that the borrower can use when comparing lender offers.

---

## Product Idea

Lenders have models that estimate how much they are willing to lend.

Borrowers often do not have an equivalent way to judge how much they should borrow.

Lokta separates:

- **Borrower-safe amount** — what fits the prototype's affordability guardrails.
- **Illustrative lender capacity** — what a simplified lender-side model may consider.
- **Requested amount** — what the borrower wants.

The borrower-safe number is the primary number used for negotiation.

---

## What the App Does

### Borrowing Decision

The app returns one of three outcomes:

- **Borrow**
- **Borrow less**
- **Don't borrow**

Every decision includes an explanation.

### Borrower-Safe Amount

The estimate considers:

- monthly income
- income type
- income stability
- existing EMIs
- household expenses
- credit score when known

The calculation uses prototype FOIR-style affordability guardrails and a residual-income check.

### Illustrative Lender Capacity

A separate lender-side capacity is shown.

It is **not** a lender approval prediction or guaranteed sanction amount.

It is intended only as a comparison point between what a simplified lender-side model might consider and what the borrower can comfortably carry.

### Interest-Rate Range

The app provides an **illustrative nominal annual interest-rate range**.

The range changes based on:

- income type
- credit score
- existing high-cost debt
- repayment stress

It is **not a lender quote and not a calculated APR**.

### EMI Ceiling

The app gives an EMI ceiling and compares:

- 36 months
- 48 months
- 60 months

This makes the tenure trade-off visible:

- shorter tenure → higher EMI, lower total interest
- longer tenure → lower EMI, higher total interest

### Stress Test

The app shows a **20% higher EMI scenario** to illustrate additional repayment pressure.

This is intended as a simple affordability stress signal rather than a prediction of future income or interest-rate changes.

### Cost Check

The app estimates total repayment cost using:

- requested principal
- upper end of the illustrative rate range
- 48-month reference tenure
- prototype 2% processing fee

The processing fee is shown separately.

This is a prototype cost estimate, **not a lender quotation or regulatory APR calculation**.

### Negotiation Card

The final screen provides:

- recommended amount
- EMI ceiling
- target interest-rate range
- suggested lender negotiation sentence
- next-step guidance

The goal is to give the borrower a concise reference point when comparing loan offers.

---

## Adaptive Questions

The questionnaire changes depending on income type.

The design aims to collect roughly 8–10 high-value questions rather than asking every borrower the same long form.

### Salaried Borrower

The app asks about:

- borrowing purpose
- requested amount
- monthly income
- income stability
- existing EMIs
- household expenses
- credit score, when known
- age

### Self-Employed Borrower

The app additionally asks for:

- documented monthly income

This helps distinguish business/cash income from income supported by documentation.

### Variable / Informal Borrower

The app asks about:

- expensive existing debt
- recent bounced EMI
- income stability

The bounced-EMI question is conditional on expensive debt being present.

These questions help identify debt-stacking and repayment-stress situations.

---

## Unknown Information

Unknown information is not automatically treated as a positive signal.

Examples:

- unknown credit score does not become a high score
- missing documentation does not become documented income
- missing optional information reduces confidence where appropriate

This is important because the prototype should not manufacture certainty from missing information.

---

## Safety Behaviour

The prototype is deliberately allowed to recommend **Don't borrow**.

A variable/informal borrower with expensive debt, existing EMI pressure and a recent bounced EMI can receive:

- **Don't borrow**
- **₹0 recommended new borrowing**
- **₹0 new EMI ceiling**
- no recommended new rate
- guidance toward restructuring, refinancing or reducing existing expensive debt

The prototype does not optimise only for the largest possible loan.

The purpose is borrower decision support rather than maximising loan eligibility.

---

## Three Test Borrowers

### Priya

- Age: 29
- Income type: Salaried
- Net income: ₹1,10,000/month
- Existing EMI: ₹14,000
- Household costs used: ₹28,000
- Credit score: 780
- Requested amount: ₹8,00,000
- Purpose: Wedding

Expected behaviour:

**Borrow**

Priya represents a relatively stable salaried borrower with strong documented repayment signals and a manageable requested amount.

---

### Ravi

- Age: 42
- Income type: Self-employed
- Cash income: ₹40,000–80,000/month
- ITR income: ₹4,20,000/year
- Requested amount: ₹15,00,000
- Purpose: Business / stock line + delivery vehicle
- No formal borrowing history / no known credit score
- Owns an unencumbered shop premises

Test assumptions:

- Typical monthly income: ₹80,000
- Documented monthly income: ₹35,000
- Household costs: ₹30,000

Expected behaviour:

**Don't borrow at the requested amount**

The app uses documented income conservatively and routes the large business requirement toward comparing secured business finance.

---

### Anita

- Age: 35
- Income type: Variable / informal
- Income: ₹26,000–30,000/month
- Existing high-cost app loans: 3
- High-cost outstanding debt: ₹35,000
- Existing debt rate: 30%+
- Recent EMI bounce: Yes
- Requested amount: ₹1,50,000
- Purpose: Electric scooter

Test assumptions:

- Dependable monthly income: ₹26,000
- Existing EMI: ₹10,000
- Household costs: ₹15,000

Expected behaviour:

**Don't borrow**

The repayment-stress signals trigger the new-borrowing safety override.

---

## Core Decision Logic

### Borrower-Safe Amount

The calculation considers:

- income
- borrower-type FOIR
- existing EMI
- household expenses
- income stability
- high-cost debt
- repayment stress

The safe amount uses the upper end of the applicable illustrative rate band over a 48-month reference tenure.

This deliberately avoids assuming the borrower will receive the cheapest rate.

### Illustrative Lender Capacity

The lender-side calculation uses:

- lender FOIR
- lower end of the illustrative rate band
- 60-month reference tenure

An additional prototype cap is applied for informal income.

This is **not a guaranteed sanction amount**.

### Requested Amount

The requested amount is compared with borrower-safe capacity.

Additional repayment-stress safeguards can override the normal result.

The decision is therefore based on borrower affordability first rather than simply asking whether a lender could theoretically lend the requested amount.

---

## Rate and Fee Transparency

The prototype separates:

- nominal interest-rate range
- processing fee
- estimated total repayment cost

The displayed rate range is intentionally labelled as a **nominal annual interest-rate range**, not APR.

The prototype currently uses a **2% processing-fee assumption** for cost illustration.

Because this is not connected to a specific lender's complete fee schedule, taxes, insurance, documentation charges, late fees, or other possible charges are not modelled.

Therefore the cost check should be treated as a comparison aid rather than a regulatory APR calculation.

---

## Privacy

The prototype does not require:

- login
- bank-account access
- credit-bureau access
- document upload
- backend storage

Calculations run locally in the browser.

No personal borrower profile is persisted.

---

## Technology

Built with:

- React
- Vite
- JavaScript
- CSS

There is no backend.

---

## Running Locally

### Requirements

Install:

- Node.js
- npm

### Install Dependencies

From the project directory:

```bash
npm install