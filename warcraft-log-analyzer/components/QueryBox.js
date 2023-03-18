import React from 'react';

const QueryBox = ({ onQuerySubmit }) => {
    const [query, setQuery] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onQuerySubmit(query);
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
};

export default QueryBox;