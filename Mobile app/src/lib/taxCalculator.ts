import { calculatePAYE } from './payeCalculator';

export function calculateCorporateTax(netProfit: number): number {
  const corporateRate = 0.25;
  const aidsLevy = 0.03;
  const effectiveRate = corporateRate * (1 + aidsLevy);
  return netProfit * effectiveRate;
}

export function checkVatStatus(annualTurnover: number): boolean {
  return annualTurnover > 25000;
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
  
  const payeResult = calculatePAYE(totalSalaries);
  const paye = payeResult.paye + payeResult.aidsLevy;
  
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
