import { useEffect, useRef, useState } from "react";
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
import { Dropdown } from "primereact/dropdown";
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
      study_id: "*PLACEHOLDER*",
      p25: 37,
      p25_date: "2025-01-16",
      p50: 74,
      p50_date: "2025-02-22",
      p90: 147,
      p90_date: "2025-05-06",
      p100: 198,
      p100_date: "2025-06-26",
      Total_Sites: 30,
      FSA_Date: "2024-12-10",
      FAP_Date: "2025-03-10",
      CTA_Date: "2025-04-07",
      anchor: "",
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
      fsa_date_color: "f72f04",
      p25_date_color: "76f704",
      p50_date_color: "04f0f7",
      p90_date_color: "e804f7",
      p100_date_color: "e804f7",
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
      fsa_date_color: "#f72f04",
      p25_date_color: "#76f704",
      p50_date_color: "#04f0f7",
      p90_date_color: "#e804f7",
      p100_date_color: "#e804f7",
    },
  ];
  // generateExcelFile();
  // downloadAPIDataInExcelWithCustomHeaders(firstTableData, secondTableData);

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
  type DropdownOption = { label: string; value: string | number };
  type DropdownRef = { hide: () => void; container: HTMLElement };
  // ---------------------------------------END-----------------------------------------
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // Track the open dropdown
  const dropdownRefs = useRef<Map<string, any>>(new Map()); // Store dropdown references

  const options: string[] = ["Pramod", "Prajwal", "Adhi", "Varsha"];

  const handleDropdownClick = (id: string) => {
    // Close the previously open dropdown, if any
    if (openDropdownId && openDropdownId !== id) {
      dropdownRefs.current.get(openDropdownId)?.hide();
    }
    // Open the clicked dropdown
    setOpenDropdownId(id);
  };

  const handleChange = (value: string | number, id: string) => {
    console.log(`Selected ${value} for ${id}`);
  };
  const [value, setValue] = useState('');

  const [rawValue, setRawValue] = useState<string>('0.000'); // Holds the actual numeric value
  const [displayValue, setDisplayValue] = useState<string>('0.000'); // Holds the formatted display value

  console.log("rawValue", rawValue.replace(/,/g, ''));
  console.log("displayValue", displayValue);
  
  
  const formatNumber = (value: string): string => {
    if (!value) return '';
    // Separate integer and decimal parts
    const [integerPart, decimalPart] = value.split('.');
    const formattedInteger = parseInt(integerPart || '0', 10).toLocaleString('en-US'); // Format integer part with commas
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, ''); // Remove commas for processing

    // Allow only valid numbers (integers or floats)
    if (/^\d*\.?\d*$/.test(inputValue)) {
      // setRawValue(inputValue); // Update the raw numeric value
      setDisplayValue(formatNumber(inputValue)); // Update the formatted display value
    }
  };

  return (
    <div className={darkTheme ? "dark" : ""}>
      <div className="dark:bg-red-900 dark:text-white min-h-screen px-4 lg:px-12 pb-20">
        {/* These are special utility classes that Tailwind applies when the parent element has the dark class */}

        <input
        type="text"
        value={displayValue}
        onChange={handleChange2}
        // placeholder="Enter a number"
        className="input-class"
      />

        {/* <div>
          <Dropdown
            options={options}
            onChange={(e) => handleChange(e.value, "dropdown1")}
            placeholder="Select Option for Dropdown 1"
            ref={(el) => el && dropdownRefs.current.set("dropdown1", el)}
            onClick={() => handleDropdownClick("dropdown1")}
          />
          <Dropdown
            options={options}
            onChange={(e) => handleChange(e.value, "dropdown2")}
            placeholder="Select Option for Dropdown 2"
            ref={(el) => el && dropdownRefs.current.set("dropdown2", el)}   // el is the DOM or Dropdown component reference or component instance. If el is truthy (i.e., not null), the Dropdown component reference is stored in the dropdownRefs Map with the key "dropdown4".
            onClick={() => handleDropdownClick("dropdown2")}
          />
          <Dropdown
            options={options}
            onChange={(e) => handleChange(e.value, "dropdown3")}
            placeholder="Select Option for Dropdown 3"
            ref={(el) => el && dropdownRefs.current.set("dropdown3", el)}
            onClick={() => handleDropdownClick("dropdown3")}
          />
          <Dropdown
            options={options}
            onChange={(e) => handleChange(e.value, "dropdown4")}
            placeholder="Select Option for Dropdown 4"
            ref={(el) => el && dropdownRefs.current.set("dropdown4", el)}
            onClick={() => handleDropdownClick("dropdown4")}
          />
        </div> */}

        <div className="flex-1 ml-64 p-6">
          {/* <Header />
      <button onClick={handleDownload}><strong>Download</strong></button> */}

          {/* <StackedBarChartJSIMP/>
          <StackedBarChart2 /> */}
          {/* <StackedBarChartJS ref={chartRef}/> */}
          {/* <StackedBarPlotly />
          <StackedBarChartD3 /> */}

          {/* <LineChartRe /> */}

          <div className="plotly">
            <LineChartPlotly />
          </div>

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
