// Meteor.publish('users', function () {
//   return Meteor.users.find({}, { fields: { profile: 1 } });
// });

//registers a publication named "tasks"
Meteor.publish('soundPosts', function () {
    return SoundPosts.find({});
});
