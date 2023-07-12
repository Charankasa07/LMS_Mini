import React from "react";
import "./Allbooks.css";

function Allbooks(props) {

  const {bookDetails} = props
  // const API_URL = process.env.REACT_APP_API_URL

  const {title , author , publication , edition , year ,copies,org_name} = bookDetails


  return (
    <div className="books-page">
      <Header />
      <div className="books">
        <div className="book-card">
          <p className="bookcard-title">{title}</p>
          <p className="bookcard-author">{author}</p>
          <div className="bookcard-publication">
            <p>{publication}</p>
          </div>
          <p className="bookcard-edition">{edition}</p>
          <p className="bookcard-year">{year}</p>
          {/* <div className="bookcard-emptybox"></div> */}
        </div>
        
      </div>
    </div>
  );
}

export default Allbooks;
