# C++ Programming Examples

A comprehensive collection of standard C++ algorithms, data structures, and object-oriented programming concepts presented in a clean, navigable static website.

## 🚀 Features

- **Dynamic Table of Contents**: Automatically generates a sidebar navigation based on the programs listed in the HTML.
- **Syntax Highlighting**: Uses [Highlight.js](https://highlightjs.org/) for beautiful C++ code presentation.
- **Search Functionality**: Filter programs instantly using the sidebar search box.
- **Copy to Clipboard**: One-click button to copy code snippets directly to your clipboard.
- **Responsive Design**: Mobile-friendly sidebar with toggle support for smaller screens.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Styling and layout.
- **JavaScript (ES6+)**: DOM manipulation for dynamic TOC, search, and interactivity.
- **Font Awesome**: Icons for UI elements.
- **Highlight.js**: Syntax highlighting for code blocks.

## 📖 How to Run

1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Browse through the topics in the sidebar or use the search bar to find specific algorithms.

## 📝 Included Programs

The collection currently includes:
- **Basics**: Hello World, Factorial (Iterative & Recursive), Fibonacci Series.
- **OOP Concepts**: 
  - Pure Virtual Functions
  - Friend Functions
  - Inheritance (Single, Multiple, Multilevel, Hierarchical, Hybrid)
  - Operator Overloading (Arithmetic, Unary)
- **Algorithms**:
  - **Searching**: Linear Search, Binary Search.
  - **Sorting**: Bubble Sort, Quick Sort, Merge Sort.

## 🤝 Contributing

To add a new program:
1. Open `index.html`.
2. Inside the `<main>` tag, add a `<span><h3>Program Title</h3></span>` followed by a `<pre><code>...</code></pre>` block containing your C++ code.
3. The JavaScript will automatically detect the new entry, format it, and add it to the navigation sidebar.
