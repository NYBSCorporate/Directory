(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var wrapAsync;

(function () {

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/meteorhacks:aggregate/index.js                            //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
wrapAsync = (Meteor.wrapAsync)? Meteor.wrapAsync : Meteor._wrapAsync; // 1
Mongo.Collection.prototype.aggregate = function(pipelines) {          // 2
  var coll;                                                           // 3
  if (this.rawCollection) {                                           // 4
    // >= Meteor 1.0.4                                                // 5
    coll = this.rawCollection();                                      // 6
  } else {                                                            // 7
	// < Meteor 1.0.4                                                    // 8
    coll = this._getCollection();                                     // 9
  }                                                                   // 10
  return wrapAsync(coll.aggregate.bind(coll))(pipelines);             // 11
}                                                                     // 12
                                                                      // 13
////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:aggregate'] = {};

})();

//# sourceMappingURL=meteorhacks_aggregate.js.map
