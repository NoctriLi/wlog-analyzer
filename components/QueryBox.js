import React from 'react';
import { useEffect, useState } from "react";


const gradeKeys = ["C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S"]
const metricKeys = ["dps", "hps"]
const classKeys = ["Death Knight", "Demon Hunter", "Druid", "Hunter", "Mage", "Monk", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"]
const regionKeys = ["us", "eu", "kr", "tw", "cn"]

const QueryBox = ({ onQuerySubmit, query, setQuery }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false)
    
  function handleDropdownChange(event) {
    const { name, value } = event.target;
  
    if (value !== "Region" && value !== "Metric" && value !== "Class" && value !== "Grade") {
      setQuery((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    onQuerySubmit(query);
  }
  
  useEffect(() => {
    if (buttonDisabled) {
      const timer = setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [buttonDisabled])

    return (
        <form className='d-grid gap-1 d-md-flex mx-auto p-2' onSubmit={handleSubmit}>
          
           
            <select className="form-select input-sm" style={{ width: 'auto' }} name="region" value={query.region} onChange={handleDropdownChange}>
            <option value=''>Region</option>
            {regionKeys.map((key) => {
                return (<option key={key} value={key}>{key}</option>)
              })
            }
            </select>
            <select className="form-select" style={{ width: 'auto' }}  name="metric" value={query.metric} onChange={handleDropdownChange}>
            <option value=''>Metric</option>
              
              {metricKeys.map((key) => {
                return (<option key={key} value={key}>{key}</option>)
              })}
            </select>

            <select className="form-select" style={{ width: 'auto' }}  name="class" value={query.class} onChange={handleDropdownChange}>
            <option value=''>Class</option>
              {classKeys.map((key) => {
                return (<option key={key} value={key.replace(" ", "")}>{key}</option>)
              })}
            </select>
          
            <select className="form-select" style={{ width: 'auto' }}  name="grade" value={query.grade} onChange={handleDropdownChange}>
            <option value=''>Grade</option>
            {gradeKeys.map((key) => {
                return (<option key={key} value={key}>{key}</option>)
              })
            }
            </select>
          
          <button className="btn btn-secondary" type="submit" disabled={buttonDisabled}>Submit</button>
        </form>
      );
    }

export default QueryBox;