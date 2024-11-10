# Hacker News Search App

An interactive search app for Hacker News articles with user login and search history tracking. Built with React and Redux Toolkit, it offers features like keyword search, filtering options, and paginated results.

## Features

- **Search Hacker News** by keywords.
- **Search History** tracking (view and clear history after login).
- **Filter Options** search bar, for ,by , search.
- **User Login** with personalized history.

## Technologies Used

- **React**
- **Redux Toolkit**
- **React Router**
- **Tailwind CSS**
- **JavaScript (ES6+)**
- **Hacker News API**

## Setup and Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Sachinnegi825/Search_Hacker_News_Clone.git
   ```

2. Navigate into the project directory:

   ```bash
   cd hacker-news-search
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be running at `➜  Local:  `http://localhost:5173/`.

## How It Works

### Searching Hacker News

1. On the **Home page**, type a query in the search bar .
2. Use **filters** to sort results by date or popularity.
3. The app will display a list of relevant articles based on your search and filters.

### Search History

- **After login**, users can view their past search history.
- The **Search History page** displays queries with timestamps.
- Users can **clear history** by clicking the "Clear History" button.

### User Authentication

- Users can log in and have a personalized search history.
- The **login page** authenticates users, and once logged in, they can see their search history.
