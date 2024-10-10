import { forwardRef } from "react";

interface SearchBoxProps {
}

const SearchBox = forwardRef<HTMLInputElement,SearchBoxProps>((props, ref) => {
    return (
      <input
        ref={ref}
        type="search"
        placeholder="Search....."
        className="block p-4 pl-10 focus:outline-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-50 dark:bg-gray-300"
      />
    );
  });

export default SearchBox;
