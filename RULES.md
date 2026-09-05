# Lokta Borrower Copilot — Rules & Assumptions

## Purpose

Lokta Borrower Copilot is a decision-support prototype for Indian borrowers.

The goal is not to predict whether a lender will approve a loan.

Instead, the system separates:

1. What the borrower is asking for
2. What the borrower may be able to comfortably carry
3. What a lender might potentially consider
4. What rate and fee level the borrower should negotiate around
5. What happens under a simple repayment stress case

The rules below are prototype assumptions and are not lender underwriting rules.

---

## Core Principles

| What | Value | Why | Source |
|---|---:|---|---|
| Borrower-safe amount | Based on conservative EMI capacity | The borrower should understand what they can comfortably carry, not just what they may qualify for | My judgement |
| Lender capacity | Separate illustrative calculation | Prevents lender eligibility from being confused with borrower affordability | My judgement |
| Unknown information | Never intentionally treated as zero | Missing information should not create an artificially negative affordability result | My judgement |
| Rate range | Presented as illustrative | Avoids presenting prototype assumptions as guaranteed lender pricing | My judgement |
| Processing fee | Included in total-cost illustration | A borrower should consider fees in addition to interest | My judgement |
| Stress case | EMI increased by 20% | Tests whether repayment still has reasonable headroom | My judgement |
| Negotiation Card | Shows amount, EMI and rate range | Gives the borrower practical numbers to use when comparing offers | My judgement |

---

## Income Treatment

| What | Value | Why | Source |
|---|---:|---|---|
| Salaried income | Monthly net income supplied by borrower | Net income is more relevant to monthly affordability | My judgement |
| Informal income | Dependable monthly income supplied by borrower | Variable income should not be based on an unusually strong month | My judgement |
| Self-employed income | Conservative documented/typical income | Self-employed income can vary and may have different levels of documentation | My judgement |
| Self-employed documented income unknown | Use dependable monthly income rather than zero | Unknown must not silently become zero | My judgement |

### Self-employed income rule

When both typical monthly income and documented monthly income are available:

```text
affordability income =
minimum(typical monthly income, documented monthly income)