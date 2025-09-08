1) What is the difference between var, let, and const?

answer: *
 `var`: Function-scoped and can be re-declared and updated.
`let`: Block-scoped and can be updated but not re-declared.
`const`: Block-scoped and cannot be re-declared or updated.

2) What is the difference between map(), forEach(), and filter()? 

map(): Creates a new array by applying a function to each element of the original array. The new array has the same length. It's used for transformation.

filter(): Creates a new array containing only the elements that pass a test (a function that returns true or false). It's used for creating a subset of the original array.

forEach(): Executes a function for each element of the array but does not return a new array. It is typically used for side effects, like logging to the console or modifying an external variable.

3) What are arrow functions in ES6?

Arrow functions, or "fat arrow" functions, are a more concise way to write function expressions in ES6. They don't have their own this, arguments, super, or new.target bindings. They are best suited for non-method functions.

An arrow function can be written like this: (param1, param2) => { statements }

4) How does destructuring assignment work in ES6?

Destructuring assignment is an ES6 feature that allows you to unpack values from arrays or properties from objects into distinct variables. It provides a cleaner and more efficient way to extract data

5) Explain template literals in ES6. How are they different from string concatenation?

Template literals are strings enclosed by backticks (`) that allow for embedded expressions (${expression}).

Differences from String Concatenation
Syntax: Template literals use ${} inside backticks, while concatenation uses the + operator.

Readability: Template literals are cleaner and easier to read, especially with multiple variables.

Multiline Support: Template literals can span multiple lines without needing a newline character (\n).