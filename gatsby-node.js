const firebase = require("firebase-admin");
const crypto = require('crypto');


const getDigest = id => crypto
  .createHash('md5')
  .update(id)
  .digest('hex');

exports.sourceNodes = async ({ boundActionCreators }, { types, credential }) => {
  firebase.initializeApp({ credential: firebase.credential.cert(credential) });
  const db = firebase.firestore();

  const { createNode, createNodeField } = boundActionCreators;

  const promises = types.map(async ({
    collection,
    type,
    populate,
    map = node => node,
  }) => {
    const snapshot = await db.collection(collection).get();
    for (let doc of snapshot.docs) {
      const contentDigest = getDigest(doc.id);
      const node = createNode({
        ...map(doc.data()),
        id: doc.id,
        parent: null,
        children: [],
        internal: {
          type,
          contentDigest,
        },
      });

      Promise.resolve();
    }
  })

  await Promise.all(promises);

  return;
};
