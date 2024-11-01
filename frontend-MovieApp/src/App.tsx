import { useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { useAppDispatch, useAppSelector } from "./hooks/storeHook";
import { getMovies, addMovie } from "./features/movies/movieSlice";
import MovieCard from "./components/MovieCard/MovieCard";
import { stat } from "fs";
import SearchBox from "./components/SearchBox/SearchBox";
import { toggleSearch } from "./features/search/searchSlice";
import { useSelector } from "react-redux";
import { selectFilteredMovies } from "./features/movies/movieSlice";
import Posts from "./components/Posts/Posts";
import Login from "./components/Login";
import DashBoard from "./pages/dashboard/DashBoard";
import ScalableDropdown from "./pages/dummy/SearchableDropdown";
import GraphApp from "./pages/graphs/GraphApp";
import StackedBarChart2 from "./pages/ReCharts/StackedBarChart2";
import StackedBarChartJS from "./pages/Chart.js/StackedBarChartJS";
import StackedBarPlotly from "./pages/Plotly.js/StackedBarPlotly";
import StackedBarChartD3 from "./pages/D3JS/StackedBarChartD3";
import LineChartRe from "./pages/ReCharts/LineChartRe";
import LineChartJS from "./pages/Chart.js/LineChartJS";
import LineChartPlotly from "./pages/Plotly.js/LineChartPlotly";
// import StackedBarChartD3 from "./pages/D3.js/StackedBarChartD3";
function App() {
  // -----------------------------1----------------------------------------------------
  // const wholeAppState = useAppSelector((state) => state); // Object destructuring --By doing this will get the complete store data with it's current state.
  // const darkTheme = wholeAppState.darkTheme;
  // const movieState = wholeAppState.movies;

  // -----------------------------2----------------------------------------------------
  // OR use Object DeStructuring as below
  // const {darkTheme, movies} = useAppSelector((state) => state);

  // -----------------------------3----------------------------------------------------
  //But below is a best way, By accessing only those slice data that is needed
  const darkTheme = useAppSelector((state) => state.darkTheme);
  const movies = useAppSelector((state) => state.movies);
  const searchTerm = useAppSelector((state) => state.search);

  // -----------------------------END----------------------------------------------------

  const dispatch = useAppDispatch();

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const handleSubmit = () => {
    const newMovie = {
      title: "Pramod WOrld!",
      body: "This is My own Movie",
      userId: 123,
      id: 51, // Example userId, could be dynamic
    };

    dispatch(addMovie(newMovie));
  };

  const handleButtonClick = () => {
    if (searchRef.current) {
      dispatch(toggleSearch(searchRef.current?.value));
    }
  };

  // ---------------------------------------START-----------------------------------------
  // Better to use Memoized Selectors
  // const searchedMovies = Array.isArray(movies.data) && movies.data.filter((movie) => {
  //   if(!searchTerm.length) return movie;

  //   if(!movie.title) return;

  //   return movie.title.toLowerCase().includes(searchTerm);
  // })

  // Using Memorized selectFilterdMovies.
  const searchedMovies = useSelector(selectFilteredMovies);
  // console.log("searchedMovies", searchedMovies);

  // ---------------------------------------END-----------------------------------------
  return (
    <div className={darkTheme ? "dark" : ""}>
      <div className="dark:bg-red-900 dark:text-white min-h-screen px-4 lg:px-12 pb-20">
        {" "}
        {/* These are special utility classes that Tailwind applies when the parent element has the dark class */}
        <div className="flex-1 ml-64 p-6">
          <Header />
        
            <StackedBarChart2 />
            {/* <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            <LineChartRe />
            <LineChartPlotly />
            <LineChartJS />
            {/* </div> */}
            <StackedBarChartJS />
            <StackedBarChartD3 />
            <StackedBarPlotly />

            <ScalableDropdown />
          

          {/* <div>
            <GraphApp />
          </div> */}
          <br />
          <DashBoard />
          <Login />

          <Posts />
          <div className="mb-12 flex">
            <SearchBox ref={searchRef} />
            <button onClick={handleButtonClick}>Search</button>
            <button onClick={handleSubmit}>Add a Movie</button>
          </div>
          {searchedMovies &&
            searchedMovies.map((movie: any) => {
              const { id, title, body } = movie;
              return <MovieCard id={id} title={title} body={body} key={id} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
