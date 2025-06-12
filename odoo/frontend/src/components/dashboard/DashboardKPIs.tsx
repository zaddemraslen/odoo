import React from 'react';
import { ProductionFlat } from '../../types/ProductionType';
import { Commande } from '../../types/CommandeType';
import { Equipe } from '../../types/EquipesType';
import { Stock } from '../../types/stocksType';
import { ChartCard } from '../ui/ChartCard';
import PieChartCard from '../ui/PieChartCard';
import ProductQuantityHistogramDistribution from '../charts/ProductHistogramDistribution';
import TotalFinancialMetricsPerProduct from '../charts/TotalFinancialMetricsPerProductScatterCHart';
import KPIBox from '../ui/KPIBox';
import { useProductionKPIs } from './useProductionKPIs';
import { useCommandeKPIs } from './useCommandeKPIs';
import { useEquipesKPIs } from './useEquipesKPIS';
import { useStocksKPIs } from './useStocksKPIs';
import StockQuantityBarChart from '../charts/StockQuantityBarChart';
import HeatMapCharts from '../charts/TeamsHeatMaps';
import LowStockAlerts from '../alert/lowQuantityAlert';
import { CartesianGrid, ComposedChart, Legend, Line, Scatter, XAxis, YAxis, Tooltip } from 'recharts'; 

interface Props {
  productions: ProductionFlat[];
  commandes: Commande[];
  stocks: Stock[],
  equipes: Equipe[]
}

  const DashboardKPIs: React.FC<Props> = ({ productions, commandes, stocks, equipes}) => {
  

  // Production KPIs
  const {
    totalProdQuantity,
    prodTotalCost,
    prodAverageUnitPrice,
    ProdAverageUnitCost,
    ProdAverageProductionTime,
    productData,
    ProdStatusData,
    mostProducedProduct,
    prodTotalRevenuePerUnit,
    averageProductData,
    prodCount,
    costs,
    gains,
    revenues,
    productionPredictions
  } = useProductionKPIs(productions);

  // Commande KPIs
  const {
      totalCmdOrders,
      totalCmdOrderedQuantity,
      orderStatusData,
      clientData,
      topClientbycmd,
    }= useCommandeKPIs(commandes)

  // Stocks KPIs
  const {
    totalStockKPI,
    stockByLocationDonutData,
    stockByMaterialBarData,
    stockBarLocations,
    totalStockByMaterial
  }= useStocksKPIs(stocks)

  const sortedStockByLocationDonutData = [...stockByLocationDonutData].sort((a, b) =>
  a.name.localeCompare(b.name)
  );
  
  const formatNumber = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const topClientbyOrder= { label: 'Meilleur client (par commande)', value: topClientbycmd }
  const mostProducedProd= { label: 'Produit le plus fabriqué', value: mostProducedProduct }
  const totalProductionCost= { label: 'Coût total de production', value: `${formatNumber(prodTotalCost)} €` }
  const totalEstimatedRevenue= { label: 'Revenu estimé total', value: `${formatNumber(prodTotalRevenuePerUnit)} €` }
  const totalCmdQuantity  ={ label: 'Quantité totale commandée', value: formatNumber(totalCmdOrderedQuantity) }

  const KPIs1= [
    topClientbyOrder,
    mostProducedProd,
    totalProductionCost,
    totalEstimatedRevenue,
    totalCmdQuantity
    ]

  const KPIs2 = [
    { label: 'Temps moyen de production / unité', value: `${formatNumber(ProdAverageProductionTime)} h` },
    { label: 'Coût moyen de production / unité', value: `${formatNumber(ProdAverageUnitCost)} €` },
    { label: 'Prix moyen de vente / unité', value: `${formatNumber(prodAverageUnitPrice)} €` },
    { label: 'Quantité totale en stock', value: `${totalStockKPI.value}` },
  ];

      const indicators= [
        totalProductionCost,
        totalEstimatedRevenue,
        { label: "Quantité totale des produits stocké", value:totalStockKPI.value},
        { label: 'Nombre des commandes', value:prodCount},
        { label: 'Nombre des productions', value:totalProdQuantity}
      ]

    const sortedStockByMaterialBarData = [...stockByMaterialBarData].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    
    const sortedStockBarLocations = [...stockBarLocations].sort((a, b) =>
      a.localeCompare(b)
    );
    
   
    const sortedTotalStockByMaterial = [...totalStockByMaterial].sort((a, b) =>
      a.label.localeCompare(b.label)
    );

  const generateLineData = (a: number, b: number, minWeekId: number, maxWeekId: number) => {
    const points = [];
    for (let week = minWeekId; week <= maxWeekId; week++) {
      points.push({ week_id: week, line_y: a * week + b });
    }
    return points;
  };
//**********************CustomTooltipQuantity********************************** */
  const CustomTooltipQuantity = ({ active, payload, label, toFixed= 0}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    // Remove regression line entries
    const filtered = payload.filter(
      (p: any) => p.name !== 'Regression Line' && !p.name?.startsWith('y =')
    );

    if (filtered.length === 0) return null;

    // Find if we have any Actual Quantity
    const actual = filtered.find((p: any) => p.name === 'Actual Quantity' && p.payload.source === 'history');

    // Find if we have any Predicted Quantity
    const predicted = filtered.find((p: any) => p.name === 'Predicted Quantity' && p.payload.source === 'prediction');

    // Prepare the final display list with priority to Actual Quantity if exists, else Predicted Quantity
    let displayPayload = [];

    if (actual) {
      displayPayload = [actual];
    } else if (predicted) {
      // Adjust the name to add "(estimated)" as in your prior logic
      const predictedWithLabel = {
        ...predicted,
        name: `${predicted.name}`,
      };
      displayPayload = [predictedWithLabel];
    } else {
      // fallback to show all filtered entries (should rarely happen)
      displayPayload = filtered;
    }

    // Get the date string for the week from your data source
    const point = productionPredictions.data.find((d) => d.week_id === label);
    const displayDate = point ? point.week_start_day : `Week ${label}`;

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: 5, paddingLeft: "10px", paddingRight: "10px" }}>
        <p>{displayDate}</p>
        {displayPayload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(toFixed) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  //**********************CustomTooltipincome********************************** */
  const CustomTooltipIncome = ({ active, payload, label, toFixed= 0}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    // Remove regression line entries
    const filtered = payload.filter(
      (p: any) => p.name !== 'Regression Line' && !p.name?.startsWith('y =')
    );

    if (filtered.length === 0) return null;

    // Find if we have any Actual Income
    const actual = filtered.find((p: any) => p.name === 'Actual Income' && p.payload.source === 'history');

    // Find if we have any Predicted Income
    const predicted = filtered.find((p: any) => p.name === 'Predicted Income' && p.payload.source === 'prediction');

    // Prepare the final display list with priority to Actual Income if exists, else Predicted Income
    let displayPayload = [];

    if (actual) {
      displayPayload = [actual];
    } else if (predicted) {
      // Adjust the name to add "(estimated)" as in your prior logic
      const predictedWithLabel = {
        ...predicted,
        name: `${predicted.name}`,
      };
      displayPayload = [predictedWithLabel];
    } else {
      // fallback to show all filtered entries (should rarely happen)
      displayPayload = filtered;
    }

    // Get the date string for the week from your data source
    const point = productionPredictions.data.find((d) => d.week_id === label);
    const displayDate = point ? point.week_start_day : `Week ${label}`;

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: 5, paddingLeft: "10px", paddingRight: "10px" }}>
        <p>{displayDate}</p>
        {displayPayload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(toFixed) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  //**********************CustomTooltipQuantity********************************** */
  const CustomTooltipCost = ({ active, payload, label, toFixed= 0}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    // Remove regression line entries
    const filtered = payload.filter(
      (p: any) => p.name !== 'Regression Line' && !p.name?.startsWith('y =')
    );

    if (filtered.length === 0) return null;

    // Find if we have any Actual Cost
    const actual = filtered.find((p: any) => p.name === 'Actual Cost' && p.payload.source === 'history');

    // Find if we have any Predicted Quantity
    const predicted = filtered.find((p: any) => p.name === 'Predicted Cost' && p.payload.source === 'prediction');

    // Prepare the final display list with priority to Actual Cost if exists, else Predicted Cost
    let displayPayload = [];

    if (actual) {
      displayPayload = [actual];
    } else if (predicted) {
      // Adjust the name to add "(estimated)" as in your prior logic
      const predictedWithLabel = {
        ...predicted,
        name: `${predicted.name}`,
      };
      displayPayload = [predictedWithLabel];
    } else {
      // fallback to show all filtered entries (should rarely happen)
      displayPayload = filtered;
    }

    // Get the date string for the week from your data source
    const point = productionPredictions.data.find((d) => d.week_id === label);
    const displayDate = point ? point.week_start_day : `Week ${label}`;

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: 5, paddingLeft: "10px", paddingRight: "10px" }}>
        <p>{displayDate}</p>
        {displayPayload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(toFixed) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  //**********************CustomTooltipQuantity********************************** */
  const CustomTooltipGain = ({ active, payload, label, toFixed= 0}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    // Remove regression line entries
    const filtered = payload.filter(
      (p: any) => p.name !== 'Regression Line' && !p.name?.startsWith('y =')
    );

    if (filtered.length === 0) return null;

    // Find if we have any Actual Gain
    const actual = filtered.find((p: any) => p.name === 'Actual Gain' && p.payload.source === 'history');

    // Find if we have any Predicted Gain
    const predicted = filtered.find((p: any) => p.name === 'Predicted Gain' && p.payload.source === 'prediction');

    // Prepare the final display list with priority to Actual Gain if exists, else Predicted Gain
    let displayPayload = [];

    if (actual) {
      displayPayload = [actual];
    } else if (predicted) {
      // Adjust the name to add "(estimated)" as in your prior logic
      const predictedWithLabel = {
        ...predicted,
        name: `${predicted.name}`,
      };
      displayPayload = [predictedWithLabel];
    } else {
      // fallback to show all filtered entries (should rarely happen)
      displayPayload = filtered;
    }

    // Get the date string for the week from your data source
    const point = productionPredictions.data.find((d) => d.week_id === label);
    const displayDate = point ? point.week_start_day : `Week ${label}`;

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: 5, paddingLeft: "10px", paddingRight: "10px" }}>
        <p>{displayDate}</p>
        {displayPayload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(toFixed) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{
       display: 'flex',
       flexDirection:'column',
       padding:0,  width:"100%",
       backgroundColor:"rgb(228, 231, 239)"
       }}>

      <div
        style={{
            
            margin: '0px',
            marginLeft: '15px',
            marginRight: '10px',
            paddingBottom: '10px',
            paddingTop: '15px',
            paddingRight: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: "center",
            backgroundColor:"white",
            padding:"10px",
             boxShadow:
            '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
            width: "100%",
            marginTop:"10px",
          }}
      >
      
      <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"5px",
                height: "50px",
                display: "flex",
                flexDirection: "row",
                justifyContent:" center",
              }}>
                <h2>KPIs et statistiques</h2>
              </div>
              <hr style={{
                border: "none",
                height: "2px",           
                margin:"0",
                
                marginTop: "5px",
                width: "100%",
                backgroundColor: "rgba(47, 5, 5, 0.26)"
              }}>
              </hr> 
        <div style={{display: "flex", justifyContent:"space-around"}}></div>
      <KPIBox kpis={indicators} finalRightBorderFlagOff={true} style={{marginTop:'30px'}}></KPIBox>
        
      <div style={{
        height:'100%',
        width:'100%',
        marginTop:'20px',
        display:'flex',
        justifyContent:'center',
        gap:'0px',
        //boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
        borderRadius: '2px',
        paddingTop:'15px',
        backgroundColor: 'white',
        marginLeft:'10px',
        marginBottom:'15px',
        }}>
    
    
        <PieChartCard
          info={""}
          title={'Volume de production par client'}
          subtitle={'Client Quantity Share'}
          data={clientData}
          InfoVspace={25}
          >
        </PieChartCard>
    
        <PieChartCard
          title={'Répartition des commandes par status'}
          subtitle={null}
          info={""}
          data={orderStatusData}
          InfoVspace={25}
          style={{minWidth:'285px'}}
          >
        </PieChartCard>
    
        <PieChartCard
          title={'Répartition des production par status'}
          subtitle={null}
          info={""}
          data={ProdStatusData}
          InfoVspace={25}
          >
        </PieChartCard>

        <PieChartCard
              style={{minHeight:'200px', minWidth:'360px'}}
              info={""}
              title={'Répartition des produits par entrepôt'}
              subtitle={null}
              data={sortedStockByLocationDonutData}
              InfoVspace={25}>
            </PieChartCard>
      </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column',justifyContent:'center', gap:'10px'}}>
      </div>

      <ChartCard 
        title='Histogramme des quantités de produits'
        style={{
            width:'100%',
            marginTop: 20,
            marginLeft:10,
            marginBottom:0,
            padding:0,
            paddingBottom:50,
          }}
        children={
        <ProductQuantityHistogramDistribution averageProductData={averageProductData} productData={productData}/>}
      >
      </ChartCard>
      {/*<KPIBox kpis={KPIs1} finalRightBorderFlagOff={true} style={{marginTop:'0px'}}></KPIBox>*/}
      

      {/** *********************** For the quantity *********************************/}

        <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"5px",
                height: "50px",
                display: "flex",
                flexDirection: "row",
                justifyContent:" center",
              }}>
                <h2>Prédiction la quantité totale en production</h2>
              </div>
              <hr style={{
                border: "none",
                height: "2px",           
                margin:"20px 0",
                marginTop: "5px",
                width: "100%",
                backgroundColor: "rgba(47, 5, 5, 0.26)"
              }}>
              </hr> 
        <div style={{display: "flex", justifyContent:"space-around"}}>
      <ComposedChart width={1000} height={400}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="week_id"
            type="number"
            tickFormatter={(week_id) => {
              const point = productionPredictions.data.find(d => d.week_id === week_id);
              const reference_date = productionPredictions.data[0].week_start_day;

              if (point) {
                return point.week_start_day;
              } else {
                // Compute week_date based on reference_date + (week_id * 7 days)
                const baseDate = new Date(reference_date); // convert string to Date
                const computedDate = new Date(baseDate);
                computedDate.setDate(baseDate.getDate() + week_id * 7);

                // Format it as YYYY-MM-DD (or any format you want)
                const formattedDate = computedDate.toISOString().split('T')[0];

                return formattedDate;
              }
            }} 
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => (value === 0 ? '' : value)}
          />
          
          <Tooltip content={<CustomTooltipQuantity  />} />

          <Legend wrapperStyle={{ paddingTop: '10px', marginTop: '20px' }}/>
          
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'history')}
            dataKey="quantity"
            name="Actual Quantity"
            fill="#1D3557"
            shape="circle"
          />
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'prediction')}
            dataKey="quantity"
            name="Predicted Quantity"
            fill='#4B3F72'  
            shape="diamond"
          />
          
          {<Line
            type="linear"
            data={generateLineData( productionPredictions.quantityLR.a, productionPredictions.quantityLR.b, 0, productionPredictions.data[productionPredictions.data.length -1]?.week_id || 0)}
            dataKey="line_y"
            name={`y = ${productionPredictions.quantityLR?.a.toFixed(3)} * x ${
              productionPredictions.quantityLR?.b != null && productionPredictions.quantityLR?.b!==0 
                ? ` ${productionPredictions.quantityLR.b > 0 ? '+' : '-'} ${Math.abs(productionPredictions.quantityLR.b).toFixed(3)}`
                : ''
            }`}
            stroke="#E63946"
            dot={false}
            isAnimationActive={false}
            activeDot={false}
          />}
        </ComposedChart>
        </div>
        {/** *********************** For the income *********************************/}
        <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"5px",
                height: "50px",
                display: "flex",
                flexDirection: "row",
                justifyContent:" center",
              }}>
                <h2>Prédiction du revenu</h2>
              </div>
              <hr style={{
                border: "none",
                height: "2px",           
                margin:"20px 0",
                marginTop: "5px",
                width: "100%",
                backgroundColor: "rgba(47, 5, 5, 0.26)"
              }}>
              </hr> 
        <div style={{display: "flex", justifyContent:"space-around"}}>
      <ComposedChart width={1000} height={400}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="week_id"
            type="number"
            tickFormatter={(week_id) => {
              const point = productionPredictions.data.find(d => d.week_id === week_id);
              const reference_date = productionPredictions.data[0].week_start_day;

              if (point) {
                return point.week_start_day;
              } else {
                // Compute week_date based on reference_date + (week_id * 7 days)
                const baseDate = new Date(reference_date); // convert string to Date
                const computedDate = new Date(baseDate);
                computedDate.setDate(baseDate.getDate() + week_id * 7);

                // Format it as YYYY-MM-DD (or any format you want)
                const formattedDate = computedDate.toISOString().split('T')[0];

                return formattedDate;
              }
            }} 
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => (value === 0 ? '' : value)}
          />
          
          <Tooltip content={<CustomTooltipIncome toFixed={3}/>} />

          <Legend wrapperStyle={{ paddingTop: '10px', marginTop: '20px' }}/>
          
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'history')}
            dataKey="income"
            name="Actual Income"
            fill="#1D3557"
            shape="circle"
          />
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'prediction')}
            dataKey="income"
            name="Predicted Income"
            fill='#4B3F72'  
            shape="diamond"
          />  
          
          {<Line
            type="linear"
            data={generateLineData( productionPredictions.incomeLR.a, productionPredictions.incomeLR.b, 0, productionPredictions.data[productionPredictions.data.length -1]?.week_id || 0)}
            dataKey="line_y"
            name={`y = ${productionPredictions.incomeLR?.a.toFixed(3)} * x ${
              productionPredictions.incomeLR?.b != null && productionPredictions.incomeLR?.b!==0 
                ? ` ${productionPredictions.incomeLR.b > 0 ? '+' : '-'} ${Math.abs(productionPredictions.incomeLR.b).toFixed(3)}`
                : ''
            }`}
            stroke="#E63946"
            dot={false}
            isAnimationActive={false}
            activeDot={false}
          />}
        </ComposedChart>
        </div>
      {/** *********************** For the cost *********************************/}
      <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"5px",
                height: "50px",
                display: "flex",
                flexDirection: "row",
                justifyContent:" center",
              }}>
                <h2>Prédiction des coûts de production</h2>
              </div>
              <hr style={{
                border: "none",
                height: "2px",           
                margin:"20px 0",
                marginTop: "5px",
                width: "100%",
                backgroundColor: "rgba(47, 5, 5, 0.26)"
              }}>
              </hr> 
      <div style={{display: "flex", justifyContent:"space-around"}}>
      <ComposedChart width={1000} height={400}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="week_id"
            type="number"
            tickFormatter={(week_id) => {
              const point = productionPredictions.data.find(d => d.week_id === week_id);
              const reference_date = productionPredictions.data[0].week_start_day;

              if (point) {
                return point.week_start_day;
              } else {
                // Compute week_date based on reference_date + (week_id * 7 days)
                const baseDate = new Date(reference_date); // convert string to Date
                const computedDate = new Date(baseDate);
                computedDate.setDate(baseDate.getDate() + week_id * 7);

                // Format it as YYYY-MM-DD (or any format you want)
                const formattedDate = computedDate.toISOString().split('T')[0];

                return formattedDate;
              }
            }} 
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => (value === 0 ? '' : value)}
          />
          
          <Tooltip content={<CustomTooltipCost  />} />

          <Legend wrapperStyle={{ paddingTop: '10px', marginTop: '20px' }}/>
          
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'history')}
            dataKey="cost"
            name="Actual Cost"
            fill="#1D3557"
            shape="circle"
          />
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'prediction')}
            dataKey="cost"
            name="Predicted Cost"
            fill='#4B3F72'  
            shape="diamond"
          />

          {<Line
            type="linear"
            data={generateLineData( productionPredictions.costLR.a, productionPredictions.costLR.b, 0, productionPredictions.data[productionPredictions.data.length -1]?.week_id || 0)}
            dataKey="line_y"
            name={`y = ${productionPredictions.costLR?.a.toFixed(3)} * x ${
              productionPredictions.costLR?.b != null && productionPredictions.costLR?.b!==0 
                ? ` ${productionPredictions.costLR.b > 0 ? '+' : '-'} ${Math.abs(productionPredictions.costLR.b).toFixed(3)}`
                : ''
            }`}
            stroke="#E63946"
            dot={false}
            isAnimationActive={false}
            activeDot={false}
          />}
        </ComposedChart>
            </div>
      {/** *********************** For the Gain *********************************/}
      <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"5px",
                height: "50px",
                display: "flex",
                flexDirection: "row",
                justifyContent:" center",
              }}>
                <h2>Prédiction du Gain</h2>  
              </div>
              <hr style={{
                border: "none",
                height: "2px",           
                margin:"20px 0",
                marginTop: "5px",
                width: "100%",
                backgroundColor: "rgba(47, 5, 5, 0.26)"
              }}>
              </hr> 
      <div style={{display: "flex", justifyContent:"space-around"}}>
      <ComposedChart width={1000} height={400}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="week_id"
            type="number"
            tickFormatter={(week_id) => {
              const point = productionPredictions.data.find(d => d.week_id === week_id);
              const reference_date = productionPredictions.data[0].week_start_day;

              if (point) {
                return point.week_start_day;
              } else {
                // Compute week_date based on reference_date + (week_id * 7 days)
                const baseDate = new Date(reference_date); // convert string to Date
                const computedDate = new Date(baseDate);
                computedDate.setDate(baseDate.getDate() + week_id * 7);

                // Format it as YYYY-MM-DD (or any format you want)
                const formattedDate = computedDate.toISOString().split('T')[0];

                return formattedDate;
              }
            }} 
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => (value === 0 ? '' : value)}
          />
          
          <Tooltip content={<CustomTooltipGain  />} />

          <Legend wrapperStyle={{ paddingTop: '10px', marginTop: '20px' }}/>
          
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'history')}
            dataKey="gain"
            name="Actual Gain"
            fill="#1D3557"
            shape="circle"
          />
          <Scatter
            data={productionPredictions.data.filter(d => d.source === 'prediction')}
            dataKey="gain"
            name="Predicted Gain"
            fill='#4B3F72'  
            shape="diamond"
          />
          
          {<Line
            type="linear"
            data={generateLineData( productionPredictions.gainLR.a, productionPredictions.gainLR.b, 0, productionPredictions.data[productionPredictions.data.length -1]?.week_id || 0)}
            dataKey="line_y"
            name={`y = ${productionPredictions.gainLR?.a.toFixed(3)} * x ${
              productionPredictions.gainLR?.b != null && productionPredictions.gainLR?.b!==0 
                ? ` ${productionPredictions.gainLR.b > 0 ? '+' : '-'} ${Math.abs(productionPredictions.gainLR.b).toFixed(3)}`
                : ''
            }`}
            stroke="#E63946"
            dot={false}
            isAnimationActive={false}
            activeDot={false}
          />}
        </ComposedChart>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardKPIs;