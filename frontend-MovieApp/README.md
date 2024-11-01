# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


Install:
1. npm install react-plotly.js plotly.js
2. npm install --save-dev @types/plotly.js


3. npm install d3
4. npm install --save-dev @types/d3

5. npm install react-slider
6. npm i --save-dev @types/react-slider



# Use filtering logic inside the Redux slice if:
Your filtering logic is simple and directly tied to the state.
You want to keep everything centralized for easy debugging and traceability.
Performance is not a major concern (small to medium datasets).

# Use a separate filtering function if:
The filtering logic is complex, may evolve, or needs to be reused.
You need finer control over performance or want to avoid triggering unnecessary state updates in Redux.
You prefer to keep your Redux slice focused only on state and delegate business logic elsewhere.


# Both
Implementing the filtering logic in a separate function and then updating the Redux state is a balanced approach. It provides the benefits of separation of concerns (keeping filtering logic out of the Redux slice) while still allowing Redux to manage the state and re-render components as needed. This approach is scalable and maintains performance optimization by ensuring that filtering logic doesn’t bloat the Redux slice.