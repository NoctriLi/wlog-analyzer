import Head from 'next/head'
import React from 'react';
import { useEffect, useState } from "react";

import QueryBox from '../components/QueryBox'
import InformationDisplay from '../components/InformationDisplay'
import CharacterTable from '../components/CharacterTable'
import Characters from '../components/PopulateCharacterData'
var char = require('../components/PopulateCharacterData')

import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ClientOnly from "../components/ClientOnly";




const HomePage = () => {
  
  /*
  const [info, setInfo] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  
const handleQuerySubmit = async (query) => {
  // Fetch Data Here
  setIsLoading(true);
  setData(Characters(query, characters, setCharacters));
  setIsLoading(false);
}

const handleRowClick = (rowData) => {
  setInfo(rowData); //adjust this for information
}
*/


  return (
    <div>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WL Recruitment Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
        <ClientOnly>
          <Characters/>
          
        </ClientOnly>
      </main>
    </div>
  );

}


export async function getServerSideProps() {
  //Fetch initial data from backend here
  const initialData = []; //replace with initial data

  return {
    props: {
      initialData
    },
  };
}


export default HomePage;