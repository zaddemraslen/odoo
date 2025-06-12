import axios from 'axios';

const API_URL = 'http://localhost:8069/api/commandes';  // Replace with your API's URL

const FIELDS_TO_REMOVE = ['create_date', 'create_uid', 'display_name', 'write_date', 'write_id', 'write_uid', 'production_ids'];

export const fetchCommandes = async () => {
  try{
    const response = await axios.get(
      `${API_URL}/`
    ); 
    const cleanedData = response.data.map((obj: any) =>
      Object.fromEntries(
        Object.entries(obj).filter(([key]) => !FIELDS_TO_REMOVE.includes(key))
      )
    );

    return cleanedData;
  }
  catch(error)
  {
    console.error("There was an error calling the API:", error);
    return null;}
  ;}
