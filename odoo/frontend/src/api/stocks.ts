import axios from 'axios';

const API_URL = 'http://localhost:8069/api/stocks';  // Replace with your API's URL
const FIELDS_TO_REMOVE = ['create_date', 'create_uid', 'display_name', 'write_date', 'write_id', 'write_uid'];

export const fetchStocks = async () => {
  try{
    const response = await axios.get(
      `${API_URL}/`  
    ); // adjust if needed

    const cleanedData = response.data.map((obj: any) =>
      Object.fromEntries(
        Object.entries(obj).filter(([key]) => !FIELDS_TO_REMOVE.includes(key))
        .map(([key, value])=>
        key === "commande_id" ?  [key, Array.isArray(value) ? value[0] ?? null : value]: 
        key === "date_production" ? [key, String(value).slice(0,10)] : 
        [key, value])
      )
    );

    return cleanedData;
  }
  catch(error)
  {
    console.error("There was an error calling the API:", error);
    return null;}
  ;
}
