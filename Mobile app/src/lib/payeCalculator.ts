interface PAYEResult {
  gross: number;
  nssa: number;
  taxableIncome: number;
  paye: number;
  aidsLevy: number;
  netPay: number;
}

const NSSA_RATE = 0.045;
const NSSA_CEILING = 700;
const AIDS_LEVY_RATE = 0.03;

const TAX_BRACKETS = [
  { min: 0, max: 100, rate: 0 },
  { min: 100.01, max: 300, rate: 0.2 },
  { min: 300.01, max: 1000, rate: 0.25 },
  { min: 1000.01, max: 2000, rate: 0.3 },
  { min: 2000.01, max: 3000, rate: 0.35 },
  { min: 3000.01, max: Infinity, rate: 0.4 },
];

export const calculatePAYE = (grossSalary: number): PAYEResult => {
  const nssaBase = Math.min(grossSalary, NSSA_CEILING);
  const nssa = nssaBase * NSSA_RATE;
  const taxableIncome = grossSalary - nssa;

  let paye = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      paye += taxableInBracket * bracket.rate;
    }
  }

  const aidsLevy = paye * AIDS_LEVY_RATE;
  const totalTax = paye + aidsLevy;
  const netPay = grossSalary - nssa - totalTax;

  return {
    gross: grossSalary,
    nssa,
    taxableIncome,
    paye,
    aidsLevy,
    netPay,
  };
};
