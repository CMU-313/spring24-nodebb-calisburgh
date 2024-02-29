1. Frontend Feature: display user account type next to user username on posts created 

Overview: 
Previously, topics/posts created only have usernames, however, it would be more helpful to include
account type information as well so students would know if they are seeing responses to instructors or other students 

Changes Made: 
Modifications made in themes/nodebb-theme-persona/templates/partials/topic/post.tpl to show account type for post user and backend code was modified slightly in src/topics/posts.js and src/posts/user.js to return account type information for the user.

To see Change: 
1. Register a new user as usual, select 'student' as account type
2. Create a new topic in any category
3. The topic created should show 'student' next to the username with a dash in between 
4. Can repeat process above for 'instructor' 

#######

2. Frontend Feature: IN PROGRESS show dropdown of groups the user is in while creating new topic to post it only to one specific group 

Overview: 
Previously, topics/posts created are added to every single group the user is in, this is not very helpful in separating information from one group to another. 

Changes Made: 
nodebb-plugin-composer-default identified as the plugin responsible for generating Topic Creation Form/Pop up

Created a copy and made modifications to it to include a second dropdown, later to be showing list of groups the user is in.
Other changes involves changing instances of nodebb-plugin-composer-default to nodebb-plugin-composer-default-modified to get the code running and working.

To see Change: 
1. Log in as any kind of user 
2. Go into a category 
3. Select 'New Topic' 
4. Currently, the pop up will display two identical dropdowns to select category to post in (the second one will be modified in the future to be a dropdown for group names the user is in)