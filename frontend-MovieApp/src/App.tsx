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
import CumulativeStackedBarChart from "./pages/ReCharts/StackedBarChart2";
import StackedBarChartJSIMP from "./pages/Chart.js/StackedBarChartJSIMP";
import { generateExcelFile } from "./pages/Excel/downloadExcel";
import { downloadAPIDataInExcelWithCustomHeaders } from "./pages/Excel/downloadExcelFun";
// import StackedBarChartD3 from "./pages/D3.js/StackedBarChartD3";
import { Chart as ChartJS } from "chart.js";
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
  const firstTableData = [
    {
        study_id: "Study001",
        Total_Sites: 25,
        FSA_Date: "2024-11-15",
        p25: 5,
        p25_date: "2024-11-01",
        p50: 12,
        p50_date: "2024-11-10",
        p90: 20,
        p90_date: "2024-11-20",
        p100: 25,
        p100_date: "2024-11-30",
    },
    
];

// Sample data for the second table
const secondTableData = [
    {
        country: "USA",
        total_sites: 50,
        median_first_site: 8,
        country_fsa: "2024-11-02",
        p25: 10,
        country_p25_date: "2024-11-04",
        p50: 20,
        country_p50_date: "2024-11-10",
        p90: 40,
        country_p90_date: "2024-11-18",
        p100: 50,
        country_p100_date: "2024-11-25",
        fsa_date_color: 'f72f04',
        p25_date_color: '76f704',
        p50_date_color: '04f0f7',
        p90_date_color: 'e804f7',
        p100_date_color: 'e804f7'
    },
    {
        country: "India",
        total_sites: 30,
        median_first_site: 6,
        country_fsa: "2024-11-05",
        p25: 7,
        country_p25_date: "2024-11-07",
        p50: 15,
        country_p50_date: "2024-11-12",
        p90: 25,
        country_p90_date: "2024-11-22",
        p100: 30,
        country_p100_date: "2024-11-30",
        fsa_date_color: '#f72f04',
        p25_date_color: '#76f704',
        p50_date_color: '#04f0f7',
        p90_date_color: '#e804f7',
        p100_date_color: '#e804f7',

    },
];
  // generateExcelFile();
  downloadAPIDataInExcelWithCustomHeaders(firstTableData, secondTableData);

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

  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  const handleDownload = () => {
    if (chartRef.current) {
      const imageBase64 = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = imageBase64;
      link.click();
    } else {
      console.error("Chart reference is null. Cannot download image.");
    }
  };

  // ---------------------------------------END-----------------------------------------
  return (
    <div className={darkTheme ? "dark" : ""}>
      <div className="dark:bg-red-900 dark:text-white min-h-screen px-4 lg:px-12 pb-20">
        {" "}
        {/* These are special utility classes that Tailwind applies when the parent element has the dark class */}
        

        <div className="flex-1 ml-64 p-6">
          {/* <Header />
      <button onClick={handleDownload}><strong>Download</strong></button> */}


          {/* <StackedBarChartJSIMP/>
          <StackedBarChart2 /> */}
          {/* <StackedBarChartJS ref={chartRef}/> */}
          {/* <StackedBarPlotly />
          <StackedBarChartD3 /> */}

          {/* <LineChartRe /> */}
          
          {/* <div className="plotly">
            <LineChartPlotly />
          </div> */}

          {/* <LineChartJS /> */}

          {/* </div> */}
          {/*
           */}

          {/* <ScalableDropdown /> */}

          {/* <div>
            <GraphApp />
          </div> */}
          <br />
          {/* <DashBoard /> */}

          {/* <div className="login">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
