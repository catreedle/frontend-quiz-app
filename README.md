# Frontend Mentor - Frontend quiz app solution

This is a solution to the [Frontend quiz app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/frontend-quiz-app-BE7xkzXQnU). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Select a quiz subject
- Select a single answer from each question from a choice of four
- See an error message when trying to submit an answer without making a selection
- See if they have made a correct or incorrect choice when they submit an answer
- Move on to the next question after seeing the question result
- See a completed state with the score after the final question
- Play again to choose another subject
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Navigate the entire app only using their keyboard
- **Bonus**: Change the app's theme between light and dark

### Screenshot

![](/screenshot.jpeg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://frontend-quiz-catreedle.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Vanilla JS

### What I learned

I learned to use data-theme on css to switch between two color sets theme

```css
[data-theme="dark"] {
  --main-background-color: var(--color-dark-navy);
  --background-color: var(--color-navy);
  --main-text-color: var(--color-pure-white);
  --secondary-text-color: var(--color-light-bluish);
  --background-image-mobile: url("/assets/images/pattern-background-mobile-dark.svg");
  --background-image-tablet: url("/assets/images/pattern-background-tablet-dark.svg");
  --background-image-desktop: url("/assets/images/pattern-background-desktop-dark.svg");
}
```

```js
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
}
```

### Continued development

Need to refactor for readability, also there's some bug with the toggle dark/light mode.

### Useful resources

- [How TO - Toggle Switch](https://www.w3schools.com/howto/howto_css_switch.asp) - This helped me create the toggle switch.

## Author

- Website - [Purnama S Rahayu](https://www.purnamaa.dev)
- Frontend Mentor - [@catreedle](https://www.frontendmentor.io/profile/catreedle)
