import { Production } from "../../types/ProductionType";

type WeeklyData = {
  week_start_day: string;
  week_id: number;
  quantity: number;
  cost: number;
  income: number;
  gain: number;
  source: "history" | "prediction";
};

type LinearRegression = { a: number; b: number };
type PolynomialRegression = { coefficients: number[] };

type Result = {
  data: WeeklyData[];
  dataPol: WeeklyData[];
  quantityLR: LinearRegression;
  costLR: LinearRegression;
  incomeLR: LinearRegression;
  gainLR: LinearRegression;
  //quantityPR: PolynomialRegression;
  //costPR: PolynomialRegression;
  //incomePR: PolynomialRegression;
  //gainPR: PolynomialRegression;
};

/**
 * Computes linear regression coefficients a (slope) and b (intercept)
 * for y = a * x + b
 */
function computeLinearRegression(points: { x: number; y: number }[]): LinearRegression {
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { a: 0, b: sumY / n };

  const a = (n * sumXY - sumX * sumY) / denominator;
  const b = (sumY - a * sumX) / n;

  return { a, b };
}

function computePolynomialRegression(points: { x: number; y: number }[], degree: number): PolynomialRegression {
  const X: number[][] = [];
  const Y: number[] = [];

  for (const p of points) {
    const row: number[] = [];
    for (let i = 0; i <= degree; i++) {
      row.push(Math.pow(p.x, i));
    }
    X.push(row);
    Y.push(p.y);
  }

  // Solve the normal equation (X^T X)A = X^T Y
  const XT = X[0].map((_, i) => X.map(row => row[i])); // transpose
  const XTX = XT.map(row => XT[0].map((_, j) => row.reduce((sum, val, k) => sum + val * X[k][j], 0)));
  const XTY = XT.map(row => row.reduce((sum, val, k) => sum + val * Y[k], 0));

  // Solve linear system XTX * A = XTY using Gaussian elimination (naive)
  const A = gaussianElimination(XTX, XTY);

  return { coefficients: A };
}

function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      b[k] -= factor * b[i];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = (b[i] - A[i].slice(i + 1).reduce((sum, val, j) => sum + val * x[i + 1 + j], 0)) / A[i][i];
  }
  return x;
}

/**
 * Helper to get the Monday of a given date
 */
function getWeekStartDay(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when it's Sunday
  const monday = new Date(date.setDate(diff));
  // Format as YYYY-MM-DD
  return monday.toISOString().split('T')[0];
}

export function useProductionsPredictions(productions: Production[], nFutureWeeks: number = 12): Result {
    
    console.log("@productions data: ", productions);
    
    // Step 1: Group productions by week_start_day
  const weekMap = new Map<string, {
    quantity: number;
    cost: number;
    income: number;
    gain: number;
  }>();

  // Group data by week
  productions.forEach(prod => {
    const weekStart = getWeekStartDay(prod.date_production);

    // Initialize entry if not exists
    if (!weekMap.has(weekStart)) {
      weekMap.set(weekStart, {
        quantity: 0,
        cost: 0,
        income: 0,
        gain: 0
      });
    }

    const weekData = weekMap.get(weekStart)!;

    weekData.quantity += prod.quantite;
    weekData.cost += prod.cout_production;
    const income = prod.quantite * prod.prix_unitaire;
    weekData.income += income;
    weekData.gain = weekData.income - weekData.cost;
  });
    
    // Step 2: Convert Map to sorted array of weeks
    const historicalData: WeeklyData[] = Array.from(weekMap.entries())
        .sort(([weekA], [weekB]) => new Date(weekA).getTime() - new Date(weekB).getTime())
        .map(([weekStartDay, values], index) => ({
        week_start_day: weekStartDay,
        week_id: index,
        quantity: values.quantity,
        cost: values.cost,
        income: values.income,
        gain: values.gain,
        source: "history" as const
        }));
    
    // Compute regression for each field
    const quantityLR = computeLinearRegression(historicalData.map(d => ({ x: d.week_id, y: d.quantity })));
    const costLR = computeLinearRegression(historicalData.map(d => ({ x: d.week_id, y: d.cost })));
    const incomeLR = computeLinearRegression(historicalData.map(d => ({ x: d.week_id, y: d.income })));
    const gainLR = computeLinearRegression(historicalData.map(d => ({ x: d.week_id, y: d.gain })));

    // Generate future weeks using regression
    const lastWeek = historicalData[historicalData.length - 1];
    const lastDate = new Date(lastWeek.week_start_day);
    const predictionData: WeeklyData[] = [];
 
    for (let i = 1; i <= nFutureWeeks; i++) {
        const week_id = lastWeek.week_id + i;
        const futureDate = new Date(lastDate);
        futureDate.setDate(futureDate.getDate() + i * 7);
        const week_start_day = futureDate.toISOString().split("T")[0];

        predictionData.push({
        week_start_day,
        week_id,
        quantity: quantityLR.a * week_id + quantityLR.b,
        cost: costLR.a * week_id + costLR.b,
        income: incomeLR.a * week_id + incomeLR.b,
        gain: gainLR.a * week_id + gainLR.b,
        source: "prediction"
        });
    }

    // Polynomial regression predictions
  const quantityPR = computePolynomialRegression(historicalData.map(d => ({ x: d.week_id, y: d.quantity })), 2);
  const costPR = computePolynomialRegression(historicalData.map(d => ({ x: d.week_id, y: d.cost })), 2);
  const incomePR = computePolynomialRegression(historicalData.map(d => ({ x: d.week_id, y: d.income })), 2);
  const gainPR = computePolynomialRegression(historicalData.map(d => ({ x: d.week_id, y: d.gain })), 2);

  const predictionDataPol: WeeklyData[] = [];

  const evalPoly = (coeffs: number[], x: number) =>
    coeffs.reduce((acc, coef, i) => acc + coef * Math.pow(x, i), 0);

  for (let i = 1; i <= nFutureWeeks; i++) {
    const week_id = lastWeek.week_id + i;
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i * 7);
    const week_start_day = futureDate.toISOString().split("T")[0];

    predictionDataPol.push({
      week_start_day,
      week_id,
      quantity: evalPoly(quantityPR.coefficients, week_id),
      cost: evalPoly(costPR.coefficients, week_id),
      income: evalPoly(incomePR.coefficients, week_id),
      gain: evalPoly(gainPR.coefficients, week_id),
      source: "prediction"
    });
  }

    const result= {
        data: [...historicalData, ...predictionData],
        dataPol: [...historicalData, ...predictionDataPol],
        quantityLR,
        costLR,
        incomeLR,
        gainLR
    };

    console.log("@weekly aggregated data: ", result);
    return result;
}
