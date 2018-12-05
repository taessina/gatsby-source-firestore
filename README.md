# gatsby-source-firestore

[![npm version](https://badge.fury.io/js/gatsby-source-firestore.svg)](https://badge.fury.io/js/gatsby-source-firestore)

Gatsby source plugin for building websites using
[Firebase Firestore](https://firebase.google.com/products/firestore)
as a data source

## Usage

1. Generate and download a Firebase Admin SDK private key by accessing the
   [Firebase Project Console > Settings > Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)

2. Rename and put the downloaded `.json` crendtial file somewhere in the
   GatsbyJS project (e.g. `./credentials.json`)

3. Add `gatsby-source-firestore` as a dependency by running using `npm` or `yarn`:

   ```sh
   npm i gatsby-source-firestore
   # or
   yarn add gatsby-source-firestore
   ```

4. Configure settings at `gatsby-config.js`, for example:

   ```js
   module.exports = {
      plugins: [
        {
          resolve: `gatsby-source-firestore`,
          options: {
            credential: require(`./credentials.json`),
            types: [
              {
                type: `Book`,
                collection: `books`,
                map: doc => ({
                  title: doc.title,
                  isbn: doc.isbn,
                  author___NODE: doc.author.id,
                }),
              },
              {
                type: `Author`,
                collection: `authors`,
                map: doc => ({
                  name: doc.name,
                  country: doc.country,
                  books___NODE: doc.books.map(book => book.id),
                }),
              },
            ],
          },
        },
      ],
    }
   ```

   Note that you will need to have `books` and `authors` in Firestore matching
   this schema before Gatsby can query correctly, e.g `books__NODE` on `author`
   needs to be an array with `books` as a key of reference types to `book`
   documents.

5. Test GraphQL query:

    ```graphql
    {
      allBooks {
        edges {
          node {
            title
            isbn
            author {
              name
            }
          }
        }
      }
    }
    ```

## Configurations

| Key                | Description                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `credential`       | Credential configurations from downloaded private key                                                                                        |
| `types`            | Array of types, which require the following keys (`type`, `collection`, `map`)                                                               |
| `types.type`       | The type of the collection, which will be used in GraphQL queries, e.g. when `type = Book`, the GraphQL types are named `book` and `allBook` |
| `types.collection` | The name of the collections in Firestore. **Nested collections are not tested**                                                              |
| `types.map`        | A function to map your data in Firestore to Gatsby nodes, utilize the undocumented `___NODE` to link between nodes                           |

## Disclaimer

This project is created solely to suit our requirements, no maintenance or
warranty are provided. Feel free to send in pull requests.

## Acknowledgement

- [ryanflorence/gatsby-source-firebase](https://github.com/ryanflorence/gatsby-source-firebase)
