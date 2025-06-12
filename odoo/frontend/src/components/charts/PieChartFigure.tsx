import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

const defaultColors = [
  "#006D77", // Deep Teal
  "#003049", // Midnight Blue
  "#5D2E8C", // Plum Purple
  "#37474F"  // Charcoal Slate
];

type PieDataItem = {
  name: string;
  value: number;
};

interface PieChartProps{
    PieData: PieDataItem[];
    outerRadiusflag: any | null
  };

const PieChartFigure: React.FC<PieChartProps>= ({PieData, outerRadiusflag}) =>{
  
  return(
      <ResponsiveContainer width="100%" height= {outerRadiusflag ==null? "90%":"80%"} >
                <PieChart>
                  <Pie
                    data={PieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadiusflag== null? 70 : 80}
                    innerRadius={0}
                    label
                    style={{backgroundColor: 'red'}}
                  >
                    {PieData.map((_, index) => (
                      <Cell
                        key={`client-${index}`}
                        fill={defaultColors[index % defaultColors.length]}
                      />
                    ))}
                  </Pie>

                    <Legend height={30}/>
                  
                </PieChart>
      </ResponsiveContainer>
    )
  }

  export default PieChartFigure; 