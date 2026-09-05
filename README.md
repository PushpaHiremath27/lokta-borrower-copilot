# Lokta Borrower Copilot

A borrower-first decision-support prototype for Indian borrowers.

Lokta helps a borrower answer four questions before accepting a loan:

1. Should I borrow at all?
2. How much can I safely carry?
3. What interest rate should I negotiate for?
4. What EMI should I agree to?

It then produces a one-screen Negotiation Card that the borrower can use when comparing lender offers.

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

### 1. Borrowing decision

The app returns one of:

- **Borrow**
- **Borrow less**
- **Don't borrow**

Every decision includes a short explanation.

The prototype is deliberately allowed to recommend **Don't borrow** when the affordability or repayment-stress signals are too severe.

### 2. Borrower-safe amount

The app estimates a maximum borrowing amount based on:

- monthly income
- income type
- income stability
- existing EMIs
- household expenses
- credit score when known

The calculation uses prototype FOIR-style affordability guardrails and a residual-income check.

### 3. Illustrative lender capacity

The app also provides an illustrative lender-side capacity.

This is intentionally shown separately from the borrower-safe amount.

It is not a lender approval prediction and should not be interpreted as a guaranteed sanction amount.

### 4. Interest-rate range

The app provides an **illustrative interest-rate range** rather than a single rate.

The range can change based on:

- income type
- credit score
- existing high-cost debt
- recent repayment stress

The displayed rate is a prototype nominal annual interest-rate range.

It is **not a lender quote and not a calculated APR**.

### 5. EMI ceiling

The app gives the borrower a monthly EMI ceiling.

It also shows:

- 36-month EMI
- 48-month EMI
- 60-month EMI

This makes the tenure trade-off visible.

A longer tenure generally reduces monthly EMI but increases the overall repayment period and can increase total interest paid.

### 6. Stress test

The app shows a 20% higher EMI scenario.

This gives the borrower a simple view of what repayment could look like under additional monthly pressure.

### 7. Cost check

The app estimates total repayment cost using:

- the requested principal
- the upper end of the illustrative rate range
- the reference 48-month tenure
- a prototype 2% processing-fee assumption

The processing fee is shown separately so that the borrower does not compare loans using interest rate alone.

This is a prototype cost estimate, not a lender quotation or regulatory APR calculation.

### 8. Negotiation Card

The final screen gives the borrower:

- recommended amount
- EMI ceiling
- target interest-rate range
- a suggested sentence to use with a lender
- next-step guidance

The card is designed to be useful while comparing or negotiating loan offers.

---

## Adaptive Questions

The questionnaire changes depending on the borrower's income type.

The goal is to collect enough information to make the decision useful without requiring login, bureau access, or personal-data storage.

### Salaried borrower

The app asks about:

- borrowing purpose
- requested amount
- monthly income
- income stability
- existing EMIs
- household expenses
- credit score, when known
- age

### Self-employed borrower

The app additionally asks for:

- documented monthly income

This helps distinguish reported business/cash income from income that can be supported by documentation.

### Variable / informal borrower

The app additionally asks about:

- expensive existing debt
- recent bounced EMI
- income stability

If expensive debt is present, the bounced-EMI question is asked conditionally.

These questions help identify debt-stacking and repayment-stress situations.

---

## Unknown Information

Unknown information is not automatically treated as a positive signal.

For example:

- unknown credit score does not become a high score
- missing documentation does not become documented income
- missing optional information reduces confidence where appropriate

This is important because a borrower should not receive a falsely precise recommendation simply because information was not provided.

---

## Safety Behaviour

The app is deliberately allowed to recommend **Don't borrow**.

For example, a variable/informal borrower with expensive outstanding debt, an existing EMI burden and a recent bounced EMI can receive:

- **Don't borrow**
- **₹0 recommended new borrowing**
- **₹0 new EMI ceiling**
- no recommended new rate
- a next step focused on restructuring, refinancing or reducing existing expensive debt

The prototype therefore does not optimise only for the largest possible loan.

---

## Three Test Borrowers

The prototype was tested against the three borrowers supplied in the challenge.

### Priya

- Age: 29
- Income type: Salaried
- Net income: ₹1,10,000/month
- Existing EMI: ₹14,000
- Household costs used in the test: ₹28,000
- Credit score: 780
- Requested amount: ₹8,00,000
- Purpose: Wedding

Expected product behaviour:

**Borrow**

Priya has stable salaried income and a strong known credit score, while the requested amount is close to and within the prototype's borrower-safe affordability range.

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

- Typical monthly income used: ₹80,000
- Documented monthly income used: ₹35,000
- Household costs used for the test: ₹30,000

Expected product behaviour:

**Don't borrow at the requested amount**

The app uses documented income conservatively for affordability.

Because the requested business requirement is large, the product also routes Ravi toward comparing secured business finance rather than relying only on an expensive unsecured personal loan.

The household-cost figure is a test assumption because the challenge brief does not provide Ravi's exact household-expense amount.

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

- Dependable monthly income used: ₹26,000
- Existing EMI used: ₹10,000
- Household costs used for the test: ₹15,000

Expected product behaviour:

**Don't borrow**

The repayment-stress signals trigger the new-borrowing safety override.

The Negotiation Card recommends:

**Do not borrow**

It instead suggests considering restructuring, refinancing or repayment of existing expensive debt before taking on another loan.

The household-cost figure is a test assumption because the challenge brief does not provide Anita's exact household-expense amount.

---

## Core Decision Logic

The prototype separates three important numbers:

### Borrower-safe amount

This is calculated from the borrower's affordability information.

The calculation considers:

- income
- borrower-type FOIR
- existing EMI
- household expenses
- income stability
- high-cost debt and repayment stress

The safe amount is calculated using the upper end of the applicable illustrative rate band over a 48-month reference tenure.

This intentionally makes the borrower-safe amount more conservative.

### Illustrative lender capacity

This uses a separate, somewhat more permissive FOIR-style calculation.

It uses the lower end of the applicable illustrative rate band and a 60-month reference tenure.

For informal income, an additional prototype cap is applied.

This number is labelled as **illustrative lender capacity**, not guaranteed sanction.

### Requested amount

This is simply the amount entered by the borrower.

The decision compares the requested amount with the borrower-safe amount and applies additional repayment-stress safeguards.

---

## Privacy

The prototype does not require:

- login
- bank-account access
- credit-bureau access
- document upload
- backend storage

The calculations run locally in the browser.

No personal borrower profile is persisted by the prototype.

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

- Node.js
- npm

### Install dependencies

```bash
npm install