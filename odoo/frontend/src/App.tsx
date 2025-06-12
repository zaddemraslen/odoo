// src/App.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from './api/api';
import './styles/App.css'
import { Tab, Tabs, Box } from '@mui/material';
import ProductionList from './components/ProductionList';
import CommandeList from './components/CommandeList';
import EquipesList from './components/EquipesList';
import StockList from './components/StockList';
import Dashboard from './components/dashboard/Dashboard';
const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Load tabIndex from localStorage or default to 0
  const [tabIndex, setTabIndex] = useState<number>(() => {
    const storedIndex = localStorage.getItem('selectedTabIndex');
    return storedIndex !== null ? parseInt(storedIndex, 10) : 0;
  });

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
      setLoading(false);
    };
    getData();
  }, []);

  // Handle tab change and save selected index
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
    localStorage.setItem('selectedTabIndex', newIndex.toString());
  };

  return (
    <div style={{backgroundColor:"yellow", width: "88%", padding:"0", margin:"0"}}>
      <Box sx={{
        width: '110%',
        height: "100%",
        backgroundColor: 'rgb(218, 221, 255)',
        margin: "0",
        marginTop:
        tabIndex === 0 ? '-130px' :
        tabIndex === 1 ? '-130px' :
        tabIndex === 2 ? '-165px' :
        tabIndex === 3 ? '-130px' :
        tabIndex === 4 ? '-150px' :
        '0px', // default fallback
        padding:"0px"}}
      >
        <Tabs
          sx={{
              margin:0,
              marginTop:"150px",
              marginLeft:2,
              padding:0,
              width:'100%',
              color: 'black', // default (unselected) tab color
                '& .MuiTab-root': {
                  color: 'gray', // unselected tab text color
                  fontWeight: 500,
                },
                '& .Mui-selected': {
                  color: '#1a237e', // selected tab text color
                  fontWeight: 700,
                },
            }}
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="production tabs"
        >
          
          
          <Tab label="Tableau de bord" />
          <Tab label="Données" />
        </Tabs>
        <Box sx={{ padding: 2, paddingTop:0, margin:0, marginTop:0, backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 0 && <Dashboard/>}
        </Box>
        
        <Box sx={{  padding: 2, paddingTop:0, margin:0, marginTop:-2,backgroundColor: "rgb(228, 231, 239)", width:'97.35%' }}>
          {tabIndex === 1 && 
          <div style={{
            backgroundColor:"white",
            padding:'10px',
            display:"flex",
            flexDirection: "column",
            justifyContent: "space-between"
            }}> 
              <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"0px",
                height: "50px"
              }}>
                <h2>Table Production</h2>
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
              <ProductionList/>
              <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"0px",
                height: "50px"
              }}>
                <h2>Table Commandes</h2>
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
              <CommandeList/>
                <div style={{
                  width:"100%",
                  backgroundColor:"rgba(199, 199, 199, 0.18)",
                  paddingLeft:"10px",
                  paddingBottom:"0px",
                  height: "50px"
                  }}>
                  <h2>Table Équipes</h2>
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
              <EquipesList/>
              <div style={{
                width:"100%",
                backgroundColor:"rgba(199, 199, 199, 0.18)",
                paddingLeft:"10px",
                paddingBottom:"0px",
                height: "50px"
              }}>
                <h2>Table Stock </h2>
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
              <StockList/>
            </div>
          }
        </Box>
      </Box>
      </div>
  );
}
export default App;