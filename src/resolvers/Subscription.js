// This function is used to resolve subscriptions and push the event data.
function newLinkSubscribe(parent, args, context, info) {
  // subscription return an asyncIterator to push event data
  return context.pubSub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  // resolve will actually return the data
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
};
