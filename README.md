# GraphQL Profile Page
## Overview
This project involves creating a personalized profile page using GraphQL queries to fetch and display user data from a school's database. The application includes a login system and interactive graphs to visualize the user's academic progress.
Features

## Login Page

Supports authentication with username:password or email:password
Implements JWT (JSON Web Token) for secure API access
Displays appropriate error messages for invalid credentials
Includes a logout functionality


## Profile Page

Displays at least three pieces of user information (e.g., basic user identification, XP amount, grades, audits, skills)
Features a statistics section with at least two different types of graphs created using SVG
Utilizes GraphQL queries to fetch user-specific data


## Interactive Graphs

Visualizes data such as XP progress over time, project success rates, audit ratios, etc.
Implements SVG for creating responsive and potentially animated graphs


## Hosting

The completed profile page is hosted online (e.g., GitHub Pages, Netlify)


## Technical Requirements

* Frontend: HTML, CSS, JavaScript
* GraphQL for data querying
* SVG for graph creation
* JWT for authentication
* Hosting platform of choice

## API Reference

#### Get all items

```https
  POST GraphQL API: https://((DOMAIN))/api/graphql-engine/v1/graphql

```

```https
  POST Authentication: https://((DOMAIN))/api/auth/signin ( in our case //learn.zone01dakar.sn)
```

## Setup and Installation

* Clone the repository
* Install dependencies (if any)
* Set up environment variables for API endpoints
* Run the application locally for development

## Deployment
Instructions for deploying the application to your chosen hosting platform.
Learning Objectives

* GraphQL query language
* JWT authentication
* UI/UX design principles
* SVG graph creation
* API integration
* Web application hosting

## Contributors
### Kalla Moussa Gueye
### Yero Ba