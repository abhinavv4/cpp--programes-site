# C++ Programming Examples

A clean static C++ reference page with grouped examples, instant search, copy-ready code blocks, and a responsive sidebar.

## Highlights

- 33 C++ example programs
- Grouped topics for faster browsing
- Live search with sidebar filtering
- One-click code copy
- Syntax highlighting with Highlight.js
- Responsive layout with theme toggle

## Project Structure

```text
web/
└── cpp library/
    ├── index.html   # page structure and program cards
    ├── style.css    # layout, theme, and responsive styling
    ├── script.js    # search, TOC, copy buttons, and interactions
    └── ReadMe.md    # project documentation
```

## What's Inside

The page is organized into these topic groups:

- Getting Started
- Arrays and Search
- Sorting
- Practice and Utility
- Class Basics
- Inheritance and Polymorphism
- Advanced OOP

Some included programs:

- Hello World
- Pattern Making
- 1D Array and 2D Array
- Linear Search and Binary Search
- Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort
- Factorial and Fibonacci examples
- Stack Push/Pop Function
- Class-Object and constructor examples
- Pure Virtual Function and inheritance examples
- Operator overloading examples
- Friend Function
- Static Data Member and Static Member Function
- Array of Object
- Simple Calculator

## Files

- [index.html](/d:/2.PROGRAMS/web/cpp liberay/index.html) contains the grouped `.topic-group` and `.program-section` markup.
- [style.css](/d:/2.PROGRAMS/web/cpp liberay/style.css) controls the visual design, spacing, cards, sidebar, and responsive behavior.
- [script.js](/d:/2.PROGRAMS/web/cpp liberay/script.js) generates the sidebar links, search behavior, copy buttons, section ids, and theme state.

## How to Run

1. Open [index.html](/d:/2.PROGRAMS/web/cpp liberay/index.html) in a modern browser.
2. Browse topics from the sidebar.
3. Use the search bar to filter programs by title, group, or keywords.

No build step is required.

## How to Add a New Program

Add the new example inside the correct topic group in [index.html](/d:/2.PROGRAMS/web/cpp liberay/index.html).

Use this format:

```html
<article class="program-section" data-keywords="extra search terms">
  <h3>Program Title</h3>
  <pre><code>
// your C++ code here
  </code></pre>
</article>
```

Keep in mind:

- Each entry should stay inside a `.topic-group`.
- Add useful `data-keywords` so search works better.
- The sidebar links, copy button, and search indexing are handled automatically by [script.js](/d:/2.PROGRAMS/web/cpp liberay/script.js).

## Libraries Used

- Google Fonts
- Font Awesome
- Highlight.js

## Maintenance Notes

- If a program does not appear in search, confirm it uses the `.program-section` structure.
- If a program is added but the sidebar looks outdated, refresh the page once.
- Renaming a program heading is safe because section ids are generated automatically.
