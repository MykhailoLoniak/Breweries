# Brewery Explorer

A small application for browsing breweries from the OpenBreweryDB API,\
featuring a virtualized list, bidirectional infinite scrolling,\
and a detailed view for each brewery.

------------------------------------------------------------------------

## How to Run

``` bash
npm install
npm run dev
```

Then open:

    http://localhost:3000

------------------------------------------------------------------------

## Features

### 🔹 1. Brewery List

-   Loads **15 breweries** on the first render.
-   The app **never renders more than 15 items at once** --- thanks to
    windowing.
-   The scrolling experience is smooth and consistent.

------------------------------------------------------------------------

### 🔹 2. Bidirectional Infinite Scroll

The list behaves like a real continuous feed:

-   When the user scrolls **down** and about 5 items remain to the
    bottom,\
    the next page is fetched automatically.
-   When scrolling **up**, the list brings back the previous items.
-   At any moment, **only 15 items are present in the DOM**.

This keeps the interface fast and lightweight even with large datasets.

------------------------------------------------------------------------

### 🔹 3. Selection & Deletion

-   Right--click on a card toggles selection.
-   A **Delete** button appears in the header when at least one item is
    selected.
-   After deletion:
    -   the selected breweries disappear,
    -   if fewer than 15 items remain --- new ones are automatically
        fetched.

------------------------------------------------------------------------

### 🔹 4. Brewery Details Page

Clicking a card opens:

    /brewery/[id]

The detail page includes: - name, - type, - address, - phone, -
website, - open in maps button.

------------------------------------------------------------------------

## Technologies

-   **Next.js 14 (App Router)**
-   **React 18**
-   **Zustand** --- state and windowing logic
-   **Tailwind CSS**
-   **Axios**
-   **TypeScript**

------------------------------------------------------------------------

## Project Structure

    project/
     ├─ app/
     │   ├─ page.tsx               ← brewery list
     │   └─ brewery/[id]/page.tsx  ← brewery details
     │
     ├─ components/
     │   ├─ BreweryList.tsx
     │   ├─ BreweryCard.tsx
     │   ├─ BreweryActionLink.tsx
     │   └─ DeleteSelectedButton.tsx
     │
     ├─ store/
     │   └─ breweriesStore.ts       ← windowing + scroll logic
     │
     ├─ lib/
     │   ├─ api.ts                  ← API functions
     │   └─ types.ts                ← Type definitions
     │
     └─ README.md

------------------------------------------------------------------------

## Windowing Logic

State contains: - **breweries\[\]** --- all loaded data -
**visible\[\]** --- the current 15-item window - **startIndex** --- the
index of the first visible item

Scrolling actions: - `moveWindowDown()` increases `startIndex` -
`moveWindowUp()` decreases `startIndex` - `visible` updates
automatically

This ensures the list stays efficient and responsive.

------------------------------------------------------------------------

## API

Using the public OpenBreweryDB:

    GET https://api.openbrewerydb.org/v1/breweries?page={n}&per_page=15
    GET https://api.openbrewerydb.org/v1/breweries/{id}

------------------------------------------------------------------------

## Purpose

This project was created as a test task.\
The codebase is designed to be clean, predictable, and easy to extend.
