import React from 'react';
import { Typography } from '@mui/material';

interface KPI {
  label: string;
  value: string | number;
}

interface KPIBoxProps {
  kpis: KPI[];
  finalRightBorderFlagOff: boolean;
  style?: React.CSSProperties;
}

const KPIBox: React.FC<KPIBoxProps> = ({ kpis , finalRightBorderFlagOff, style}) => {
  
  if (!kpis || kpis.length === 0) {
    return (
      <div
        style={{
          padding: '20px',
          margin: '10px',
          backgroundColor: '#fff',
          borderRadius: '5px',
          
        }}
      >
        <Typography variant="subtitle1" align="center" color="textSecondary">
          No KPIs available to display.
        </Typography>
      </div>
    );
  }
  
    return (
    <div
      style={{
       
        //padding: '0px',
        //backgroundColor: 'white',
        //marginBottom: '10px',
        marginLeft: '10px',
        width: '100%',
        display: 'flex',
        //marginTop: 65,
        borderRadius: '3px',
        justifyContent:"space-around",
        ...style
      }}
    >
      {kpis.map((kpi, index) => (
        <div
          key={index}
          style={{
            
            margin: '0px',
            marginLeft: '15px',
            marginRight: '10px',
            paddingBottom: '10px',
            paddingTop: '5px',
            paddingRight: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor:"white",
            padding:"10px",
            borderRadius:"7px",
            border:" 2px solid gray",
             boxShadow:
            '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {kpi.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {kpi.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default KPIBox;
