import { useMemo, useState } from "react";
import {
  calculateSafeAmount,
  calculateSafeEMI,
  calculateLenderCapacity,
  calculateDecision,
  calculateConfidence,
  calculateStressEMI,
  calculateTenureOptions,
  calculateProcessingFee,
  calculateTotalCost,
  getRateBand,
  getProductRouting,
} from "./rules";
import "./App.css";

/* =========================================================
   ICONS
========================================================= */

function Icon({ name, size = 24 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    wedding: (
      <>
        <circle cx="9" cy="13" r="4" />
        <circle cx="15" cy="13" r="4" />
        <path d="M9 9V5" />
        <path d="M15 9V5" />
        <path d="M7 5h4" />
        <path d="M13 5h4" />
        <path d="M12 17v3" />
      </>
    ),

    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    education: (
      <>
        <path d="m3 8 9-4 9 4-9 4-9-4Z" />
        <path d="M7 10v5c2.5 2 7.5 2 10 0v-5" />
        <path d="M21 8v6" />
      </>
    ),

    medical: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),

    vehicle: (
      <>
        <path d="M5 16h14" />
        <path d="m6 16 1-5h10l2 5" />
        <path d="M4 16v3h2" />
        <path d="M20 16v3h-2" />
        <circle cx="7" cy="17" r="1.5" />
        <circle cx="17" cy="17" r="1.5" />
      </>
    ),

    business: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5h8v2" />
        <path d="M3 12h18" />
        <path d="M10 12v2h4v-2" />
      </>
    ),

    other: (
      <>
        <circle cx="6" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14v3" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.2 8.5-8 10-4.8-1.5-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V10" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V8" />
      </>
    ),

    leaf: (
      <>
        <path d="M20 4C10 4 5 9 5 17c0 1.5.3 2.5.3 2.5S8 20 9.5 20C17.5 20 20 12 20 4Z" />
        <path d="M4 21c3-5 7-9 13-12" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.7-4L3 10" />
        <path d="M3 5v5h5" />
        <path d="M4 13a8 8 0 0 0 14.7 4L21 14" />
        <path d="M21 19v-5h-5" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.other}</svg>;
}

/* =========================================================
   DATA
========================================================= */

const INITIAL_DATA = {
  purpose: "",
  amount: "",
  incomeType: "",
  monthlyIncome: "",
  documentedIncome: "",
  existingEMI: "",
  householdExpenses: "",
  stability: "",
  creditScore: "",
  age: "",
  highCostDebt: "",
  bouncedEmi: "",
};

const PURPOSE_OPTIONS = [
  { value: "Wedding", label: "Wedding", icon: "wedding" },
  { value: "Home", label: "Home / renovation", icon: "home" },
  { value: "Education", label: "Education", icon: "education" },
  { value: "Medical", label: "Medical expense", icon: "medical" },
  { value: "Vehicle", label: "Vehicle", icon: "vehicle" },
  { value: "Business", label: "Business", icon: "business" },
  { value: "Other", label: "Other", icon: "other" },
];

function formatINR(value, decimals = 0) {
  const number = Number(value) || 0;

  return `₹${number.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}`;
}

function formatLakhs(value) {
  const number = Number(value) || 0;

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }

  return formatINR(number);
}

function getStepDefinitions(data) {
  const steps = [
    {
      id: "purpose",
      title: "What are you borrowing for?",
      subtitle:
        "The purpose helps us understand whether the borrowing is productive, optional or urgent.",
      type: "choice",
      options: PURPOSE_OPTIONS,
    },
    {
      id: "amount",
      title: "How much do you want to borrow?",
      subtitle: "Enter the amount you are considering.",
      type: "number",
      prefix: "₹",
      placeholder: "8,00,000",
    },
    {
      id: "incomeType",
      title: "How do you earn your income?",
      subtitle:
        "This helps us choose the right affordability approach.",
      type: "choice",
      options: [
        {
          value: "salaried",
          label: "Salaried employee",
          icon: "business",
        },
        {
          value: "selfEmployed",
          label: "Self-employed / business owner",
          icon: "business",
        },
        {
          value: "informal",
          label: "Informal / variable income",
          icon: "chart",
        },
      ],
    },
  ];

  if (data.incomeType === "selfEmployed") {
    steps.push({
      id: "monthlyIncome",
      title: "What is your typical monthly income?",
      subtitle:
        "Use a normal month rather than your best month.",
      type: "number",
      prefix: "₹",
      placeholder: "60,000",
    });

    steps.push({
      id: "documentedIncome",
      title: "What monthly income can you document?",
      subtitle:
        "For example, income supported by ITRs, bank statements or business records.",
      type: "number",
      prefix: "₹",
      placeholder: "35,000",
    });
  } else {
    steps.push({
      id: "monthlyIncome",
      title: "What is your dependable monthly income?",
      subtitle:
        data.incomeType === "informal"
          ? "Use the lower end of what you can reasonably depend on each month."
          : "Use your net monthly income after deductions.",
      type: "number",
      prefix: "₹",
      placeholder:
        data.incomeType === "informal"
          ? "26,000"
          : "1,10,000",
    });
  }

  if (data.incomeType === "informal") {
    steps.push({
      id: "highCostDebt",
      title:
        "Do you currently have expensive short-term/app debt?",
      subtitle:
        "Include loans with very high interest or costly fees.",
      type: "choice",
      options: [
        {
          value: "yes",
          label: "Yes",
          icon: "shield",
        },
        {
          value: "no",
          label: "No",
          icon: "shield",
        },
      ],
    });

    if (data.highCostDebt === "yes") {
      steps.push({
        id: "bouncedEmi",
        title:
          "Has an EMI or loan payment bounced recently?",
        subtitle:
          "This helps us identify current repayment stress.",
        type: "choice",
        options: [
          {
            value: "yes",
            label: "Yes",
            icon: "medical",
          },
          {
            value: "no",
            label: "No",
            icon: "shield",
          },
        ],
      });
    }
  }

  steps.push({
    id: "stability",
    title: "How predictable is your income?",
    subtitle:
      "Think about how much your monthly income normally varies.",
    type: "choice",
    options: [
      {
        value: "high",
        label: "Very predictable",
        icon: "chart",
      },
      {
        value: "medium",
        label: "Some variation",
        icon: "chart",
      },
      {
        value: "low",
        label: "Highly variable",
        icon: "chart",
      },
    ],
  });

  steps.push({
    id: "existingEMI",
    title:
      "How much do you already pay in EMIs each month?",
    subtitle:
      "Include all current loan repayments.",
    type: "number",
    prefix: "₹",
    placeholder: "14,000",
  });

  steps.push({
    id: "householdExpenses",
    title:
      "How much does your household spend each month?",
    subtitle:
      "Include rent, food, utilities and regular household expenses.",
    type: "number",
    prefix: "₹",
    placeholder: "28,000",
  });

  steps.push({
    id: "creditScore",
    title: "Do you know your credit score?",
    subtitle:
      "Optional. If you don't know it, you can continue without it.",
    type: "number",
    prefix: "",
    placeholder: "780",
    optional: true,
  });

  steps.push({
    id: "age",
    title: "How old are you?",
    subtitle:
      "Used only as basic context for this prototype.",
    type: "number",
    prefix: "",
    placeholder: "29",
  });

  return steps;
}

function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const steps = useMemo(
    () => getStepDefinitions(data),
    [data]
  );

  const step = steps[currentStep];

  function updateData(key, value) {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function canContinue() {
    if (!step) return false;

    if (step.optional) return true;

    const value = data[step.id];

    if (step.id === "amount") {
      return Number(value) > 0;
    }

    if (
      step.id === "monthlyIncome" ||
      step.id === "documentedIncome" ||
      step.id === "existingEMI" ||
      step.id === "householdExpenses" ||
      step.id === "age"
    ) {
      return value !== "" && Number(value) >= 0;
    }

    return value !== "";
  }

  function nextStep() {
    if (!canContinue()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((previous) => previous + 1);
    } else {
      setShowResults(true);
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  }

  function startOver() {
    setData(INITIAL_DATA);
    setCurrentStep(0);
    setShowResults(false);
  }

  if (showResults) {
    return (
      <Results
        data={data}
        onStartOver={startOver}
      />
    );
  }

  const progress =
    ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div className="brand-name">Lokta</div>
          <div className="brand-divider" />
          <div className="brand-tagline">
            Borrow Smarter. Live Better.
          </div>
        </div>

        <button
          className="start-over-button"
          type="button"
          onClick={startOver}
        >
          <Icon name="refresh" size={22} />
          <span>Start over</span>
        </button>
      </header>

      <main className="main-layout">
        <aside className="left-panel">
          <div className="left-copy">
            <div className="hand-title">
              Smarter
              <br />
              Borrowing.
              <br />
              Brighter
              <br />
              Tomorrow.
            </div>

            <div className="hand-underline" />

            <div className="left-features">
              <div className="left-feature">
                <div className="feature-icon">
                  <Icon name="shield" size={25} />
                </div>
                <span>
                  Understand
                  <br />
                  your affordability
                </span>
              </div>

              <div className="left-feature">
                <div className="feature-icon">
                  <Icon name="chart" size={25} />
                </div>
                <span>
                  Make confident
                  <br />
                  decisions
                </span>
              </div>

              <div className="left-feature">
                <div className="feature-icon">
                  <Icon name="leaf" size={25} />
                </div>
                <span>
                  Build a stronger
                  <br />
                  financial future
                </span>
              </div>
            </div>
          </div>

          <div className="leaf-decoration leaf-left">
            <div className="stem" />
            <span className="leaf leaf-a" />
            <span className="leaf leaf-b" />
            <span className="leaf leaf-c" />
            <span className="leaf leaf-d" />
          </div>
        </aside>

        <section className="center-content">
          <div className="hero">
            <div className="eyebrow">
              LOKTA BORROWER COPILOT
            </div>

            <h1>
              Make the borrowing decision
              <br />
              <span>before</span> the lender does.
            </h1>

            <p>
              A simple affordability check to help you
              decide how much to borrow,
              <br />
              what EMI to accept and what to negotiate.
            </p>
          </div>

          <section className="question-card">
            <div className="question-top">
              <span>
                Question {currentStep + 1} of{" "}
                {steps.length}
              </span>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <span>{Math.round(progress)}%</span>
            </div>

            <div className="question-body">
              <h2>{step.title}</h2>

              <p className="question-subtitle">
                {step.subtitle}
              </p>

              {step.type === "choice" && (
                <div className="choice-grid">
                  {step.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`choice-card ${
                        data[step.id] === option.value
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateData(
                          step.id,
                          option.value
                        )
                      }
                    >
                      <div className="choice-icon">
                        <Icon
                          name={option.icon}
                          size={25}
                        />
                      </div>

                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step.type === "number" && (
                <div className="number-input-wrap">
                  {step.prefix && (
                    <span className="number-prefix">
                      {step.prefix}
                    </span>
                  )}

                  <input
                    type="number"
                    min="0"
                    autoFocus
                    value={data[step.id]}
                    placeholder={step.placeholder}
                    onChange={(event) =>
                      updateData(
                        step.id,
                        event.target.value
                      )
                    }
                  />
                </div>
              )}

              {step.optional && (
                <div className="optional-message">
                  Optional — you can continue without
                  entering your score.
                </div>
              )}

              <div className="question-actions">
                <button
                  type="button"
                  className={`back-button ${
                    currentStep === 0
                      ? "disabled"
                      : ""
                  }`}
                  disabled={currentStep === 0}
                  onClick={previousStep}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="continue-button"
                  disabled={!canContinue()}
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            </div>
          </section>

          <div className="trust-bar">
            <div className="trust-item">
              <Icon name="lock" size={23} />
              <span>No login required</span>
            </div>

            <div className="trust-divider" />

            <div className="trust-item">
              <Icon name="shield" size={23} />
              <span>No personal data stored</span>
            </div>

            <div className="trust-divider" />

            <div className="trust-item">
              <Icon name="leaf" size={23} />
              <span>Just smarter decisions</span>
            </div>
          </div>
        </section>

        <aside className="right-panel">
          <div className="right-quote">
            “Better
            <br />
            financial decisions
            <br />
            today for a brighter
            <br />
            tomorrow.”
          </div>

          <div className="quote-line" />

          <div className="plant-scene">
            <div className="plant-pot">
              <div className="plant-stem" />

              <span className="plant-leaf p1" />
              <span className="plant-leaf p2" />
              <span className="plant-leaf p3" />
              <span className="plant-leaf p4" />
              <span className="plant-leaf p5" />
            </div>

            <div className="wood-shelf" />

            <div className="stack">
              <div className="stack-box box-plan">
                Plan
              </div>

              <div className="stack-box box-borrow">
                Borrow
                <br />
                Smart
              </div>

              <div className="stack-box box-live">
                Live Better
              </div>
            </div>
          </div>

          <div className="right-bottom-copy">
            <strong>
              Your goals
              <br />
              matter.
            </strong>

            <span>
              Let's plan smarter.
            </span>

            <div />
          </div>
        </aside>
      </main>
    </div>
  );
}

/* =========================================================
   RESULTS
========================================================= */

function Results({ data, onStartOver }) {
  const decision = calculateDecision(data);
  const safeAmount = calculateSafeAmount(data);
  const safeEMI = calculateSafeEMI(data);
  const lenderCapacity = calculateLenderCapacity(data);
  const confidence = calculateConfidence(data);
  const stressEMI = calculateStressEMI(data);
  const tenureOptions = calculateTenureOptions(data);
  const processingFee = calculateProcessingFee(data);
  const totalCost = calculateTotalCost(data);
  const rateBand = getRateBand(data);
  const product = getProductRouting(data);

  const requestedAmount = Number(data.amount) || 0;

  const isDoNotBorrow =
    decision === "Don't borrow";

  const lenderLow =
    Math.floor(lenderCapacity / 50000) * 50000;

  const lenderHigh =
    Math.ceil(lenderCapacity / 50000) * 50000;

  let headline = "";
  let description = "";

  if (decision === "Borrow") {
    headline = `Borrow ${formatLakhs(
      requestedAmount
    )} with confidence.`;

    description =
      "The requested amount fits within the current affordability guardrails. Compare the complete cost before accepting an offer.";
  } else if (decision === "Borrow less") {
    headline = `Borrow less than ${formatLakhs(
      requestedAmount
    )}.`;

    description = `Your comfortable borrowing capacity is approximately ${formatLakhs(
      safeAmount
    )}.`;
  } else {
    headline = "Pause before taking another loan.";

    description =
      "Your current commitments and affordability indicators suggest that taking this loan could put unnecessary pressure on your finances.";
  }

  const negotiationAmount =
    decision === "Borrow"
      ? requestedAmount
      : safeAmount;

  return (
    <div className="results-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div className="brand-name">Lokta</div>
          <div className="brand-divider" />
          <div className="brand-tagline">
            Borrow Smarter. Live Better.
          </div>
        </div>

        <button
          className="start-over-button"
          onClick={onStartOver}
          type="button"
        >
          <Icon name="refresh" size={21} />
          Start over
        </button>
      </header>

      <main className="results-container">
        <div className="results-eyebrow">
          YOUR BORROWING PLAN
        </div>

        <section className="decision-header">
          <div className="decision-label">
            <span
              className={`decision-dot ${
                decision === "Borrow"
                  ? "positive"
                  : decision === "Borrow less"
                  ? "warning"
                  : ""
              }`}
            />
            {decision}
          </div>

          <h1>{headline}</h1>

          <p>{description}</p>

          <div className="confidence">
            {confidence} confidence
          </div>
        </section>

        <section className="primary-numbers">
          <NumberCard
            label="BORROWER-SAFE AMOUNT"
            value={
              isDoNotBorrow
                ? "Do not borrow"
                : formatLakhs(safeAmount)
            }
            description={
              isDoNotBorrow
                ? "New borrowing is not recommended"
                : "Comfortable borrowing capacity"
            }
          />

          <NumberCard
            label="EMI CEILING"
            value={formatINR(safeEMI)}
            description={
              isDoNotBorrow
                ? "No new EMI recommended"
                : "Your negotiation ceiling"
            }
          />

          <NumberCard
            label="RATE RANGE"
            value={
              isDoNotBorrow
                ? "Not recommended"
                : `${rateBand.min.toFixed(
                    1
                  )}% – ${rateBand.max.toFixed(1)}%`
            }
            description={
              isDoNotBorrow
                ? "Avoid new high-cost borrowing"
                : "Illustrative target range"
            }
          />
        </section>

        <section className="key-message">
          <div className="key-icon">✓</div>

          <div>
            <strong>
              Your affordability matters more than
              lender eligibility.
            </strong>

            <p>
              A lender may offer more than you should
              comfortably borrow. Use your own ceiling
              when comparing offers.
            </p>
          </div>
        </section>

        <section className="result-section">
          <div className="section-label">
            YOUR NUMBERS
          </div>

          <h2>Why we arrived here</h2>

          <div className="details-grid">
            <DetailItem
              label="Monthly income"
              value={formatINR(
                data.monthlyIncome
              )}
            />

            <DetailItem
              label="Existing EMI"
              value={formatINR(
                data.existingEMI
              )}
            />

            <DetailItem
              label="Household costs"
              value={formatINR(
                data.householdExpenses
              )}
            />

            <DetailItem
              label="Requested"
              value={formatINR(requestedAmount)}
            />
          </div>

          <div className="reason-box">
            <span>01</span>

            <div>
              <h3>Affordability first</h3>

              <p>
                We apply a FOIR-style payment guardrail
                and separately check the income left
                after existing commitments and household
                costs.
              </p>
            </div>
          </div>
        </section>

        <section className="lender-section">
          <div className="section-label light">
            LENDER VIEW
          </div>

          <h2>What a lender may consider</h2>

          <p>
            Illustrative capacity range — not a sanction
            prediction.
          </p>

          <div className="lender-value">
            {formatLakhs(lenderLow)}
            <span>–</span>
            {formatLakhs(lenderHigh)}
          </div>

          <div className="lender-warning">
            Don't borrow more just because you qualify
            for more.
          </div>
        </section>

        <section className="result-columns">
          <div className="info-card">
            <div className="section-label">
              COST CHECK
            </div>

            <h2>The complete cost matters</h2>

            <div className="cost-value">
              {formatINR(totalCost)}
            </div>

            <p>
              Estimated repayment plus assumed processing
              fee over the reference tenure.
            </p>

            <div className="fee">
              <span>Processing fee assumption</span>
              <strong>
                {formatINR(processingFee)}
              </strong>
            </div>
          </div>

          <div className="info-card">
            <div className="section-label">
              PRODUCT ROUTING
            </div>

            <h2>{product.title}</h2>

            <p>{product.description}</p>
          </div>
        </section>

        <section className="result-section">
          <div className="section-label">
            TENURE TRADE-OFF
          </div>

          <h2>Lower EMI or lower total cost?</h2>

          <div className="tenure-grid">
            {tenureOptions.map((option) => (
              <div
                className={`tenure ${
                  option.months === 48
                    ? "reference"
                    : ""
                }`}
                key={option.months}
              >
                {option.months === 48 && (
                  <small>REFERENCE</small>
                )}

                <strong>
                  {option.months} months
                </strong>

                <span>
                  {formatINR(option.emi)}
                </span>

                <em>EMI / month</em>
              </div>
            ))}
          </div>
        </section>

        <section className="stress-section">
          <div className="section-label">
            STRESS TEST
          </div>

          <h2>What if the EMI is 20% higher?</h2>

          {isDoNotBorrow ? (
            <>
              <p>
                New borrowing is not recommended while
                current repayment stress is present.
              </p>

              <strong className="stress-not-recommended">
                Not recommended
              </strong>
            </>
          ) : (
            <>
              <p>
                Your stressed monthly payment would be:
              </p>

              <strong>
                {formatINR(stressEMI)}
              </strong>
            </>
          )}
        </section>

        <section className="negotiation">
          <div className="negotiation-header">
            <div>
              <div className="section-label light">
                LOKTA NEGOTIATION CARD
              </div>

              <h2>
                {isDoNotBorrow
                  ? "Know when not to borrow."
                  : "Take these numbers with you."}
              </h2>
            </div>

            <div className="negotiation-mark">
              L
            </div>
          </div>

          <div className="negotiation-grid">
            <div>
              <span>AMOUNT</span>

              <strong>
                {isDoNotBorrow
                  ? "Do not borrow"
                  : formatLakhs(
                      negotiationAmount
                    )}
              </strong>
            </div>

            <div>
              <span>EMI CEILING</span>

              <strong>
                {formatINR(safeEMI)}
              </strong>
            </div>

            <div>
              <span>RATE RANGE</span>

              <strong>
                {isDoNotBorrow
                  ? "Not recommended"
                  : `${rateBand.min.toFixed(
                      1
                    )}% – ${rateBand.max.toFixed(1)}%`}
              </strong>
            </div>
          </div>

          <div className="ask-lender">
            <span>
              {isDoNotBorrow
                ? "NEXT STEP"
                : "ASK THE LENDER"}
            </span>

            <p>
              {isDoNotBorrow
                ? "Before taking another loan, explore restructuring, refinancing or repayment of existing expensive debt."
                : "“Please show me the complete cost, including processing and other charges, before I accept the offer.”"}
            </p>
          </div>
        </section>

        <section className="assumptions">
          <h3>About these estimates</h3>

          <p>
            Lokta is a decision-support prototype, not a
            lender or approval engine. Rate ranges,
            affordability rules and lender-capacity
            estimates are prototype assumptions. Actual
            offers can differ.
          </p>
        </section>
      </main>
    </div>
  );
}

function NumberCard({
  label,
  value,
  description,
}) {
  return (
    <div className="result-number">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;