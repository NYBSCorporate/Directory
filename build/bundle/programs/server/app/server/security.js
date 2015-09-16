(function(){
/* Collections: Committees, Member, Member_Committee_Track */


/* Committees Collection security rules */
/*
- Insert: Only admin and committees manager should be able to create new Committees
- Update: Only admin and committees manager should be able to update Committees (at least until access is given to each chair)
- Delete: Only admin and committees manager should be able to remove Committees
*/

// Clients may insert posts only if a user is logged in
Committees.permit(['insert', 'update', 'remove']).ifHasRole('admin','committees-manager').apply();


/* Members Collection security rules */
/*
- Insert: Only admin and members manager should be able to create new member
- Update: Only admin and members manager should be able to update members (will need to see how to enforce a specific field security)
- Delete: Only admin and members manager should be able to remove members
- Members can update their profile (only changing name, phone, location, description)
*/

// Clients may insert posts only if a user is logged in
Members.permit(['insert', 'update', 'remove']).ifHasRole('admin','members-manager').apply();

// Will need to see how to restrict access to only given profile based on UserID
Members.permit(['update']).ifLoggedIn().onlyProps(['name','phone','location','description','updatedAt']).apply();


/* MemberCommitteeTrack Collection security rules */
/*
- Insert: Only admin and committees manager should be able to create new Committees
- Update: Only admin and committees manager should be able to update Committees (at least until access is given to each chair)
- Delete: Only admin and committees manager should be able to remove Committees
- Members can update their profile and join/leave committees
*/

// Clients may insert posts only if a user is logged in
MemberCommitteeTrack.permit(['insert', 'update', 'remove']).ifHasRole('admin','committees-manager').apply();
// Will need to see how to restrict update to member's documents based on UserID
MemberCommitteeTrack.permit(['update']).ifLoggedIn().onlyProps(['member_id','committee_id']).apply();



})();
