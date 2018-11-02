# gatsby-source-firestore [![npm version](https://badge.fury.io/js/gatsby-source-firestore.svg)](https://badge.fury.io/js/gatsby-source-firestore)

Gatsby source plugin for building websites using the Firestore as a data source.

# Usage
1. First you need to download a Private Key from firebase for privileged environments, find out how to get it here: https://firebase.google.com/docs/admin/setup (or click the settings gear > Service accounts tab > Generate New Private Key button at the bottom)
2. Put that private key (json file) somewhere in your Gatsby project.
3. `$ yarn add gatsby-source-firestore`
4. Configure `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-firestore',
      options: {
        credential: require("./firebase.json"),
        types: [
          {
            type: 'Book',
            collection: 'books',
            map: doc => ({
              title: doc.title,
              isbn: doc.isbn,
              author___NODE: doc.author.id,
            }),
          },
          {
            type: 'Author',
            collection: 'authors',
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
};

```
Note: that you will need to have books and authors in firestore matching this schema before gatsby can query correctly. e.g books__NODE on author needs to be an array with "books" as a key of reference types to book documents.

5. To query
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

# Configurations
Key|Description
---|---
credential|Require your private key here
types| Array of types, which require the following 3 keys
type|The type of the collection, which will be used in GraphQL queries. Eg, when `type = Book`, the GraphQL types are named `book` and `allBook`
collection|The name of the collections in Firestore. Nested collections are **not** tested.
map|A function to map your data in Firestore to Gatsby nodes, utilize the undocumented `___NODE` to link between nodes

# Disclaimer
This project is created solely to suit our requirements, no maintenance/warranty are provided. Feel free to send in pull requests.

# Acknowledgement
[gatsby-source-firebase](https://github.com/ReactTraining/gatsby-source-firebase)
