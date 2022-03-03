## Purpose

This project was completed as part of a group learning exercise. 

## Demo

<img width="395" alt="Stonk Coin Example" src="https://user-images.githubusercontent.com/14803/156642052-36b85b1b-3de3-49ab-8e7d-75acf8e15e10.png">

[https://stonkcoin.netlify.app/](https://stonkcoin.netlify.app/)

## Project Features

The only requirement for this project was the usage of the [Polygon Stock API](https://polygon.io/).

### User Stories

1. ✅ User can see the top 3 gainers and losers from the previous close.

## Technical Specifications

### Dependencies

- react@next
- remix
- prisma
- tailwindcss
- postgres

### Limited API Requests

The majority of the challenge lies in the limited number of requests allowed by the free plan on Polygon. With only five requests per minute we can use a caching layer to avoid errors due a `429 Too Many Requests` status on response.

When a user loads the application it retrieves the lastest cached data and displays that while checking to see if the cache should be updated. If the cache is more than a minute old it will be updated in the background.

## Project Setup

### Local Development

```sh
$ npm run dev
```

### Deployment

```sh
$ npm run build
$ netlify deploy --prod
```
