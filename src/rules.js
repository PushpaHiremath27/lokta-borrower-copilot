// src/rules.js

/*
  Lokta Borrower Copilot
  ----------------------

  These are prototype decision-support rules.

  Important:
  - These are NOT lender approval rules.
  - FOIR thresholds are prototype assumptions.
  - Rate bands are illustrative.
  - Unknown information should never silently become zero.
*/

export const PROTOTYPE_RULES = {
  // Assumed processing fee for prototype cost calculations.
  processingFeeRate: 0.02,

  // Reference tenure used for safe-loan calculations.
  referenceTenureMonths: 48,

  // Stress test assumes EMI becomes 20% higher.
  stressFactor: 1.2,

  /*
    Borrower-safe FOIR assumptions.

    FOIR = proportion of dependable monthly income
    that can reasonably go toward existing + new EMIs.
  */
  borrowerFOIR: {
    salaried: 0.5,
    selfEmployed: 0.45,
    informal: 0.35,
  },

  /*
    Illustrative lender-side FOIR assumptions.

    These are NOT predictions of actual lender policy.
  */
  lenderFOIR: {
    salaried: 0.6,
    selfEmployed: 0.5,
    informal: 0.4,
  },

  /*
    Income stability adjustment.

    More variable income gets a larger safety reduction.
  */
  stabilityFactor: {
    high: 1,
    medium: 0.9,
    low: 0.75,
  },

  /*
    General fallback rate band.
  */
  baseRate: {
    min: 12,
    max: 18,
  },

  /*
    Illustrative rate bands based on income type.
  */
  incomeTypeRate: {
    salaried: {
      min: 11,
      max: 17,
    },

    selfEmployed: {
      min: 14,
      max: 22,
    },

    informal: {
      min: 18,
      max: 30,
    },
  },
};

/* =========================================================
   EMI CALCULATION
========================================================= */

export function calculateEMI(
  principal,
  annualRate,
  months
) {
  if (
    !principal ||
    principal <= 0 ||
    !months ||
    months <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annualRate / 100 / 12;

  /*
    Zero-interest fallback.
  */
  if (monthlyRate === 0) {
    return principal / months;
  }

  return (
    (principal *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      )) /
    (Math.pow(
      1 + monthlyRate,
      months
    ) - 1)
  );
}

/* =========================================================
   LOAN AMOUNT FROM EMI
========================================================= */

export function loanAmountFromEMI(
  monthlyEMI,
  annualRate,
  months
) {
  if (
    !monthlyEMI ||
    monthlyEMI <= 0 ||
    !months ||
    months <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annualRate / 100 / 12;

  /*
    Zero-interest fallback.
  */
  if (monthlyRate === 0) {
    return monthlyEMI * months;
  }

  return (
    (monthlyEMI *
      (Math.pow(
        1 + monthlyRate,
        months
      ) - 1)) /
    (monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      ))
  );
}

/* =========================================================
   INCOME USED FOR AFFORDABILITY
========================================================= */

export function getIncomeForAffordability(data) {
  const monthlyIncome =
    Number(data.monthlyIncome) || 0;

  const documentedIncome =
    Number(data.documentedIncome) || 0;

  /*
    SELF-EMPLOYED

    If documented income is actually provided,
    use the more conservative of:

      - typical monthly income
      - documented monthly income

    But if documented income is UNKNOWN / BLANK,
    do NOT convert unknown into zero.

    Instead, use dependable monthly income.
  */
  if (
    data.incomeType === "selfEmployed"
  ) {
    if (documentedIncome > 0) {
      return Math.min(
        monthlyIncome,
        documentedIncome
      );
    }

    return monthlyIncome;
  }

  /*
    SALARIED / INFORMAL

    Use the monthly income supplied by the borrower.
  */
  return monthlyIncome;
}

/* =========================================================
   BORROWER FOIR
========================================================= */

export function getFOIR(data) {
  return (
    PROTOTYPE_RULES.borrowerFOIR[
      data.incomeType
    ] ??
    PROTOTYPE_RULES.borrowerFOIR.informal
  );
}

/* =========================================================
   LENDER FOIR
========================================================= */

export function getLenderFOIR(data) {
  return (
    PROTOTYPE_RULES.lenderFOIR[
      data.incomeType
    ] ??
    PROTOTYPE_RULES.lenderFOIR.informal
  );
}

/* =========================================================
   INCOME STABILITY FACTOR
========================================================= */

export function getStabilityFactor(
  stability
) {
  if (stability === "high") {
    return PROTOTYPE_RULES.stabilityFactor.high;
  }

  if (stability === "medium") {
    return PROTOTYPE_RULES.stabilityFactor.medium;
  }

  return PROTOTYPE_RULES.stabilityFactor.low;
}

/* =========================================================
   RATE BAND
========================================================= */

export function getRateBand(data) {
  let band =
    PROTOTYPE_RULES.incomeTypeRate[
      data.incomeType
    ] ??
    PROTOTYPE_RULES.baseRate;

  let min = band.min;
  let max = band.max;

  const score =
    Number(data.creditScore);

  /*
    Stronger credit score:
    modest downward adjustment.
  */
  if (score >= 750) {
    min -= 1;
    max -= 1;
  } else if (score >= 700) {
    min -= 0.5;
    max -= 0.5;
  } else if (
    score > 0 &&
    score < 650
  ) {
    min += 2;
    max += 3;
  }

  /*
    Existing expensive debt increases
    the illustrative rate range.
  */
  if (data.highCostDebt === "yes") {
    min += 2;
    max += 3;
  }

  /*
    Recent bounced EMI increases
    the illustrative rate range.
  */
  if (data.bouncedEmi === "yes") {
    min += 1;
    max += 2;
  }

  return {
    min: Math.max(0, min),
    max: Math.max(0, max),
  };
}

/* =========================================================
   SAFE EMI
========================================================= */

export function calculateSafeEMI(data) {
  const income =
    getIncomeForAffordability(data);

  const existingEMI =
    Number(data.existingEMI) || 0;

  const householdExpenses =
    Number(data.householdExpenses) || 0;

  const foir =
    getFOIR(data);

  /*
    FOIR capacity:

      income × allowed FOIR
      - existing EMI
  */
  const foirCapacity =
    income * foir -
    existingEMI;

  /*
    Residual income:

      income
      - household expenses
      - existing EMI
  */
  const residualIncome =
    income -
    householdExpenses -
    existingEMI;

  /*
    Only a portion of residual income
    is treated as available for a new EMI.
  */
  const residualCapacity =
    residualIncome * 0.35;

  /*
    Use the more conservative limit.
  */
  let safeEMI = Math.min(
    foirCapacity,
    residualCapacity
  );

  /*
    Adjust for income stability.
  */
  const stabilityFactor =
    getStabilityFactor(
      data.stability
    );

  safeEMI *= stabilityFactor;

  /*
    Severe current debt stress:

    informal income
    + expensive debt
    + bounced EMI

    => no new borrowing recommendation.
  */
  if (
    data.highCostDebt === "yes" &&
    data.bouncedEmi === "yes"
  ) {
    safeEMI = 0;
  }

  return Math.max(
    0,
    safeEMI
  );
}

/* =========================================================
   BORROWER-SAFE LOAN AMOUNT
========================================================= */

export function calculateSafeAmount(data) {
  const safeEMI =
    calculateSafeEMI(data);

  const rateBand =
    getRateBand(data);

  if (safeEMI <= 0) {
    return 0;
  }

  /*
    We calculate the amount that could be
    supported by the safe EMI at the
    upper end of the illustrative rate band
    over the reference tenure.
  */
  return loanAmountFromEMI(
    safeEMI,
    rateBand.max,
    PROTOTYPE_RULES.referenceTenureMonths
  );
}

/* =========================================================
   ILLUSTRATIVE LENDER CAPACITY
========================================================= */

export function calculateLenderCapacity(data) {
  const income =
    getIncomeForAffordability(data);

  const existingEMI =
    Number(data.existingEMI) || 0;

  const lenderFOIR =
    getLenderFOIR(data);

  /*
    Illustrative maximum EMI from
    a lender-style FOIR assumption.
  */
  let lenderEMI =
    income *
      lenderFOIR -
    existingEMI;

  if (lenderEMI <= 0) {
    return 0;
  }

  const rateBand =
    getRateBand(data);

  /*
    Illustrative lender capacity uses
    60 months and the lower end of
    the rate range.
  */
  let capacity =
    loanAmountFromEMI(
      lenderEMI,
      rateBand.min,
      60
    );

  /*
    Informal-income borrowers receive
    an additional conservative cap.
  */
  if (
    data.incomeType === "informal"
  ) {
    capacity = Math.min(
      capacity,
      income * 3
    );
  }

  return Math.max(
    0,
    capacity
  );
}

/* =========================================================
   BORROWING DECISION
========================================================= */

export function calculateDecision(data) {
  const requestedAmount =
    Number(data.amount) || 0;

  const safeAmount =
    calculateSafeAmount(data);

  /*
    Severe debt stress:
    don't add another loan.
  */
  const severeDebtStress =
    data.incomeType === "informal" &&
    data.highCostDebt === "yes" &&
    data.bouncedEmi === "yes";

  if (severeDebtStress) {
    return "Don't borrow";
  }

  /*
    No meaningful safe capacity,
    or requested amount is far above
    safe capacity.
  */
  if (
    safeAmount <= 0 ||
    safeAmount <
      requestedAmount * 0.35
  ) {
    return "Don't borrow";
  }

  /*
    Requested amount fits within
    borrower-safe amount.
  */
  if (
    safeAmount >=
    requestedAmount
  ) {
    return "Borrow";
  }

  /*
    Some borrowing may be possible,
    but less than requested.
  */
  return "Borrow less";
}

/* =========================================================
   CONFIDENCE
========================================================= */

export function calculateConfidence(data) {
  const score =
    Number(data.creditScore);

  /*
    Lower confidence when:
    - income is informal
    - income stability is low
    - credit score is unknown
  */
  if (
    data.incomeType === "informal" ||
    data.stability === "low" ||
    !score
  ) {
    return "Low";
  }

  /*
    Highest confidence:
    salaried + predictable income
    + strong credit score.
  */
  if (
    data.incomeType === "salaried" &&
    data.stability === "high" &&
    score >= 750
  ) {
    return "High";
  }

  return "Medium";
}

/* =========================================================
   STRESS EMI
========================================================= */

export function calculateStressEMI(data) {
  const requestedAmount =
    Number(data.amount) || 0;

  const rateBand =
    getRateBand(data);

  /*
    Calculate normal EMI at the
    upper end of the illustrative
    rate range.
  */
  const normalEMI =
    calculateEMI(
      requestedAmount,
      rateBand.max,
      PROTOTYPE_RULES.referenceTenureMonths
    );

  /*
    Stress case = 20% higher EMI.
  */
  return (
    normalEMI *
    PROTOTYPE_RULES.stressFactor
  );
}

/* =========================================================
   TENURE OPTIONS
========================================================= */

export function calculateTenureOptions(data) {
  const requestedAmount =
    Number(data.amount) || 0;

  const rateBand =
    getRateBand(data);

  /*
    Show three common illustrative
    tenure choices.
  */
  return [36, 48, 60].map(
    (months) => ({
      months,

      emi: calculateEMI(
        requestedAmount,
        rateBand.max,
        months
      ),
    })
  );
}

/* =========================================================
   PROCESSING FEE
========================================================= */

export function calculateProcessingFee(data) {
  const amount =
    Number(data.amount) || 0;

  return (
    amount *
    PROTOTYPE_RULES.processingFeeRate
  );
}

/* =========================================================
   TOTAL COST
========================================================= */

export function calculateTotalCost(data) {
  const amount =
    Number(data.amount) || 0;

  const rateBand =
    getRateBand(data);

  /*
    Reference repayment:
      upper-end rate
      48-month tenure
  */
  const repayment =
    calculateEMI(
      amount,
      rateBand.max,
      PROTOTYPE_RULES.referenceTenureMonths
    ) *
    PROTOTYPE_RULES.referenceTenureMonths;

  const processingFee =
    calculateProcessingFee(data);

  return (
    repayment +
    processingFee
  );
}

/* =========================================================
   PRODUCT ROUTING
========================================================= */

export function getProductRouting(data) {
  /*
    Severe repayment stress:
    recommend pausing new borrowing.
  */
  if (
    data.incomeType === "informal" &&
    data.highCostDebt === "yes" &&
    data.bouncedEmi === "yes"
  ) {
    return {
      title: "Pause new borrowing",

      description:
        "Existing expensive debt and repayment stress make another high-cost loan risky. First explore restructuring, refinancing or repayment of existing expensive debt.",
    };
  }

  /*
    Large self-employed requirement:
    compare secured business finance.
  */
  if (
    data.incomeType === "selfEmployed" &&
    Number(data.amount) >= 500000
  ) {
    return {
      title:
        "Compare secured business finance",

      description:
        "For a large business requirement, compare secured business borrowing before taking an expensive unsecured loan.",
    };
  }

  /*
    Default routing.
  */
  return {
    title:
      "Compare personal loan offers",

    description:
      "Compare the complete cost, EMI and fees before accepting an offer.",
  };
}