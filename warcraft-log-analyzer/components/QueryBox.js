import React from 'react';
import { useEffect, useState } from "react";


const gradeKeys = ["C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S"]
const metricKeys = ["dps", "hps"]
const classKeys = ["Death Knight", "Demon Hunter", "Druid", "Hunter", "Mage", "Monk", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"]
const regionKeys = ["us", "eu", "kr", "tw", "cn"]

const QueryBox = ({ onQuerySubmit, query, setQuery }) => {
    
    
      const handleSubmit = (e) => {
        e.preventDefault();
        onQuerySubmit(query);
    }
    
      function handleDropdownChange(event) {
        const { name, value } = event.target;
    
        setQuery(prevFormData => ({
          ...prevFormData,
          [name]: value,
        }));
      }

    return (
        <form className='d-grid gap-1 d-md-flex mx-auto p-2' onSubmit={handleSubmit}>
          
           
            <select className="form-select input-sm" style={{ width: 'auto' }} name="region" value={query.region} onChange={handleDropdownChange}>
            <option selected>Region</option>
            {regionKeys.map((key) => {
                return (<option value={key}>{key}</option>)
              })
            }
            </select>
            <select className="form-select" style={{ width: 'auto' }}  name="metric" value={query.metric} onChange={handleDropdownChange}>
            <option selected>Metric</option>
              
              {metricKeys.map((key) => {
                return (<option value={key}>{key}</option>)
              })}
            </select>

            <select className="form-select" style={{ width: 'auto' }}  name="class" value={query.class} onChange={handleDropdownChange}>
            <option selected>Class</option>
              {classKeys.map((key) => {
                return (<option value={key.replace(" ", "")}>{key}</option>)
              })}
            </select>
          
            <select className="form-select" style={{ width: 'auto' }}  name="grade" value={query.grade} onChange={handleDropdownChange}>
            <option selected>Grade</option>
            {gradeKeys.map((key) => {
                return (<option value={key}>{key}</option>)
              })
            }
            </select>
          
          <button className="btn btn-secondary" type="submit">Submit</button>
        </form>
      );
    }

export default QueryBox;