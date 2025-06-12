import React, { useState } from 'react';
import './LowQuantityAlert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation, faDiamond } from '@fortawesome/free-solid-svg-icons'; // or another relevant icon

interface Product {
  name: string;
  value: number;
}

interface LowStockAlertsProps {
  productData: Product[];
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ productData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const lowStockProducts = productData.filter(p => p.value < 500);

  return (
    <div className="low-stock-container"
    style={{
        backgroundColor: "#f8d7da",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        marginLeft: "15px",
        borderLeft:"1px solid rgba(132, 32, 40, 0.3)",
        borderRight:"1px solid rgba(132, 32, 40, 0.3)",
        borderTop: "5px double rgba(132, 32, 40, 0.7)",
        borderBottom: "4px double rgba(132, 32, 40, 0.7)",
        borderRadius:"2px",
        
        }}>
      <div 
        className="toggle-button" 
        onClick={() => setIsExpanded(prev => !prev)}
        style={{
            display:"flex",
            justifyContent:"space-between",
            alignContent:"center"
        }}
        >
           
        <FontAwesomeIcon icon={isExpanded ? faCaretUp  : faCaretDown} size='lg' style={{marginLeft:"10px", marginTop:"3px"}}/>
        <div>
            <span style={{fontWeight:"bold"}}>{isExpanded ? 'Réduire les alertes' : 'Afficher les alertes'} </span>
            (produits en faible quantité)
        </div>
        <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown } size='lg' style={{marginRight:"10px" , marginTop:"5px"}}/>
      </div>
        <hr style={{
            border: 'none',
            borderTop: '2px solid rgba(155, 17, 17, 0.3)',
            margin: '2px 5px',
            width: '99%',
            paddingLeft: '5px'
        }}></hr>
        
      {!isExpanded ? (
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {lowStockProducts.map((product, index) => (
              <span className="ticker-item" key={`${product.name}-${index}`}>
                <FontAwesomeIcon icon={faCircleExclamation} size="lg" style={{color: "#ac2020",}} /> {product.name} (Qté: {product.value})
              </span>
            ))}
            <span className="ticker-spacer" aria-hidden="true"><FontAwesomeIcon icon={faDiamond}></FontAwesomeIcon></span>
            
            {lowStockProducts.map((product, index) => (
              <span className="ticker-item" key={`${product.name}-${index}`}>
                <FontAwesomeIcon icon={faCircleExclamation} size="lg" style={{color: "#ac2020",}} /> {product.name} (Qté: {product.value})
              </span>
            ))}
            <span className="ticker-spacer" aria-hidden="true"><FontAwesomeIcon icon={faDiamond}></FontAwesomeIcon></span>

            {lowStockProducts.map((product, index) => (
              <span className="ticker-item" key={`${product.name}-${index}`}>
                <FontAwesomeIcon icon={faCircleExclamation} size="lg" style={{color: "#ac2020",}} /> {product.name} (Qté: {product.value})
              </span>
            ))}
          </div>
          
        </div>
      ) : (
        <ul className="expanded-list" style={{marginLeft:"20px", marginTop:"8px", marginBottom: "8px"}}>
          {lowStockProducts.map((product, index) => (
            <li key={`${product.name}-${index}`}>
              <FontAwesomeIcon icon={faCircleExclamation} size="lg" style={{color: "#ac2020",}} /> {product.name} (Qté: {product.value})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LowStockAlerts;