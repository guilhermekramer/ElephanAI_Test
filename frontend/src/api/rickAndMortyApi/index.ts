import axios from 'axios';

const rickAndMortyApi = axios.create({
  baseURL: import.meta.env.VITE_RICK_AND_MORTY_API
});

rickAndMortyApi.interceptors.response.use(                                           
  (response) => response,                                                            
  (error) => {                                                                       
    if (error.response) {                                                            
      const message = error.response.data?.error || `Error ${error.response.status}`                                                                               
      return Promise.reject(new Error(message))                                      
    }                                                                                
    if (error.request) {                                                             
      return Promise.reject(new Error("Network error"))                              
    }                                                                                
    return Promise.reject(error)                                                     
  }                                                                                  
);                                                                                    
                                                                                            
export default rickAndMortyApi;