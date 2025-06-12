import { useMemo } from 'react';
import { Stock } from '../../types/stocksType';

export function useStocksKPIs(stocks: Stock[])
{

    const totalStockKPI = useMemo(() => {
    const total = stocks.reduce((sum, s) => sum + (s.quantite_disponible || 0), 0);
    return {
      label: 'Total Stock Quantity',
      value: total.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    };
  }, [stocks]);
///////////////////////////
  const stockByLocationDonutData = useMemo(() => {
    const map: Record<string, number> = {};
    stocks.forEach(s => {
      const location = s.lieu_stockage || 'Inconnu';
      map[location] = (map[location] || 0) + (s.quantite_disponible || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [stocks]);
////////////////////////////////
  const stockByMaterialBarData = useMemo(() => {
    const locationSet = new Set<string>();
    const materialMap: Record<string, Record<string, number>> = {};
    const totalByMaterialMap: Record<string, number> = {};

    stocks.forEach(s => {
        const type = s.type_matiere || 'Inconnu';
        const location = s.lieu_stockage || 'Inconnu';
        const quantity = s.quantite_disponible || 0;

        locationSet.add(location);

        if (!materialMap[type]) {
        materialMap[type] = {};
        }

        materialMap[type][location] = (materialMap[type][location] || 0) + quantity;

      // accumulate total quantity per material
      totalByMaterialMap[type] = (totalByMaterialMap[type] || 0) + quantity;
    });

    const locations = Array.from(locationSet);
    const data= Object.entries(materialMap).map(([material, locationQuantities]) => ({
        label: material,
        ...locationQuantities,
    }));

    // Build array of totals per material, aligned by label
    const totalStockByMaterial = data.map(d => ({
      label: d.label,
      totalQuantity: totalByMaterialMap[d.label] || 0,
    }));

    return { data, locations, totalStockByMaterial };
    }, [stocks]);
  ////////////////////////////////////////////
  return {
        totalStockKPI: totalStockKPI,
        stockByLocationDonutData: stockByLocationDonutData,
        stockByMaterialBarData: stockByMaterialBarData.data,
        stockBarLocations: stockByMaterialBarData.locations,
        totalStockByMaterial: stockByMaterialBarData.totalStockByMaterial
  };
}
