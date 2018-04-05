# gatsby-source-firestore [![npm version](https://badge.fury.io/js/gatsby-source-firestore.svg)](https://badge.fury.io/js/gatsby-source-firestore)

Gatsby source plugin for building websites using the Firestore as a data source.

# Usage
1. Get a private key for your Firebase project.
2. Put that private key somewhere in your Gatsby project.
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
