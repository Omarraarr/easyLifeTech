const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className=" bg-background dark:bg-red-500 text-primary dark:text-white p-6">
      <h1 className="text-2xl mb-2">🏠 Welcome {user?.name}</h1>
      <p>Your role is: {user?.type}</p>
    </div>
  );
};

export default Home;