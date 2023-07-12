import axios from 'axios'

export const issueABook = (book)=> async dispatch =>{
    dispatch({
        type:'ISSUE_REQUEST'
    })
  
    try {
        const API_URL = process.env.REACT_APP_API_URL
        const response = await axios.post(API_URL + '/user/book-now',book);
        // const response2 = await axios.get('/api/books/allBook');
     
       
        dispatch({
           type:'ISSUE_REQUEST_SUCCESS',
           payload:response.data
       })
      
    } catch (error) {
       dispatch({
           type:'ISSUE_REQUEST_FAILED',
           payload:error
       })

    }
}