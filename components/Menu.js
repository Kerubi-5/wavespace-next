const Menu = ({ connectWallet, currentAccount }) => {
  return (
    <header className="flex justify-between items-center px-4 py-2 shadow-md">
      <div>
        <h1 className="text-xl font-extrabold">KK</h1>
      </div>
      {currentAccount ? (
        <div className="flex items-center gap-2 bg-gray-500 p-2 px-4 rounded-md text-white w-24 md:w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="truncate">{currentAccount}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-gray-500 p-2 rounded-md text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <button onClick={connectWallet}>Connect</button>
        </div>
      )}
    </header>
  );
};

export default Menu;
