// Zimbabwe 2025 Tax Calculator

export function calculateCorporateTax(netProfit: number): number {
  const corporateRate = 0.25;
  const aidsLevy = 0.03;
  const effectiveRate = corporateRate * (1 + aidsLevy);
  return netProfit * effectiveRate;
}

export function checkVatStatus(annualTurnover: number): boolean {
  return annualTurnover > 25000;
}

export function calculatePAYE(salary: number): number {
  if (salary <= 100) return 0;
  if (salary <= 300) return (salary - 100) * 0.20;
  if (salary <= 1000) return 40 + (salary - 300) * 0.25;
  return 40 + 175 + (salary - 1000) * 0.25;
}

export interface TaxBreakdown {
  corporateTax: number;
  aidsLevy: number;
  vat: number;
  paye: number;
  totalTax: number;
  effectiveCorporateRate: number;
  vatRegistered: boolean;
}

export function calculateTaxBreakdown(
  netProfit: number,
  annualTurnover: number,
  totalSalaries: number
): TaxBreakdown {
  const corporateBase = netProfit * 0.25;
  const aidsLevy = corporateBase * 0.03;
  const corporateTax = corporateBase + aidsLevy;
  
  const vatRegistered = checkVatStatus(annualTurnover);
  const vat = vatRegistered ? annualTurnover * 0.15 : 0;
  
  const paye = calculatePAYE(totalSalaries);
  
  return {
    corporateTax,
    aidsLevy,
    vat,
    paye,
    totalTax: corporateTax + vat + paye,
    effectiveCorporateRate: 25.75,
    vatRegistered,
  };
}
