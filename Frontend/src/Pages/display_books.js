import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { BrowserRouter as Redirect} from 'react-router-dom'
import axios from "axios";

// import Allbooks from "./Allbooks";
import { issueABook } from "./actions/issue_action";
import "./display_books.css";
import { Dropdown } from "semantic-ui-react";
import { AuthContext } from "../Context/AuthContext";
// import BookingMessage from './booking_message'

function DisplayBooks() {
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL;

  const { user } = useContext(AuthContext);

  const userId = user._id

  // const userID = String(user._id)

  const [bookDetails, setbookDetails] = useState([]);

  const [filterBooks, setfilterBooks] = useState([]);

  const [BookFilter, setBookFilter] = useState(null);

  useEffect(() => {
    const getbookDetails = async () => {
      try {
        const response = await axios.get(API_URL + "org/get");
        setbookDetails(response.data);
        setfilterBooks(response.data);
      } catch (err) {}
    };
    getbookDetails();
  }, [API_URL]);

  //   console.log(bookDetails);

  const searchBook = async (e) => {
    e.preventDefault();
    const searchInput = document
      .getElementById("search-input")
      .value.toLowerCase();
    console.log(searchInput);

    var bookfilter = BookFilter;

    if (bookfilter == null) {
      bookfilter = "title";
    }

    console.log(bookfilter);

    const filtered_books = await bookDetails.filter(
      (item) => item[`${bookfilter}`].toLowerCase().includes(searchInput),
      bookfilter
    );

    setfilterBooks(filtered_books);
  };

  const book_filters = [
    { value: "title", text: "Title" },
    { value: "author", text: " Author" },
    { value: "publication", text: "Publication" },
  ];
  const BookNow = async (book, user) => {
    //   try {

    //     const {_id : bid} = book
    //     console.log(book._id);
    //     const email = user.email
    //     const issueUser = {bid,email}
    //     console.log(user);
    //     // console.log(typeof bid,typeof uid);
    //     let url = API_URL + 'user/book-now'
    //     console.log(url);
    //     await axios.post(API_URL + `user/book-now`,issueUser);
    //     // console.log(res.data);
    //     // <Redirect to='/booking-message' />
    //   } catch (error) {
    //     console.log(error);
    //   }
    
    const {_id} = book ;

    const issueUser = {
      userId,
      bookId: _id,
    };
    if (book.copies) {
      dispatch(issueABook(issueUser));
      // setBookTitle(title);
      // setShow(true);
      // dispatch(getAllBook());
    } else {
      alert("book not available");
    }
  };

  return (
    // <div>
    //   <p>Books List</p>
    //   {bookDetails.map((item) => (
    //     <Allbooks booksDetails={item} key={item._id} />
    //   ))}
    // </div>
    <div className="book-details-container">
      {/* <br></br>
      <br></br>
      <br></br> */}
      <div className="search-box">
        <input
          className="search-input"
          type="search"
          placeholder="Search a Book"
          id="search-input"
        />
        <button className="search-button" onClick={searchBook}>
          Search
        </button>
        <Dropdown
          className="search-filter"
          placeholder="Search By"
          fluid
          selection
          options={book_filters}
          onChange={(event, data) => setBookFilter(data.value)}
          defaultValue={book_filters[0]}
        />
      </div>
      <div className="book-container">
        {filterBooks.map((book) => (
          <div className="book-card">
            <h5 className="book">{book.title}</h5>
            <p className="book">{book.author}</p>
            <p className="book">{book.publication}</p>
            <p className="book">
              {book.edition ? `${book.edition + " Edition"}` : null}
            </p>
            <p className="book">{book.year}</p>
            <p className="book">
              <b>Copies : </b> {book.copies}
            </p>
            <button className="book-now" onClick={() => BookNow(book)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
      {/* <table>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Publication</th>
          <th>Edition</th>
          <th>Year</th>
        </tr>
        {filterBooks.map((item) => (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>{item.author}</td>
            <td>{item.publication}</td>
            <td>{item.edition}</td>
            <td>{item.year}</td>
          </tr>
        ))}
      </table> */}
    </div>
  );
}

export default DisplayBooks;
