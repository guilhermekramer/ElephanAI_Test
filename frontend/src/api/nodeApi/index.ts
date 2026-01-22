import axios from 'axios';

export * from '../../types/types';

const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

nodeApi.interceptors.response.use(                                           
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
                                                                                            
export default nodeApi;