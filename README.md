# Junk Droor
*Render Order Upon The Chaos*
----
### Beaker project 2

Junk Droor is an organization app which can help you catalog the odd & ends in your household.

[Link to the live site.](https://junkdroor.herokuapp.com/ "Junk Droor live hosted on Heroku")

***
## User Stories
- As a user, I want to create drawers and items to put inside drawers, to aid in organizing my physical belonging.
- As a user, I want to include short descriptions on my drawers, to indicate their location in my home.
- As a user, I want to search for a specific item to remember which drawer I've stored the item in.
- As a user, I want to be able to reorganize my items into different drawers to keep track of them.
- As a user, I want to delete discarded items, and delete unnecessary drawers, to keep my account clean and matching reality.
- As a user, I don't want other users to be able to see my drawers and their contents, for privacy and security concerns.

***
## Technologies Used

#### EJS
Junk Droor is served in the form of Embedded JavaScript files, allowing its html to be dynamically rendered and cleanly compartmentalized. Features of EJS used include:
- Partials
- Dynamic lists
- Conditional messages

#### CSS
Junk Droor employs minimalism in its styling, including no bloated CSS framework that could slow it down. 

#### Node.js & Express
Junk Droor runs on a server bult in node.js and express. Express features include:
- Controllers to aid in route organization
- Sessions to allow user log ins
- Static public folders to serve images and css

#### MongoDB & Mongoose
Junk Droor's server is connected to a MongoDB database via MongoDB Atlas. Three collections of documents (users, drawers, and items) are built to relate in nested one-to-many relationships. Users have drawers, which in turn have items. See the Approach taken section for more information. Mongoose is employed through the server to facilitate database calls for fully RESTful CRUD functionality.

***
## Approach Taken
To construct this application, I first needed to create the User model and enable logging in to a new session. Only then could an authenticated user create Drawers and Items. The connecting of the User, Drawer, and Item models was the primary initial challenge. I chose to use simple id referencing in both directions to create the nested one-to-many relationships between these models. Each parents object contains an propety that is an array of its children's ids (users => drawers, and drawer=> items). Likewise, each child contains a property that is its parent's id (item => drawer, and drawer=>user). This duplication of references is ultimately unnecessary, and could be refactored in the future to strip down the models, but I chose to keep this system because for the the being it makes some database calls slightly easier. In an extremely scalable version of Junk Droor, the slimmer data models would be preferable.

***

## Future Features
- Improved visuals. drawers could be part of a large cabinet graphic that would be animated, potentially in 3D.
- Drag & Drop functionality to move items between drawers.
