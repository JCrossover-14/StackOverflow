function Header({ setCurrentPage, setInputVal }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentPage("searchResults");
    setInputVal(document.getElementById("searchbar").value);
  };

  return (
    <div className="header">
      <h1 className="title">Fake StackOverflow</h1>
      <form id="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="searchbar"
          className="searchbar"
          placeholder="Search..."
        />
      </form>
    </div>
  );
}

export default Header



