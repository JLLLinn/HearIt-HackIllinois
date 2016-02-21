Meteor.methods({

  addSoundPost: function (title, soundFileLoc, vizData) {
      //console.log(vizData.length);
      vizData = "hi";
      // Make sure the user is logged in before inserting a task
      if (! Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      SoundPosts.insert({
        title: title,
        emote: "smile.svg",
        soundFile: soundFileLoc,
        soundVizData: vizData,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
  },
  deleteSoundPost: function (clipId) {
    var task = Tasks.findOne(clipId);
    if (task.owner !== Meteor.userId()) {
      //  make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    SoundPosts.remove(clipId);
  }

});
