import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from 'recharts';
import CustomTooltip from '../utils/CustomTooltip';

interface DataPoint {
  name: string;
  value: number;
}

interface ProductQuantityHistogramDistributionPropos {
  averageProductData: number;
  productData: DataPoint[];
}

const availabilityStatusColors = {
  eleve: "#007F5F",   // Dark green (high availability)
  moyen: "#E0A200",   // Darker amber/goldenrod (medium availability)
  faible: "#AE2012"   // Dark red (low availability)
};

const ProductQuantityHistogramDistribution: React.FC<ProductQuantityHistogramDistributionPropos> = ({averageProductData, productData}) => {
  const tooltipData = [
  productData.map((item, idx) => ({
    name: item.name,
    y: item.value,
    idx,
    label: "Quantité"
  }))
  .sort((a,b) => a.name.localeCompare(b.name))
  ];
  
  const getBarColor = (value: number) => {
  if (value < 10000) return availabilityStatusColors.faible;
  if (value < 20000) return availabilityStatusColors.moyen;
  return availabilityStatusColors.eleve;
};

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', height: 300 }}>
      <div style={{ width: '100%', height: '25px' }}>
        {/* Custom Legend ABOVE the chart */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 12,
            marginBottom: 10,
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: 16,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            <li style={{ display: 'flex', alignItems: 'center', color: availabilityStatusColors.faible }}>
              <span style={{ width: 10, height: 10, backgroundColor: availabilityStatusColors.faible, marginRight: 6 }} />
              Faible
            </li>
            <li style={{ display: 'flex', alignItems: 'center', color: availabilityStatusColors.moyen }}>
              <span style={{ width: 10, height: 10, backgroundColor: availabilityStatusColors.moyen, marginRight: 6 }} />
              Moyen
            </li>
            <li style={{ display: 'flex', alignItems: 'center', color: availabilityStatusColors.eleve }}>
              <span style={{ width: 10, height: 10, backgroundColor: availabilityStatusColors.eleve, marginRight: 6 }} />
              Élevé
            </li>
            
          </ul>
        </div>
      </div>
          
      <ResponsiveContainer width="95%" height="100%" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <BarChart data={tooltipData[0]} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
          <XAxis
            dataKey="name"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 10, fontStyle: 'italic' }}
          />
          <YAxis />
          <RechartsTooltip content={<CustomTooltip CustomTooltipInfo={tooltipData} integerFlag={true}/>} />
          <Bar dataKey="y" fill="#524ea6" barSize={120} >
            {tooltipData[0].map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.y)} />
            ))}
          </Bar>
        </BarChart>       
      </ResponsiveContainer>
      
    </div>
  );
};

export default ProductQuantityHistogramDistribution;
