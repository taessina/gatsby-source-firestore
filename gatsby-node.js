const report = require('gatsby-cli/lib/reporter');
const firebase = require('firebase-admin');
const crypto = require('crypto');

const getDigest = id =>
  crypto
    .createHash('md5')
    .update(id)
    .digest('hex');

exports.sourceNodes = async (
  { boundActionCreators },
  { types, credential }
) => {

  try {
    firebase.initializeApp({ credential: firebase.credential.cert(credential) });
  } catch (e) {
    report.warn('Could not initialize Firebase. Please check `credential` property in gatsby-config.js');
    report.warn(e);
    return;
  }

  const db = firebase.firestore();

  try {
    // To hide the Firestore timestamp warning
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);
  } catch (e) {
    console.log(`ERROR on update the db settings`)
    console.error(e)
  }

  const { createNode, createNodeField } = boundActionCreators;

  const promises = types.map(
    async ({ collection, type, populate, map = node => node }) => {
      const snapshot = await db.collection(collection).get();
      for (let doc of snapshot.docs) {
        const contentDigest = getDigest(doc.id);
        const node = createNode(
          Object.assign({}, map(doc.data()), {
            id: doc.id,
            parent: null,
            children: [],
            internal: {
              type,
              contentDigest,
            },
          })
        );

        Promise.resolve();
      }
    }
  );

  await Promise.all(promises);

  return;
};
