import { calculateTaxBreakdown, TaxBreakdown } from './taxCalculator';
import { calculatePAYE } from './payeCalculator';

interface FinancialData {
  netProfit?: number;
  annualRevenue?: number;
  grossSalary?: number;
}

export const getEstimatedTaxBill = (financialData: FinancialData): TaxBreakdown => {
  const netProfit = financialData.netProfit ?? 0;
  const annualRevenue = financialData.annualRevenue ?? 0;
  const grossSalary = financialData.grossSalary ?? 0;

  const payeResult = calculatePAYE(grossSalary);

  return calculateTaxBreakdown(netProfit, annualRevenue, payeResult.paye + payeResult.aidsLevy);
};

export const calculateMonthlyTaxLiability = (monthlyData: FinancialData): TaxBreakdown => {
  const annualizedData: FinancialData = {
    netProfit: (monthlyData.netProfit ?? 0) * 12,
    annualRevenue: (monthlyData.annualRevenue ?? 0) * 12,
    grossSalary: (monthlyData.grossSalary ?? 0) * 12,
  };
  return getEstimatedTaxBill(annualizedData);
};
