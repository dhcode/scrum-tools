# Scrum Tools UI


## Development

Start the backend in the parent folder with:

    docker run -p 6379:6379 --name redis redis:5.0.8-alpine
    npm run start:dev
    
Start the UI in this folder with:

    npm run start
    
Generate graphql based Angular services:

    npm run generate


## Estimation concept

In a scrum estimation process, all team members should have possibility to provide a hidden estimate(vote) on a given topic.
The scrum master provides the topic and the members vote on it. Once all members have voted or the vote is closed, the estimates get revealed to all members and the scrum master.

So we have two roles with different actions:
- Scrum master: setup the session, setup a topic
- Team member: join the session, vote on topic

## Views

### Session overview

Lists all sessions the user has access to.

Each session listed shows:
* Name
* When it was modified the last time
* Role: Master or Member
* Status: whether it is active
* Online: how many members are online

A click on the session leads to either the session master view or the session member view depending on the role.

A button to create a new session leads to the session master view.

A button to join a session leads to the join session view.

### Session create view

View for a user to create a new session, where the user becomes the master.

The user must enter:
* Name
* Description
* Select the default options set or modify it

Then the session can be created with a create session button.


### Session master view

View for the master, who can use this view to setup the session and topics.

The master can:
* Modify name, description, join secret and default options of the session
* Add a topic with name and description
* See the online members
* Remove online members
* See a QR Code with the join link
* See the join link
* Get the master view link

When a topic is created, the master can:
* Modify name and description of the topic
* Reset the votes
* End the vote
* See who has voted

When a vote has ended, the master can:
* See who has chosen which option
* See statistics about the options
* Add a new topic

### Session join view

Lets someone join a session, which is then added to the list of sessions.

The user can enter:
* Name
* Session ID
* Join Password

The join button leads upon success to the session member view

### Member session view

When a user opens a session, the session view is shown.
The user can join the session, if not yet a member of the session.

The user can see:
* Name of the session
* Description of the session
* Members of the session

When a topic is active the user can:
* See the topic name and description
* Vote on one of the options
* Change the vote if already voted and the vote is not closed

When the topic vote has ended the user can:
* See the result
* See who voted for what

The user can always leave the session with a leave button.

