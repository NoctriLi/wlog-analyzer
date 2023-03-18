import Head from 'next/head'
import React from 'react';


import QueryBox from '../components/QueryBox'
import InformationDisplay from '../components/InformationDisplay'
import WarcraftLogsTable from '../components/WarcraftLogsTable'


import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ClientOnly from "../components/ClientOnly";
import Characters from "../components/Characters";

const HomePage = ({ initialData }) => {
  const [info, setInfo] = React.useState(null);
  const [data, setData] = React.useState(initialData)


const handleQuerySubmit = async (query) => {
  // Fetch Data Here
  try {
    const response = await axios.get('/api/your-endpoint', {
      params: { query },
    });
    setData(response.data)
  } catch (error) {
    console.error(error)
  }
}

const handleRowClick = (rowData) => {
  setInfo(rowData); //adjust this for information
}



  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
        <ClientOnly>
          <div className={styles.maine}>

            <div className={styles.sideBar}>
              <QueryBox onQuerySubmit={handleQuerySubmit} />
              <InformationDisplay info={info}></InformationDisplay>
            </div>
            <div className={styles.tableScreen}>
              <WarcraftLogsTable data={data} onRowClick={handleRowClick} />
            </div>
          </div>
          
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