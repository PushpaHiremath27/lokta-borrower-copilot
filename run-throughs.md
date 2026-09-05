# Lokta Borrower Copilot — Run-Throughs

## Purpose

These three run-throughs demonstrate how Lokta adapts its questions and produces a borrowing decision for different borrower profiles.

The outputs below were generated from the current prototype rules and current app version.

---

# 1. Priya — Salaried Borrower

## Borrower profile

- Age: 29
- Location: Bengaluru
- Employment: Salaried software engineer
- Experience: 5 years
- Monthly net income: ₹1,10,000
- Existing EMI: ₹14,000
- Household costs: ₹28,000
- Credit score: 780
- Purpose: Wedding
- Requested amount: ₹8,00,000

## Questions asked

1. What is the purpose of the loan?
   - Wedding
2. How much do you want to borrow?
   - ₹8,00,000
3. What type of income do you have?
   - Salaried
4. What is your monthly net income?
   - ₹1,10,000
5. How predictable is your income?
   - Very predictable
6. How much do you already pay in EMIs each month?
   - ₹14,000
7. What are your monthly household expenses?
   - ₹28,000
8. What is your credit score, if known?
   - 780
9. What is your age?
   - 29

## Four outputs

### O1 — Borrowing decision

**Borrow**

The requested ₹8,00,000 fits within the current affordability guardrails.

### O2 — Borrower-safe amount vs lender view

**Borrower-safe amount: ₹10.1L**

**Maximum EMI: ₹28,700**

The borrower-safe figure is the important number to use when negotiating.

Illustrative lender capacity:

**₹31.0L–₹31.5L**

The lender figure is explicitly presented as an illustrative capacity range, not a sanction prediction.

### O3 — Fair rate and complete cost

**Target rate: 10.0%–16.0%**

Estimated repayment plus assumed processing fee over the reference tenure:

**₹11,04,267**

Assumed processing fee:

**₹16,000**

### O4 — EMI ceiling and stress case

**Maximum EMI: ₹28,700**

Tenure trade-off:

- 36 months: ₹28,126/month
- 48 months: ₹22,672/month
- 60 months: ₹19,454/month

Stress case at 20% higher EMI:

**₹27,207/month**

## Negotiation Card

**AMOUNT:** ₹8.0L

**EMI CEILING:** ₹28,700

**RATE RANGE:** 10.0%–16.0%

Suggested lender question:

> “I am comfortable with an EMI up to ₹28,700. Please show me the complete cost, including processing and other charges, and keep the rate within 10.0%–16.0%.”

---

# 2. Ravi — Self-Employed Borrower

## Borrower profile

- Age: 42
- Location: Mysuru
- Employment: Self-employed kirana business
- Business experience: 14 years
- Typical monthly cash income used for input: ₹60,000
- Documented monthly income: ₹35,000
- Existing EMI: ₹0
- Household costs: ₹25,000
- Credit score: Unknown
- Purpose: Stock line + delivery vehicle
- Requested amount: ₹15,00,000

## Questions asked

1. What is the purpose of the loan?
   - Business
2. How much do you want to borrow?
   - ₹15,00,000
3. What type of income do you have?
   - Self-employed
4. What is your monthly income?
   - ₹60,000
5. What is your documented monthly income?
   - ₹35,000
6. How much do you already pay in EMIs each month?
   - ₹0
7. What are your monthly household expenses?
   - ₹25,000
8. How predictable is your income?
   - Some variation
9. What is your credit score, if known?
   - Unknown
10. What is your age?
   - 42
11. Do you have high-cost outstanding debt?
   - No

## Four outputs

### O1 — Borrowing decision

**Don't borrow**

The documented income and household costs leave limited room for the requested ₹15,00,000 borrowing.

### O2 — Borrower-safe amount vs lender view

**Borrower-safe amount: ₹0**

**Maximum EMI: ₹0**

The borrower-safe amount is the number to use for affordability, rather than the lender's potential capacity.

Illustrative lender capacity:

**₹5.0L–₹5.5L**

This is an illustrative lender-capacity estimate, not a sanction prediction.

### O3 — Fair rate and complete cost

**Target rate: 14.0%–22.0%**

Estimated repayment plus assumed processing fee over the reference tenure:

**₹22,98,438**

Assumed processing fee:

**₹30,000**

### O4 — EMI ceiling and stress case

**Maximum EMI: ₹0**

Illustrative EMI for the requested ₹15,00,000:

- 36 months: ₹57,286/month
- 48 months: ₹47,259/month
- 60 months: ₹41,428/month

Stress case at 20% higher EMI:

**₹56,711/month**

## Product routing

**Compare secured business finance**

For a large business requirement, the prototype recommends comparing secured business borrowing before taking an expensive unsecured loan.

## Negotiation Card

**AMOUNT:** ₹0

**EMI CEILING:** ₹0

**RATE RANGE:** 14.0%–22.0%

Suggested lender question:

> “I don't want to increase my repayment burden right now. Please show me whether a secured business-finance option can meet my requirement at a manageable total cost.”

---

# 3. Anita — Informal Borrower With Repayment Stress

## Borrower profile

- Age: 35
- Location: Hubballi
- Employment: Informal delivery rider + tailoring
- Monthly income: ₹28,000
- Existing EMI: ₹0 entered because the brief does not specify a separate EMI amount
- Household costs: ₹18,000
- High-cost outstanding debt: ₹35,000
- Active high-cost loans: 3
- Recent bounced EMI: Yes
- Income stability: Highly variable
- Credit score: Unknown
- Purpose: Electric scooter
- Requested amount: ₹1,50,000

## Questions asked

1. What is the purpose of the loan?
   - Vehicle
2. How much do you want to borrow?
   - ₹1,50,000
3. What type of income do you have?
   - Informal
4. What is your monthly income?
   - ₹28,000
5. How much do you already pay in EMIs each month?
   - ₹0 entered because no separate EMI amount was provided in the challenge profile
6. What are your monthly household expenses?
   - ₹18,000
7. Do you have high-cost outstanding debt?
   - Yes
8. How many active high-cost loans do you have?
   - 3
9. Has an EMI or loan payment bounced recently?
   - Yes
10. How predictable is your income?
    - Highly variable
11. What is your credit score, if known?
    - Unknown
12. What is your age?
    - 35

## Four outputs

### O1 — Borrowing decision

**Don't borrow**

The prototype detects expensive outstanding debt combined with a recent repayment problem and recommends pausing new borrowing.

### O2 — Borrower-safe amount vs lender view

**Borrower-safe amount: ₹0**

**Maximum EMI: ₹0**

Illustrative lender capacity:

**₹50,000–₹1.0L**

The lender figure is not treated as a recommendation to borrow.

### O3 — Fair rate and complete cost

**Target rate: 21.0%–35.0%**

Estimated repayment plus assumed processing fee over the reference tenure:

**₹2,83,593**

Assumed processing fee:

**₹3,000**

### O4 — EMI ceiling and stress case

**Maximum EMI: ₹0**

Illustrative EMI for the requested ₹1,50,000:

- 36 months: ₹6,785/month
- 48 months: ₹5,846/month
- 60 months: ₹5,324/month

Stress case at 20% higher EMI:

**₹7,015/month**

## Product routing

**Pause new borrowing**

Existing expensive debt and repayment stress make another high-cost loan risky.

The prototype recommends first exploring:

- Restructuring
- Refinancing
- Repayment of existing expensive debt

## Negotiation Card

**AMOUNT:** ₹0

**EMI CEILING:** ₹0

**RATE RANGE:** 21.0%–35.0%

Suggested lender question:

> “I don't want to increase my repayment burden right now. Please show me whether my existing expensive debt can be restructured or refinanced at a lower total cost.”

---

# Summary

| Borrower | Decision | Safe Amount | EMI Ceiling | Rate Range | Confidence |
|---|---|---:|---:|---|---|
| Priya | Borrow | ₹10.1L | ₹28,700 | 10%–16% | High |
| Ravi | Don't borrow | ₹0 | ₹0 | 14%–22% | Low |
| Anita | Don't borrow | ₹0 | ₹0 | 21%–35% | Low |

## What these three run-throughs demonstrate

- **Priya:** A stable salaried borrower can borrow when the requested amount fits affordability guardrails.
- **Ravi:** A large business request can be rejected when documented income and household costs leave insufficient comfortable repayment capacity, even when a lender might consider a larger amount.
- **Anita:** Existing expensive debt and repayment stress can trigger a hard stop on new borrowing.
- The prototype separates **borrower-safe affordability** from **illustrative lender capacity**.
- The Negotiation Card turns the decision into concrete numbers the borrower can use when comparing offers.
- Unknown credit information does not automatically become zero; it reduces confidence and keeps the estimate explicitly illustrative.