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

### 2. Borrower-safe amount

The app estimates a maximum borrowing amount based on:

- monthly income
- income type
- income stability
- existing EMIs
- household expenses
- credit score when known

### 3. Rate range

The app provides a prototype interest-rate range rather than a single rate.

The range can change based on:

- income type
- credit score
- existing high-cost debt
- repayment stress

### 4. EMI ceiling

The app gives the borrower a monthly EMI ceiling.

It also shows:

- 36-month EMI
- 48-month EMI
- 60-month EMI

This makes the tenure trade-off visible.

### 5. Stress test

The app shows a 20% higher EMI scenario so the borrower can see the effect of additional monthly repayment pressure.

### 6. Negotiation Card

The final screen gives the borrower:

- recommended amount
- EMI ceiling
- target rate range
- a suggested sentence to use with a lender

---

## Adaptive Questions

The questionnaire changes depending on the borrower's income type.

### Salaried borrower

The app asks about:

- monthly income
- income stability
- existing EMIs
- household expenses
- credit score
- age

### Self-employed borrower

The app additionally asks for:

- documented monthly income

This helps distinguish cash/business income from income that can be supported by documentation.

### Variable / informal borrower

The app additionally asks about:

- expensive existing debt
- number of high-cost loans
- recent bounced EMI
- income stability

This allows the app to identify debt-stacking and repayment-stress situations.

---

## Safety Behaviour

The app is deliberately allowed to recommend **Don't borrow**.

A borrower with expensive outstanding debt and a recent bounced EMI can receive a zero recommended new-borrowing amount.

The product then points the borrower toward considering restructuring, refinancing or reducing existing expensive debt rather than encouraging another loan.

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
- Requested: ₹8,00,000
- Purpose: Wedding

Expected product behaviour:

**Borrow**

Priya has relatively stable income and a strong known credit score, while the requested amount fits within the prototype affordability guardrails.

---

### Ravi

- Age: 42
- Income type: Self-employed
- Cash income: ₹40,000–80,000/month
- ITR income: ₹4,20,000/year
- Requested: ₹15,00,000
- Purpose: Business / stock line + delivery vehicle
- No formal borrowing history / no known credit score
- Owns an unencumbered shop premises

Test assumption:

- Typical monthly income used: ₹60,000
- Documented monthly income used: ₹35,000
- Household costs used for the test: ₹25,000

Expected product behaviour:

**Don't borrow at the requested amount**

The app uses documented income conservatively and routes a large business requirement toward comparing secured business finance.

The household-cost figure above is a test assumption because the challenge brief does not provide Ravi's household-expense amount.

---

### Anita

- Age: 35
- Income type: Variable / informal
- Income: ₹26,000–30,000/month
- Existing high-cost app loans: 3
- High-cost outstanding debt: ₹35,000
- Existing debt rate: 30%+
- Recent EMI bounce: Yes
- Requested: ₹1,50,000
- Purpose: Electric scooter

Test assumption:

- Dependable monthly income used: ₹26,000
- Household costs used for the test: ₹18,000

Expected product behaviour:

**Don't borrow**

The repayment-stress signals trigger the new-borrowing safety override.

The Negotiation Card recommends ₹0 of new borrowing and instead suggests exploring restructuring or refinancing of existing expensive debt.

The household-cost figure above is a test assumption because the challenge brief does not provide Anita's exact household-expense amount.

---

## Project Structure

```text
lokta-borrower-copilot/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── rules.js
│   └── main.jsx
│
├── public/
│
├── docs/
│   ├── run-throughs.md
│   └── walkthrough.md
│
├── RULES.md
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js
└── index.html