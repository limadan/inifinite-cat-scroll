import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import pageState from "./struct.js";
import loadingGIF from './assets/images/loading.gif'
import './styles/style.css'
//import api from "./api";

function App(){
  const [cats, setCats]= useState([])
  const myDiv = useRef();
  const [loadingState, setLoadingState] = useState(2)
  async function loadCats(){
    const params = {
      params: {
        limit: 10
      }
    }

    setLoadingState(pageState.LOADING)
    setTimeout(()=>{
      axios.get("https://api.thecatapi.com/v1/images/search/", 
      params).then(res=>{
        const data = res.data
        data.forEach(cat=>{
          setCats([...cats, cat])
        })
        setLoadingState(pageState.LOADED)
      }).catch((err)=>{
        setLoadingState(pageState.ERROR)
        console.log(err)
      })
    }, 1000);
    
  }

  const checkScrollEnd = function (e){
    
    
    if (myDiv.current.offsetHeight + myDiv.current.scrollTop >= myDiv.current.scrollHeight) {
      loadCats();
      myDiv.current.scrollTop-=200
      //myDiv.current.offsetHeight-=100
    }
    
  }

  useEffect(()=>{
    const params = {
      params: {
        limit: 10
      }
    }

    axios.get("https://api.thecatapi.com/v1/images/search/", 
    params).then(res=>{
      const data = res.data
      setCats(data)
      setLoadingState(pageState.LOADED)
    }).catch((err)=>{
      setLoadingState(pageState.ERROR)
      console.log(err)
    })
  }, [])
  
  if(loadingState === pageState.ERROR){
    return (<div>
      <h1>Houve um erro ao coletar os dados</h1>
    </div>)
  }else{
    return(
      <div onScroll={checkScrollEnd} ref={myDiv}>
        {cats.map(cat =>(
          <img key={cat.id} src={cat.url}/>
        ))}
        <p>
          <img src={loadingGIF} className = {loadingState===pageState.LOADING?"visible":"invisible"}/>
        </p>
      </div>
    );
  }
}


export default App;
