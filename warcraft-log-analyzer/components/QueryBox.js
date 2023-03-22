import React from 'react';
import { useEffect, useState } from "react";
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
        <form onSubmit={handleSubmit}>
          <label>
            Dropbox 1:
            <select name="region" value={query.region} onChange={handleDropdownChange}>
            <option >Select</option>
              <option value="US">US</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </label>
          <label>
            Dropbox 2:
            <select name="metric" value={query.metric} onChange={handleDropdownChange}>
            <option >Select</option>
              <option value="dps">dps</option>
              <option value="hps">hps</option>
            </select>
          </label>
          <label>
            Dropbox 3:
            <select name="class" value={query.class} onChange={handleDropdownChange}>
              <option value={null}>Select</option>
              <option value="Paladin">paladin</option>
              <option value="option3">Option 3</option>
            </select>
          </label>
          <label>
            Dropbox 4:
            <select name="grade" value={query.grade} onChange={handleDropdownChange}>
            <option >Select</option>
              <option value="C-">C-</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
      );
    }

export default QueryBox;