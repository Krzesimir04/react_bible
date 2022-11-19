import './index.css';
import React from 'react';
import {useState,useEffect} from 'react';
import config from './config'
function App() {
  let [text,setText]=useState(null);
  let [list_of_books,setBooks]=useState(null);
  let [list_of_chapters,setChapters]=useState(null);

//download all books
  function fetchBooks(){
    fetch('https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/books?include-chapters=true&include-chapters-and-sections=true', {
    headers:{
      'api-key': config.API_KEY
    }
  })
  .then(response=>response.json())
  .then(obj=>setBooks(obj.data));
  }

//download chapters of chossen book
  function fetchChapters(e){
    fetch(`https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/books/${e.target.value}/chapters`,{
      headers:{
        'api-key':config.API_KEY
      }
    })
    .then(response=>response.json())
    .then(obj=>setChapters(obj.data));
  }


//download text of selected chapter
  async function Download(e){
    e.preventDefault();
    let chapter = document.querySelector('#chapter');
    await fetch(`https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/chapters/${chapter.value}?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`, {
      headers:{
        'api-key':config.API_KEY
      }
    })
    .then(response=>response.json())
    .then(obj=>setText(obj));

  }


//download all books using API.Bible
  useEffect(() =>{
    fetchBooks();
  },[])

//options for select tags from feched chapters nad books
  let options_of_books=list_of_books?.map((val)=>(
    <option key={val.id} value={val.id}>{val.name}</option>
  ));
  let options_list_of_chapters=list_of_chapters?.map((val)=>(
    <option key={val.id} value={val.id}>{val.number}</option>
  ));


  return (
    <>
        <form>
          <span className='select-section'>
            <label id='book' htmlFor='book'>Choose a book</label>
            <select onChange={fetchChapters} name='book'>
              <option value={null}>Books</option>
              {options_of_books}
            </select>
          </span>
          <span className='select-section'>
            <label htmlFor='chapter'>Choose a chapter</label>
            <select id='chapter' name='chapter'>
              {options_list_of_chapters}
            </select>
          </span>
          <button type="submit" onClick={Download}>Submit</button>
        </form>
        <div id='line'/>

        <section>
          <h3>Treść</h3>
          <span dangerouslySetInnerHTML={{__html: text?.data.content}}></span>
        </section>
    </>
  )
}


export default App;
