// https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function tweetsBy(screenName) {
  // See https://developer.twitter.com/en/docs/tweets/timelines/guides/working-with-timelines
  //   User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
  // The timeline returned is the equivalent of the one seen as a user's profile on Twitter.
  // This method can only return up to 3,200 of a user's most recent Tweets. Native retweets of other statuses by the user is included in this total, regardless of whether include_rts is set to false when requesting this resource.
  return client.get('statuses/user_timeline', { screen_name: screenName })
  .catch((e) => {
    console.log('failed to get timeline for user', screenName, e)
  })
}

function destroy(id) {
  return client.post('statuses/destroy', { id: 'any', trim_user: true,  })
  .catch((e) => {
    console.log('failed to delete tweet:', id, e)
  })
}

export function eraseAllTweetsBy(screenName) {
  tweetsBy(screenName).then((tweets) => {
    const deletionOps = tweets.map((t) => destroy(t.id_str))
    // uncommenting this line will erase your ENTIRE timeline: /* return Promise.all(deletionOps) */
  }).catch((e) => {
    console.log('caught error during mass deletion of entire timeline', e)
  })
}
