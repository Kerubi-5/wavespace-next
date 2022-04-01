export default function Home() {
  return (
    <div className="container mx-auto px-4 text-center py-9 font-roboto bg-gray-50 m-5 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500">
        Hey There
      </h1>
      <p className="text-base font-semibold text-gray-500">
        <span>👋</span> My name is John Kim A. Querobines, Click the button
        below to wave at me!
      </p>
      <button className="font-semibold px-4 py-2 m-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-white mt-5">
        Wave at Me
      </button>
    </div>
  );
}
